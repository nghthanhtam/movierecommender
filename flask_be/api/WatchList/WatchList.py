from bson import json_util, ObjectId
import json
from flask_restful import Resource
from app import mongo, response

class WatchList(Resource):
    def get(self, user_id):
        watchlist = mongo.db.watchlist.find({"userId": str(user_id)})
        output = []
        print(user_id)
        for movie in watchlist:
            item = json.loads(json_util.dumps(movie))
            item['_id'] = item['_id']["$oid"]
            output.append(item)
        return output, 200
    
    def delete(self, role_id):
        ret = mongo.db.watchlist.remove({"userId": str(user_id)})
        if ret is None:
            return response('', 404)
        else:
            return response('Role deleted successfully', 200)