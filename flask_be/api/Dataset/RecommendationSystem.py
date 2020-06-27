import csv
import ast
import sys
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np
import pandas as pd
from flask import request
from app import response
from datetime import datetime
from flask_restful import Resource


class Recommendation(Resource):
    def get(self,user_id,genres):
        def recommend():
            # Step 1: Read CSV File
            dataframe = pd.read_csv("movies_metadata.csv")
            all_ratings = pd.read_csv("ratings.csv")
            all_dataframe = dataframe
            
            def get_title_from_index(index):
                return dataframe[dataframe.index == index]["title"].values[0]

            def get_index_from_movieid(id):
                return dataframe[dataframe.movieId == id]["index"].values[0]

            def get_id_from_index(index):
                return dataframe[dataframe.index == index]["movieId"].values[0]

            def get_posterpath_from_index(index):
                return dataframe[dataframe.index == index]["poster_path"].values[0]

            def get_rating_from_movieid(movieId, userId, all_ratings):
                rating = all_ratings[all_ratings.movieId ==
                                     movieId][all_ratings.userId == userId]["rating"].values
                if len(rating) != 0:
                    return rating[0]
                else:
                    return 0

            def write_csv():
                with open('genres.csv', 'a', newline='') as f:
                    thewriter = csv.writer(f)
                    thewriter.writerow([user_id, genres,datetime.timestamp(datetime.now())])

            def get_rec_movies_on_genres(query):
                dataframe = pd.read_csv("movies_metadata.csv")

                def get_kw(row):
                    row = ast.literal_eval(row)
                    res = ''
                    for i in row:
                        res += i['name']+' '
                    return res

                # Select Features
                features = ['genres', 'title']  # keyword, cast overview

                # Create a column in dataframe which combines all selected features
                for feature in features:
                    dataframe[feature] = dataframe[feature].fillna('')

                def combined_features(row):
                    try:
                        return get_kw(row['genres']) + row['title']
                    except:
                        print("Error: ", row)

                dataframe['combined_features'] = dataframe.apply(
                    combined_features, axis=1)
                dataframe['combined_features']
                dataframe = dataframe[dataframe['combined_features'].str.lower().str.contains(
                    query, regex=False)]
                dataframe = dataframe.nlargest(13, ['vote_average'])

                res = []
                temp = []
                for movieId in dataframe["movieId"]:
                    temp.append({'id': movieId})
                res.append({'type': 'search', 'movie_data': temp})
                return {'result': res}

            res = []

            # get popular movies
            def get_popular_movies(df):
                dataframe = df.nlargest(12, ['popularity'])
                list_popular_movie = np.asarray(dataframe['movieId'])
                list_popular_movie_temp = []
                for movieid in list_popular_movie:
                    rating = get_rating_from_movieid(movieid, user_id, all_ratings)
                    list_popular_movie_temp.append(
                        {'id': int(movieid), 'title': '', 'rating': rating})
                res.append(
                    {'type': 'popular', 'movie_data': list_popular_movie_temp})
            
            get_popular_movies(dataframe)

            #get movies based on genres a NEW USER chose
            if genres is not None and genres != '-1':
                write_csv()
                genres_text = genres.split('|')
                for g in genres_text:
                    if g != '':
                        arr = get_rec_movies_on_genres(g)["result"]
                        for i in arr:
                            res.append({'type':'genres|'+g.title(),'movie_data':i["movie_data"]})

            # filter user and his favorite movies
            ratings = all_ratings[all_ratings.userId == int(user_id)]
            ratings = ratings.sort_values(by='timestamp', ascending=False)
            ratings = ratings.drop_duplicates(subset=['movieId'], keep='first')
            pivot = ratings["rating"].mean()
            ratings = ratings[ratings.rating >= pivot]
            ratings = ratings.nlargest(20, ['rating'])
            ratings = ratings.nlargest(3, ['timestamp'])

            # Content-based recommend
            def get_contentbased_movies():
                def get_kw(row):
                    row = ast.literal_eval(row)
                    res = ''
                    for i in row:
                        res += i['name']+' '
                    return res

                # Step 2: Select Features
                features = ['keywords', 'genres']  # keyword, cast overview

                # Step 3: Create a column in dataframe which combines all selected features
                for feature in features:
                    dataframe[feature] = dataframe[feature].fillna('')

                def combined_features(row):
                    try:
                        return get_kw(row['keywords']) + " " + get_kw(row['genres'])
                    except:
                        print("Error: ", row)

                dataframe['combined_features'] = dataframe.apply(
                    combined_features, axis=1)  # apply function to each row

                # Step 4: Create count matrix from this new combined column
                cv = CountVectorizer()
                count_matrix = cv.fit_transform(dataframe["combined_features"])

                # Step 5: Compute the Cosine Similarity based on the count_matrix
                cosine_sim = cosine_similarity(count_matrix)

                # Step 6: Get index of this movie from its title
                list_movie_index = []
                for movieId in ratings["movieId"]:
                    movie_index = get_index_from_movieid(movieId)
                    list_movie_index.append(movie_index)

                list_similar_movies = []
                for movie_index in list_movie_index:
                    similar_movies = list(enumerate(cosine_sim[movie_index]))
                    list_similar_movies.append(similar_movies)

                # Step 7: Get a list of similar movies in descending order of similarity score
                list_sorted_similar_movies = []
                for similar_movies in list_similar_movies:
                    sorted_similar_movies = sorted(
                        similar_movies, key=lambda x: x[1], reverse=True)
                    list_sorted_similar_movies.append(sorted_similar_movies)

                #Step 8: Print titles of first 12 movies
                for list_movie in list_sorted_similar_movies:
                    list_temp = []
                    count = 0
                    for movie in list_movie:
                        movieid = int(get_id_from_index(movie[0]))
                        title = get_title_from_index(movie[0])
                        rating = get_rating_from_movieid(movieid, user_id, all_ratings)
                        list_temp.append(
                            {'id': movieid, 'title': title, 'rating': rating})
                        count = count + 1
                        if count > 12:
                            break
                    res.append({'type': 'recommend', 'movie_data': list_temp})
           
            # Collaborative recommend
            def get_colla_movies():
                ratings = pd.merge(all_dataframe, all_ratings).drop(
                ['genres', 'timestamp'], axis=1)

                def standardize(row):
                    new_row = np.subtract(row, row.mean(), dtype=np.float32)
                    return new_row

                userRatings = ratings.pivot_table(index=['userId'], columns=[
                    'movieId'], values='rating')
                userRatings = userRatings.dropna(thresh=10, axis=1)
                userRatings_std = userRatings.apply(standardize)
                userRatings_std = userRatings_std.fillna(0, axis=1)

                item_similarity = cosine_similarity(userRatings_std.T)
                item_similarity_df = pd.DataFrame(
                    item_similarity, index=userRatings.columns, columns=userRatings.columns)

                def get_colla_similar_movies(movie_name, rating):
                    similar_ratings = item_similarity_df[movie_name]*(rating-2.5)
                    similar_ratings = similar_ratings.sort_values(ascending=False)
                    return similar_ratings

                # 165-Back to the Future Part II
                    # 364-Batman Returns
                    # 260-The 39 Steps
                romantic_lover = [(165, 4), (364, 3), (260, 1)]
                colla_similar_movies = pd.DataFrame()
                for movie, rating in romantic_lover:
                    colla_similar_movies = colla_similar_movies.append(
                        get_colla_similar_movies(movie, rating))

                colla_similar_movies = colla_similar_movies.sum().sort_values(ascending=False)
                colla_similar_movies_id = []
                count = 0
                for movie in colla_similar_movies:
                    count = count + 1
                    # get column name with specific value (ratings)
                    movieId = (colla_similar_movies == movie).idxmax(axis=1)
                    rating = get_rating_from_movieid(movieId, user_id, all_ratings)
                    colla_similar_movies_id.append(
                        {'id': int(movieId), 'rating': rating})
                    if count > 11:
                        break
                res.append(
                    {'type': 'colla', 'movie_data': colla_similar_movies_id})
            
            #-1 means NEW USER skip choosing his fav genres
            if genres != '-1' or not all_ratings[all_ratings.userId == int(user_id)].empty:
                get_contentbased_movies()
                get_colla_movies()

            return res
        return {'movie': recommend()}


class Search(Resource):
    def get(self, query):
        print(query)
        dataframe = pd.read_csv("movies_metadata.csv")

        def get_kw(row):
            row = ast.literal_eval(row)
            res = ''
            for i in row:
                res += i['name']+' '
            return res

        # Select Features
        features = ['genres', 'title']  # keyword, cast overview

        # Create a column in dataframe which combines all selected features
        for feature in features:
            dataframe[feature] = dataframe[feature].fillna('')

        def combined_features(row):
            try:
                return get_kw(row['genres']) + row['title']
            except:
                print("Error: ", row)

        dataframe['combined_features'] = dataframe.apply(
            combined_features, axis=1)
        dataframe['combined_features']
        dataframe = dataframe[dataframe['combined_features'].str.lower().str.contains(
            query, regex=False)]
        #dataframe = dataframe.nlargest(20, ['vote_average'])

        res = []
        temp = []
        count = 0
        index = 0
        for movieId in dataframe["movieId"]:
            index = index + 1
            temp.append({'id': movieId})
            count = count + 1
            if count == 7 or index == 21:
                res.append({'type': 'search', 'movie_data': temp})
                temp = []
                count = 0
        return {'result': res}


class WriteCSV(Resource):
    def post(self):
        data = request.get_json()
        mean_rating = data['rating']
        if mean_rating == -2:
            ratings = pd.read_csv('ratings.csv')
            ratings = ratings[ratings.userId == data['userid']]
            mean_rating = ratings["rating"].mean() + 0.5
            print(mean_rating)
        with open('ratings.csv', 'a', newline='') as f:
            thewriter = csv.writer(f)
            ratings = pd.read_csv("ratings.csv")
            ratings = ratings[ratings.movieId ==
                              data["id"]][ratings.userId == 592]
            if not ratings.empty and data['rating'] == -2:
                return response('Failed to add rating', 200)
            if not ratings.empty and ratings["rating"].values[0] == mean_rating:
                return response('Dupplicate ratings', 200)
            thewriter.writerow(['592', data["id"], mean_rating,
                                datetime.timestamp(datetime.now())])
            return response('Added rating successfully', 200)
        return response('Failed to add rating', 500)
