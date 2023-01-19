from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
#from matplotlib import collections
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/")
def main():
  return "App is running"

@app.route("/get/all_fighter_names")
def get_fighters():
  data = pd.read_csv("data/raw_fighter_details.csv")
  df = pd.DataFrame(data)['fighter_name']
  fighters= df.to_list()
  return jsonify(fighters)

@app.route("/get/ranked_fighter_names")
# I should send all of these from what's in "input"
@cross_origin()
def get_ranked_fighters():
  data = pd.read_csv("data/ufc_master_data.csv")
  df = pd.DataFrame(data, columns=['ranking', 'name'])

  ranked_rows = df.loc[~df['ranking'].isna()]
  ranked_names = sorted(ranked_rows['name'].to_list())

  return jsonify(ranked_names)

@app.route("/post/calculate_odds", methods=["POST"])
def calculate_odds():
  fighter1, fighter2 = request.json['fighter1'], request.json['fighter2']

  print(fighter1, fighter2)
  odds = 0
  #Calculate the odds here
  return "None"
