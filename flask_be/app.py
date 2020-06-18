
from flask_cors import CORS
from flask import Flask, jsonify, render_template, request
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv
load_dotenv()


MONGO_URI = os.getenv('MONGO_URI')

app = Flask(__name__, template_folder='templates',
            static_folder='static')
CORS(app)

app.config["MONGO_URI"] = MONGO_URI


mongo = PyMongo(app)


def response(msg, status):
    if status == 404:
        if msg == '':
            msg = 'Not found ' + request.url
    message = {
        'status': status,
        'message': msg
    }
    resp = jsonify(message)
    resp.status_code = status
    return resp
