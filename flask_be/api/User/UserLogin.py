import jwt
import datetime
import json
import os
from bson import json_util
from flask_restful import Resource
from flask import request
from app import mongo, response
from werkzeug.security import check_password_hash
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')


class UserLogin(Resource):
    def post(self):
        print('haha')
        data = request.get_json()
        password = data['password']
        email = data['email']
        user = mongo.db.user.find_one({'email': email})
        if user is None:
            return response("Incorrect username or password", 404)

        new_user = json.loads(json_util.dumps(user))
        # return(new_user['username'])
        if check_password_hash(new_user['hashed_password'], password):
            encoded_jwt = jwt.encode(
                {'username': new_user['username'], 'email': new_user['email'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60)}, SECRET_KEY, algorithm='HS256')
            decoded_token = encoded_jwt.decode('UTF-8')
            return response(decoded_token, 200)
        else:
            return response('Incorrect username or password', 400)
