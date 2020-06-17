from bson import json_util, ObjectId
import json
from flask_restful import Resource
from flask import request
from app import mongo, response
from pymongo.collection import ReturnDocument


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
        fullname = data['fullname']
        role = data['role']
        if username and email:
            ret = mongo.db.user.find_one_and_update({"_id": ObjectId(user_id)},
                                                    {"$set":
                                                     {'username': username, 'email': email, 'fullname': fullname, 'role': role}}, return_document=ReturnDocument.BEFORE)
            if ret is None:
                return response('', 404)
            else:
                return response('Used updated successfully', 200)
        else:
            return response('Please fill in all information', 400)
