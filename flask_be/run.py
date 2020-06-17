from middleware import Middleware
from bson import ObjectId
from flask_restful import Resource, Api
from app import app, mongo
from api.Role import Role
from api.RoleList import RoleList
from api.User import User
from api.UserChangePassword import UserChangePassword
from api.UserList import UserList
from api.UserLogin import UserLogin

api = Api(app)


class Ping(Resource):
    def get(self):
        return 'Pong'


api.add_resource(Role, '/roles/<ObjectId:role_id>')
api.add_resource(RoleList, '/roles')
api.add_resource(User, '/users/<ObjectId:user_id>')
api.add_resource(UserChangePassword, '/users/<ObjectId:user_id>/password')
api.add_resource(UserList, '/users')
api.add_resource(UserLogin, '/users/login')
api.add_resource(Ping, '/')

app.wsgi_app = Middleware(app.wsgi_app)


if __name__ == '__main__':
    app.run()
