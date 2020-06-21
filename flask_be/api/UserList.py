from bson import json_util, ObjectId
import json
from flask_restful import Resource
from flask import request
from app import mongo, response
import pandas as pd
from werkzeug.security import generate_password_hash


class UserList(Resource):

    def get(self):
        users = mongo.db.user.find({}, {"hashed_password": 0})
        output = []
        for user in users:
            new_user = json.loads(json_util.dumps(user))
            new_user['_id'] = new_user['_id']["$oid"]
            output.append(new_user)
        return output, 200

    def delete(self):
        ret = mongo.db.user.remove({})
        return response("Deleted all users!", 200)

    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        verifyPassword = data['verifyPassword']
        fullname = data['fullname']
        role = data['role']
        one_user = mongo.db.user.find_one()
        print('---------------LAST USER---------------------')
        print(one_user)
        if one_user is None:
            dataframe = pd.read_csv('ratings.csv')
            row = dataframe.nlargest(1, 'userId')
            largest_user_id = row['userId'].values[0]
            largest_user_id = largest_user_id + 1
            user_id = largest_user_id.item()
            print('------------------------------------')
            print(user_id)
        else:
            last_user = mongo.db.user.find().limit(1).sort([("$natural", -1)])
            for x in last_user:
                user_id = x['userId'] + 1
            # user_id = last_user['userId'] + 1
        if not username or not email or not password or not role or not verifyPassword or not fullname:
            return response('Please fill in all information', 400)
        if mongo.db.user.count_documents({'email': email}, limit=1) != 0:
            return response('Email is already registered', 400)
        if mongo.db.user.count_documents({'username': username}, limit=1) != 0:
            return response('Username is already registered', 400)
        if password != verifyPassword:
            return response("Password doesn't match!", 400)
        hashed_password = generate_password_hash(password, method='sha256')
        mongo.db.user.insert_one(
            {'username': username, 'email': email, 'fullname': fullname, 'userId': user_id, 'hashed_password': hashed_password, 'role': role})
        return response('Used created successfully', 200)
