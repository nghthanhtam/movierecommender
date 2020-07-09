from bson import json_util, ObjectId
import json
from flask_restful import Resource
from flask import request
from app import mongo, response
from pymongo.collection import ReturnDocument


class UserUpdateFirstTimeUse(Resource):
    def get(self, user_id):
        user = mongo.db.user.find_one(
            {"_id": ObjectId(user_id)}, {"firstTimeUse": 1})
        if user is None:
            return response('', 404)
        else:
            new_user = json.loads(json_util.dumps(user))
            new_user['_id'] = new_user['_id']["$oid"]
            return new_user, 200

    def put(self, user_id):
        ret = mongo.db.user.find_one_and_update({"_id": ObjectId(user_id)},
                                                {"$set":
                                                 {'firstTimeUse': False}}, return_document=ReturnDocument.BEFORE)
        if ret is None:
            return response('Error while updating firstTimeUse', 404)
        else:
            return response('Used updated successfully', 200)
