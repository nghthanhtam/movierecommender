from bson import json_util, ObjectId
import json
from flask_restful import Resource
from app import mongo, response

from flask import request

class WatchLists(Resource):
    def get(self):
        watchlist = mongo.db.watchlist.find()
        output = []
        for movie in watchlist:
            new_watch_movie = json.loads(json_util.dumps(movie))
            new_watch_movie['_id'] = new_watch_movie['_id']["$oid"]
            output.append(new_watch_movie)
        return output, 200

    def post(self):
        data = request.get_json()
        movie_id = data['movieId']
        user_id = data['userId']
        if movie_id and user_id:
            mongo.db.watchlist.insert_one({'movieId': movie_id,'userId':user_id})
            return response('Watchlist added successfully', 200)
        else:
            return response('Please fill in all information', 400)
