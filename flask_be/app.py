from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np
from scipy import sparse
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import ast
from flask_restful import Resource, Api
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo.collection import ReturnDocument
from bson import json_util, ObjectId
from flask_cors import CORS
from datetime import datetime
import csv
import json
import os
import jwt
from os import environ

SECRET_KEY = "thisissecretkey"
MONGO_URI = "mongodb://localhost:27017/movierecommender"
DEBUG = True

app = Flask(__name__, template_folder='templates',
            static_folder='static')
CORS(app)

api = Api(app)
# app.config.from_envvar('APP_SETTINGS')
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)


@app.route('/writecsv', methods=['POST'])
def writecsv():
    data = request.get_json()
    with open('ratings.csv', 'a', newline='') as f:
        thewriter = csv.writer(f)
        ratings = pd.read_csv("ratings.csv")
        ratings = ratings[ratings.movieId == data["id"]][ratings.userId == 592]
        if not ratings.empty and ratings["rating"].values[0] == data["rating"]:
            return response('Dupplicate ratings', 200)
        thewriter.writerow(['592', data["id"], data["rating"],
                            datetime.timestamp(datetime.now())])
    return response('Added rating successfully', data["id"])


@app.route('/rec')
def index():
    def recommend():
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

        # Step 1: Read CSV File
        dataframe = pd.read_csv("movies_metadata.csv")
        all_ratings = pd.read_csv("ratings.csv")
        all_dataframe = dataframe

        # filter user and his favorite movies
        ratings = all_ratings[all_ratings.userId == 592]
        ratings = ratings.sort_values(by='timestamp', ascending=False)
        ratings = ratings.drop_duplicates(subset=['movieId'], keep='first')
        pivot = ratings["rating"].mean()
        ratings = ratings[ratings.rating >= pivot]
        ratings = ratings.nlargest(20, ['rating'])
        ratings = ratings.nlargest(3, ['timestamp'])

        # Content-based recommend
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

        # Step 8: Print titles of first 12 movies
        res = []
        for list_movie in list_sorted_similar_movies:
            list_temp = []
            count = 0
            for movie in list_movie:
                movieid = int(get_id_from_index(movie[0]))
                title = get_title_from_index(movie[0])
                rating = get_rating_from_movieid(movieid, 592, all_ratings)
                list_temp.append(
                    {'id': movieid, 'title': title, 'rating': rating})
                count = count + 1
                if count > 12:
                    break
            res.append({'type': 'recommend', 'movie_data': list_temp})

        # get popular movies
        dataframe = dataframe.nlargest(12, ['popularity'])
        list_popular_movie = np.asarray(dataframe['movieId'])
        list_popular_movie_temp = []
        for movieid in list_popular_movie:
            rating = get_rating_from_movieid(movieid, 592, all_ratings)
            list_popular_movie_temp.append(
                {'id': int(movieid), 'title': '', 'rating': rating})
        res.append({'type': 'popular', 'movie_data': list_popular_movie_temp})

        # Collaborative recommend
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
            rating = get_rating_from_movieid(movieid, 592, all_ratings)
            colla_similar_movies_id.append(
                {'id': int(movieId), 'rating': rating})
            if count > 11:
                break
        res.append({'type': 'colla', 'movie_data': colla_similar_movies_id})
        return res

    return {'movie': recommend()}


@app.route('/search/<string:query>', methods=['GET'])
def get_search(query):
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

    dataframe = dataframe[dataframe['combined_features'].str.contains(
        query, regex=False)]
    dataframe = dataframe.nlargest(20, ['vote_average'])

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


def response(msg, status):
    if status == 404:
        if msg == '':
            msg = 'Not found ' + request.url
    message = {
        'status': status,
        'message': msg
    }
    resp = jsonify(message)
    resp.status_code = status
    return resp


class User(Resource):
    def get(self, user_id):
        user = mongo.db.user.find_one(
            {"_id": ObjectId(user_id)}, {"hashed_password": 0})
        if user is None:
            return response('', 404)
        else:
            new_user = json.loads(json_util.dumps(user))
            new_user['_id'] = new_user['_id']["$oid"]
            return new_user, 200

    def delete(self, user_id):
        ret = mongo.db.user.find_one_and_delete({"_id": ObjectId(user_id)})
        if ret is None:
            return response('', 404)
        else:
            return response('Deleted successfully', 200)

    def put(self, user_id):
        data = request.get_json()
        username = data['username']
        email = data['email']
        if username and email:
            ret = mongo.db.user.find_one_and_update({"_id": ObjectId(user_id)},
                                                    {"$set": {'username': username, 'email': email}}, return_document=ReturnDocument.BEFORE)
            if ret is None:
                return response('', 404)
            else:
                return response('Used updated successfully', 200)
        else:
            return response('Please fill in all information', 400)


class UserList(Resource):
    def get(self):
        users = mongo.db.user.find({}, {"hashed_password": 0})
        output = []
        for user in users:
            new_user = json.loads(json_util.dumps(user))
            new_user['_id'] = new_user['_id']["$oid"]
            output.append(new_user)
        return output, 200

    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        if username and email and password:
            hashed_password = generate_password_hash(password, method='sha256')
            mongo.db.user.insert_one(
                {'username': username, 'email': email, 'hashed_password': hashed_password})
            return response('Used added successfully', 200)
        else:
            return response('Please fill in all information', 400)


class UserPassword(Resource):
    def put(self, user_id):
        data = request.get_json()
        password = data['password']
        if password:
            hashed_password = generate_password_hash(password, method='sha256')
            ret = mongo.db.user.find_one_and_update({"_id": ObjectId(user_id)},
                                                    {"$set": {'hashed_password': hashed_password}}, return_document=ReturnDocument.BEFORE)
            if ret is None:
                return response('', 404)
            else:
                return response('Password updated successfully', 200)
        else:
            return response('Please fill in all information', 400)

# class CheckPassword(Resource):
#     def post(self, user_id):
#         data = request.get_json()
#         password = data['password']
#         user = mongo.db.user.find_one({"_id": ObjectId(user_id) })
#         new_user = json.loads(json_util.dumps(user))
#         if check_password_hash(new_user['hashed_password'], password):
#             return {'message': 'Same'}
#         else:
#             return {'message': 'Not same'}


class UserLogin(Resource):
    def post(self):
        print('haha')
        data = request.get_json()
        password = data['password']
        email = data['email']
        user = mongo.db.user.find_one({'email': email})
        if user is None:
            return response("User doesn't exist", 404)

        new_user = json.loads(json_util.dumps(user))
        # return(new_user['username'])
        if check_password_hash(new_user['hashed_password'], password):
            encoded_jwt = jwt.encode(
                {'username': new_user['username'], 'email': new_user['email'], 'exp': 24 * 3600}, SECRET_KEY, algorithm='HS256')
            decoded_token = encoded_jwt.decode('UTF-8')
            return response(decoded_token, 200)
        else:
            return response('Invalid credentials', 400)


class Role(Resource):
    def get(self, role_id):
        role = mongo.db.role.find_one({"_id": ObjectId(role_id)})
        if role is None:
            return response('', 404)
        else:
            new_role = json.loads(json_util.dumps(role))
            new_role['_id'] = new_role['_id']["$oid"]
            return new_role, 200

    def delete(self, role_id):
        ret = mongo.db.role.find_one_and_delete({"_id": ObjectId(role_id)})
        if ret is None:
            return response('', 404)
        else:
            return response('Role deleted successfully', 200)


class Ping(Resource):
    def get(self):
        return 'Pong'


class RoleList(Resource):
    def get(self):
        roles = mongo.db.role.find()
        output = []
        for role in roles:
            new_role = json.loads(json_util.dumps(role))
            new_role['_id'] = new_role['_id']["$oid"]
            output.append(new_role)
        return output, 200

    def post(self):
        data = request.get_json()
        name_role = data['name']

        if name_role:
            mongo.db.role.insert_one({'nameRole': name_role})
            return response('Role added successfully', 200)
        else:
            return response('Please fill in all information', 400)


api.add_resource(RoleList, '/roles')
api.add_resource(Role, '/roles/<ObjectId:role_id>')
api.add_resource(UserList, '/users')
api.add_resource(User, '/users/<ObjectId:user_id>')
api.add_resource(UserPassword, '/users/password/<ObjectId:user_id>')
# api.add_resource(CheckPassword, '/login/<ObjectId:user_id>')
api.add_resource(UserLogin, '/users/login')
api.add_resource(Ping, '/')


app.run(debug=True)
