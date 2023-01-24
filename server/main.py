from typing import Union
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import csv
import os
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(HTTPSRedirectMiddleware)

@app.get('/')
def read_root():
  return {"API is" : "working!"}

# Examle: http://127.0.0.1:8000/get/all_fighters
@app.get('/get/all_fighters')
def get_all_fighters():
  with open('data/all_fighters.csv', newline='') as csvfile:
    fighter_list = csv.reader(csvfile, delimiter=',',
                              quoting=csv.QUOTE_ALL, )
    fighter_list = list(fighter_list)[0]
  return fighter_list

# Example Query: http://127.0.0.1:8000/get/odds/?r_fighter=Alexander+Hernandez&b_fighter=Casey+Kenney
@app.get('/get/odds/')
def get_odds(r_fighter: str, b_fighter: str, request=Request):
  r = request.body
  with open('data/all_combinations.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      if row['R_fighter'] == r_fighter and row['B_fighter'] == b_fighter:
        pred = row['prediction'].strip("[]").split(" ")
        print(pred)
        if pred[0] > pred[1]:
          return {r_fighter: pred[0]}
        else:
          return {b_fighter: pred[1]}
  return {"error": "This prediction currently hasn't been calculated!",
  "Try" : r_fighter + "in Blue Corner and " + b_fighter + "in Red Corner instead"
  }

app.mount("/static", StaticFiles(directory="build", html=True), name="static")