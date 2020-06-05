from flask import Flask, jsonify, render_template, request
from flask_restful import Resource, Api
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from pymongo.collection import ReturnDocument
from bson import json_util, ObjectId
from flask_cors import CORS
from middleware import Middleware
import json
import os
import jwt
import datetime

from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URI = os.getenv('MONGO_URI')

app = Flask(__name__, template_folder='templates',
            static_folder='static')

CORS(app)

app.config["MONGO_URI"] = MONGO_URI


api = Api(app)

mongo = PyMongo(app)


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
                {'username': new_user['username'], 'email': new_user['email'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60)}, SECRET_KEY, algorithm='HS256')
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

app.wsgi_app = Middleware(app.wsgi_app)


app.run()
