from werkzeug.wrappers import Request, Response
from flask import jsonify
import os
import jwt
import optparse
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")


def verify_token(request):
    token = request.headers['token']
    # if not token:
    #     return response('No token, authorization denied', 401)
    try:
        decoded = jwt.decode(token, SECRET_KEY)
        print(decoded)
    except Exception as e:
        print(e)


class Middleware:

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # not Flask request - from werkzeug.wrappers import Request
        request = Request(environ)
        print('method: %s' % (request.method))
        # just do here everything what you need
        # if(request.path == '')
        # if (request.path == '/users'):
        #     verify_token(request)
        #     print('------------')
        return self.app(environ, start_response)
