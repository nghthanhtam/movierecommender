from bson import json_util, ObjectId
import json
from flask_restful import Resource
from app import mongo, response


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
