from flask import Blueprint, jsonify, request
import pandas as pd
from .logic import prep_data, pipeline_predict

predict = Blueprint('predict', __name__)

@predict.route('/1')
def index():
    # response = requests.get('https://ergast.com/api/f1/2024/drivers')
    # driver = pd.read_csv('project/drivers.csv')
    if request.method == 'POST':
        data = request.json
        print(data)
    return jsonify({"message": "Pick the drivers"})

@predict.route('/2', methods=['POST'])
def backend():
    # build a page to allow users to select the drivers, by default will use the current const
    # then map current const to old const i am using
    # {"Sauber": "Alfa Romeo", "RB F1 Team": "AlphaTauri"}
    const_names = {"Sauber": "Alfa Romeo", "RB F1 Team": "AlphaTauri"}
    data = request.json  # Get the JSON data from the request
    if not data or 'data' not in data or 'GP_name' not in data:
        return jsonify({"error": "Invalid data"}), 400

    data['data']['quali_pos'] = [13, 3, 5, 14, 1, 2, 11, 9, 8, 4, 12]
    print(data)

    json = {
        'driver': ['Alexander Albon'],
        'constructor': ['Williams'],
        'quali_pos': [10]
    }
    data1 = prep_data(data['data'], data['GP_name'], const_names)

    prediction = pipeline_predict(data1)
    
    reverse_const_names = {v: k for k, v in const_names.items()}
    prediction['constructor'] = prediction['constructor'].map(reverse_const_names).fillna(prediction['constructor'])
    # input data: driver, constructor, quali_pos, GP_name
    # https://ergast.com/api/f1/2024/drivers
    #1. get list of drivers using api
    #2. process the data
    #3. predict
    # model eval

    # model result
    result = prediction.to_json(orient='records')
    result1 = {'data': result}
    return jsonify(result1)
