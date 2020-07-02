from bson import json_util, ObjectId
import json
from flask_restful import Resource
from app import app, mongo, response
from werkzeug.security import generate_password_hash
from flask import request
from pymongo.collection import ReturnDocument


class UserChangePassword(Resource):
    def put(self, user_id):
        data = request.get_json()
        password = data['password']
        verifyPassword = data['verifyPassword']

        if not password or not verifyPassword:
            return response('Please fill in all information', 400)

        if password != verifyPassword:
            return response("Password doesn't match!", 400)

        hashed_password = generate_password_hash(password, method='sha256')
        ret = mongo.db.user.find_one_and_update({"_id": ObjectId(user_id)},
                                                {"$set": {'hashed_password': hashed_password}}, return_document=ReturnDocument.BEFORE)
        print(ret)
        if ret is None:
            return response('12321213', 404)
        else:
            return response('Password updated successfully', 200)
