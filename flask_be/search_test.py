from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import ast



def get_title_from_index(index):
    return dataframe[dataframe.index == index]["title"].values[0]

def get_index_from_movieid(id):
    return dataframe[dataframe.id == id]["index"].values[0]

def get_id_from_index(index):
    return dataframe[dataframe.index == index]["id"].values[0]

def get_posterpath_from_index(index):
    return dataframe[dataframe.index == index]["poster_path"].values[0]

# Step 1: Read CSV File
dataframe = pd.read_csv("movies_metadata.csv")
ratings = pd.read_csv("ratings.csv")
ratings = ratings[ratings.userId == 6417]
ratings = ratings.sort_values(by=['rating'])
ratings = ratings.drop_duplicates(subset=['movieId'], keep='first')
ratings = ratings[ratings.rating >= 2.5]
ratings = ratings.nlargest(3, ['timestamp'])

def get_kw(row):
    row = ast.literal_eval(row)
    res = ''
    for i in row:
        res += i['name']+' '
    return res

# Step 2: Select Features
features = ['genres','title']  # keyword, cast overview

# Step 3: Create a column in dataframe which combines all selected features
for feature in features:
    dataframe[feature] = dataframe[feature].fillna('')

def combined_features(row):
    try:
        return get_kw(row['genres']) + row['title']
    except:
        print("Error: ", row)

dataframe['combined_features'] = dataframe.apply(
    combined_features, axis=1)  

dataframe = dataframe[dataframe['combined_features'].str.contains('Fami', regex = False)]
dataframe = dataframe.nlargest(20, ['vote_average'])

res = []
temp = []
count = 0
index = 0
for movieId in dataframe["id"]:
	index = index + 1
	temp.append({'id':movieId})
	count = count + 1
	if count == 6 or index == 20:
		res.append(temp)
		temp = []
		count = 0
print(res)




