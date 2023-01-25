# UFC Fight Predictor

## Live Demos
- Full Stack app using [Heroku](https://ufc-fight-predictor.herokuapp.com/static/)
- Jupyter notebook using [Google Colab](https://colab.research.google.com/drive/17iKQNxBbhu-wyfHT3-4jyK4RL7kIiuQH?usp=sharing)

## Tools and Technologies

Front-end:
* React.js
* Material UI

Back-end:
* FastAPI
* Python

Machine Learning:
*  **Random Forest Model** with ~63% accuracy over 5-fold cross validation
*  pandas
*  sklearn
*  numpy

## How to run this app locally

1. Navigate to client side using ```cd client/``` and run:
```
npm install
npm run buildncopy

```

2. Navigate to server side using ```cd ../server/``` and run:
```
uvicorn main:app --reload
```

3. Your app will be live at: http://localhost:8000/static/

4. That's it!