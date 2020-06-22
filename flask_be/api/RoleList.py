from bson import json_util, ObjectId
import json
from flask_restful import Resource
from app import mongo, response

from flask import request


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
