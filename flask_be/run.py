from middleware import Middleware
from bson import ObjectId
from flask_restful import Resource, Api
from app import app, mongo
from api.Role.Role import Role
from api.Role.RoleList import RoleList
from api.User.User import User
from api.User.UserChangePassword import UserChangePassword
from api.User.UserList import UserList
from api.User.UserLogin import UserLogin
from api.User.UserUpdateFirstTimeUse import UserUpdateFirstTimeUse
from api.Dataset.RecommendationSystem import Recommendation, WriteCSV, Search
from api.WatchList.WatchList import WatchList
from api.WatchList.WatchLists import WatchLists
api = Api(app)


class Ping(Resource):
    def get(self):
        return 'Pong'


api.add_resource(Search, '/search/<string:query>')
api.add_resource(Recommendation, '/rec/<string:user_id>/<string:genres>')
api.add_resource(WriteCSV, '/writecsv')
api.add_resource(Role, '/roles/<ObjectId:role_id>')
api.add_resource(RoleList, '/roles')
api.add_resource(User, '/users/<ObjectId:user_id>')
api.add_resource(UserUpdateFirstTimeUse,
                 '/users/<ObjectId:user_id>/updateFirstTimeUse')
api.add_resource(UserChangePassword, '/users/<ObjectId:user_id>/password')
api.add_resource(UserList, '/users')
api.add_resource(UserLogin, '/users/login')
api.add_resource(Ping, '/')
api.add_resource(WatchList, '/watchlist/<int:user_id>')
api.add_resource(WatchLists, '/watchlists')


# app.wsgi_app = Middleware(app.wsgi_app)


if __name__ == "__main__":
    app.run(debug=True)
