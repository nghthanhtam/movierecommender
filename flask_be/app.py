from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import ast

app = Flask(__name__, template_folder='templates',
            static_folder='static')
CORS(app)


@app.route('/rec')
def index():
    '''
    def recommend():
        def get_title_from_index(index):
            return dataframe[dataframe.index == index]["title"].values[0]

        def get_index_from_title(title):
            return dataframe[dataframe.title == title]["index"].values[0]

        # Step 1: Read CSV File
        dataframe = pd.read_csv("movie_dataset.csv",
                                engine='python', error_bad_lines=False)

        # Step 2: Select Features
        features = ['keywords', 'cast', 'genres', 'director']

        # Step 3: Create a column in dataframe which combines all selected features
        for feature in features:
            dataframe[feature] = dataframe[feature].fillna('')

        def combined_features(row):
            try:
                return row['keywords'] + " " + row['cast'] + " " + row['genres'] + " " + row['director']
            except:
                print("Error: ", row)

        dataframe['combined_features'] = dataframe.apply(
            combined_features, axis=1)  # apply function to each row

        # Step 4: Create count matrix from this new combined column
        cv = CountVectorizer()
        count_matrix = cv.fit_transform(dataframe["combined_features"])

        # Step 5: Compute the Cosine Similarity based on the count_matrix
        cosine_sim = cosine_similarity(count_matrix)
        movie_user_likes = "Avatar"

        # Step 6: Get index of this movie from its title
        movie_index = get_index_from_title(movie_user_likes)
        a = np.asarray(cosine_sim)
        np.savetxt("cosine_sim.csv", a, delimiter=",")

        similar_movies = list(enumerate(cosine_sim[movie_index]))

        # Step 7: Get a list of similar movies in descending order of similarity score
        sorted_similar_movies = sorted(
            similar_movies, key=lambda x: x[1], reverse=True)

        # Step 8: Print titles of first 50 movies
        return get_title_from_index(sorted_similar_movies[0][0])
    '''
    def recommend():
        def get_title_from_index(index):
            return dataframe[dataframe.index == index]["title"].values[0]

        def get_index_from_movieid(id):
            return dataframe[dataframe.id == id]["index"].values[0]

        def get_id_from_index(index):
            return dataframe[dataframe.index == index]["id"].values[0]

        def get_posterpath_from_index(index):
            return dataframe[dataframe.index == index]["poster_path"].values[0]

        # Step 1: Read CSV File
        dataframe = pd.read_csv("movies_metadata.csv")
        ratings = pd.read_csv("ratings.csv")
        ratings = ratings[ratings.userId == 6417]
        ratings = ratings.sort_values(by=['rating'])
        ratings = ratings.drop_duplicates(subset=['movieId'], keep='first')
        ratings = ratings[ratings.rating >= 2.5]
        ratings = ratings.nlargest(3, ['timestamp'])

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

        # Step 8: Print titles of first 50 movies
        res = []
        for list_movie in list_sorted_similar_movies:
            list_temp = []
            count = 0
            for movie in list_movie:
                movieid = int(get_id_from_index(movie[0]))
                title = get_title_from_index(movie[0])
                list_temp.append({'id': movieid, 'title': title})
                # list_temp.append(movieid)
                count = count + 1
                if count > 6:
                    break
            res.append(list_temp)
        return res

    return {'movie': recommend()}


# @app.route('/<path:path>')
# def catch_all(path):
#     return render_template("index.html")


# @app.route('/landingpage')
# def index():
#     return render_template('index.html')


# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


# @app.route('/about')
# def about():
#   return render_template('about.html')

# @app.route('/multi/<int:num>', methods=['GET'])
# def get_multiply10(num):
#     return jsonify({'result': num*10})

@app.route('/search/')
def search():
    name = request.args.get('name')
    return name


app.run(debug=True)
