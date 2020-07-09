from werkzeug.wrappers import Request, Response
from flask import jsonify, Request as rq
import os
import jwt
import optparse
from dotenv import load_dotenv
from app import response
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")


def verify_token(request):
    print(request.headers)
    token = request.headers.get('Token', None)
    print(token)
    if token == None:
        print('INSIDE')
        # raise Error
        return response('No token, authorization denied', 401)
    try:
        decoded = jwt.decode(token, SECRET_KEY)
    except jwt.ExpiredSignatureError:
        return response('Signature expired. Please log in again.', 401)
    except jwt.InvalidTokenError:
        return response('Invalid token. Please log in again.', 401)
    except Exception as e:
        print(e)


class Middleware:

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # not Flask request - from werkzeug.wrappers import Request
        # start_response('400 OK', [('Content-Type', 'text/html')])
        # request = Request(environ)
        print(rq.headers.get('Token', None))
        # print(request.method)
        # print(vars(request))
        # if request.path != '/users/login' and (request.path != '/' and request.method != 'POST'):
        # Loged in
        # verify_token(request)
        # print(environ)
        # print(start_response)
        # print('-------------------')
        # print(request.headers)
        # print('-------------------')
        # just do here everything what you need
        # if(request.path == '')
        # if (request.path == '/users'):
        #     verify_token(request)
        #     print('------------')
        return self.app(environ, start_response)
