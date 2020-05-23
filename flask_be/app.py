from flask import Flask, jsonify, render_template, request
import pandas as pd
import numpy as np
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


@app.route('/rec')
def index():
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
