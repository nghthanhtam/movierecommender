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
from api.Dataset.RecommendationSystem import Recommendation, WriteCSV, Search
api = Api(app)


class Ping(Resource):
    def get(self):
        return 'Pong'


api.add_resource(Search, '/search/<string:query>')
api.add_resource(Recommendation, '/rec')
api.add_resource(WriteCSV, '/writecsv')
api.add_resource(Role, '/roles/<ObjectId:role_id>')
api.add_resource(RoleList, '/roles')
api.add_resource(User, '/users/<ObjectId:user_id>')
api.add_resource(UserChangePassword, '/users/<ObjectId:user_id>/password')
api.add_resource(UserList, '/users')
api.add_resource(UserLogin, '/users/login')
api.add_resource(Ping, '/')

app.wsgi_app = Middleware(app.wsgi_app)


if __name__ == "__main__":
    app.run(debug=True)
