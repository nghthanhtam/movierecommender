import pandas as pd
import numpy as np
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity

ratings = pd.read_csv("ratings_test.csv")
movies = pd.read_csv("movies_test.csv")

ratings = pd.merge(movies, ratings).drop(['genres','timestamp'],axis = 1)

def standardize(row):
    new_row = np.subtract(row, row.mean(), dtype=np.float32)
    return new_row

userRatings = ratings.pivot_table(index=['userId'],columns=['title'],values='rating')
userRatings = userRatings.dropna(thresh=10, axis=1)

userRatings_std = userRatings.apply(standardize) 
userRatings_std = userRatings_std.fillna(0,axis=1)

item_similarity = cosine_similarity(userRatings_std.T)

item_similarity_df = pd.DataFrame(item_similarity, index=userRatings.columns, columns=userRatings.columns)
item_similarity_df

def get_similar_movies(movie_name,rating):
    similar_ratings = item_similarity_df[movie_name]*(rating-2.5)
    similar_ratings = similar_ratings.sort_values(ascending=False)
    return similar_ratings

romantic_lover = [("Back to the Future Part II",4),("Batman Returns",3),("The 39 Steps",1)]
similar_movies = pd.DataFrame()

for movie,rating in romantic_lover:
    similar_movies = similar_movies.append(get_similar_movies(movie,rating),ignore_index = True)
similar_movies.sum().sort_values(ascending=False).head(20)  