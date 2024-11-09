import time
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from project.show_data import show_data as data_bp
from project.predict import predict as predict_bp
app.register_blueprint(data_bp, url_prefix='/data')
app.register_blueprint(predict_bp, url_prefix='/predict')

@app.route('/main')
def index1():
    return jsonify({"message": "testing"})

# "test-api": "cd api && flask test"
@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# to run fe and be
# fe: yarn start
# be: flask run

# git add .
# git commit -m "name"
# git push

# now focus:
# CI/CD
# continuous training for the model, setup