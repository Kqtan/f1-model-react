from flask import Blueprint, jsonify

show_data = Blueprint('data', __name__)

@show_data.route('/main')
def main_page():
    return jsonify({"message": "main page"})