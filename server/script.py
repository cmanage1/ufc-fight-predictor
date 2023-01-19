'''
Script should calculate the odds and output them to a folder
Should not even be run from flask

Flask should only scan output files to calculate odds
Odds should already be calculated in the server 

To not deal with cloud. Only upload Flask file and results to cloud.
Show source code on github
'''
import numpy as np
import pandas as pd
import os 

from sklearn.tree import DecisionTreeClassifier

for dirname, _ , filenames in os.walk('input/'):
  for filename in filenames:
    print(os.path.join(dirname, filename))

df = pd.read_csv('input/ufc-master.csv')
df_upcoming = pd.read_csv('input/upcoming-event.csv')

num_upcoming_fights =  len(df_upcoming)
print(f"Predict the winnter of {num_upcoming_fights} fights")

#combined upcoming fights to previous fights to clean at once
df_combined = df_upcoming.append(df)

#put labels col to df
df_combined['label'] = ''

#convert Red and Blue to 0 and 1
mask = df_combined['Winner'] == 'Red'
df_combined['label'][mask] = 0 
mask = df_combined['Winner'] == 'Blue'
df_combined['label'][mask] = 1

#Make sure the label is numeric
df_combined['label'] = pd.to_numeric(df_combined['label'], errors = 'coerce')

#Make sure the date col is datetime 
df_combined['date'] = pd.to_datetime(df['date'])

#copy the labels into their own dataframe
label_df = df_combined['label']

#Split the training set from the test set
#Training set - Subset used to train the model
#Test set- a subset to test the trained model 

df_train = df_combined[num_upcoming_fights:]
label_train = label_df[num_upcoming_fights:]

df_test = df_combined[:num_upcoming_fights]
label_test = label_df[:num_upcoming_fights]

# Check for identical sizes of dataframes
print(len(df_test))
print(len(label_test))

print(len(df_train))
print(len(label_train))

#pick a model
my_model = DecisionTreeClassifier(max_depth = 5)

# in reality, odds should be checked by a lot more factors
#weighclass, TD_avg, TD_Acc, TD_Def, sub_avg should be addede
my_features = ['R_odds', 'B_Stance'] 

#Grab the names for the upcoming fighters
fighters_test = df_test[['R_fighter', 'B_fighter']]
odds_test = df_test[['R_odds', 'B_odds']]

#Make dataframes include only relevant features 
df_train_prepped = df_train[my_features].copy()
df_test_prepped = df_test[my_features].copy()

#Dummify the dataset
df_train_prepped = pd.get_dummies(df_train_prepped)
df_test_prepped = pd.get_dummies(df_test_prepped)

#Align the dummification
df_train_prepped, df_test_prepped = df_train_prepped.align(df_test_prepped, join='left', axis=1)

# Fill Na with 0s
df_test_prepped = df_test_prepped.fillna(0)

#Drop matching rows
label_train_prepped = label_train[label_train.index.isin(df_train_prepped.index)]
label_test_prepped = label_test[label_test.index.isin(df_test_prepped.index)]
fighters_test_prepped = fighters_test[fighters_test.index.isin(df_test_prepped.index)]
odds_test_prepped = odds_test[odds_test.index.isin(df_test_prepped.index)]

print(len(label_train_prepped))
print(len(df_train_prepped))
print(len(label_test_prepped))
print(len(df_test_prepped))
print(len(fighters_test_prepped))
print(len(odds_test_prepped))

my_model.fit(df_train_prepped, label_train_prepped)

#Get probabilities
probs = my_model.predict_proba(df_test_prepped)

#Put fighter names, and probs 
fighters_array = fighters_test_prepped.to_numpy()

probs_list = np.array(list(zip(fighters_array, probs)))

print(probs_list) #Export this into a csv, send to front end 