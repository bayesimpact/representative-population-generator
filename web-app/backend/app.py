"""Routing for backend API."""
import json
import os

from backend.lib.helper import fetch_point_as
from backend.lib.helper import get_service_areas_from_input_file

import flask

from flask_cors import CORS

from flask_pymongo import PyMongo


app = flask.Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://mongo:27017/representativepoints'
CORS(app, resources={r'/*': {'origins': '*'}}, supports_credentials=True)

mongo = PyMongo(app)
with app.app_context():
    repr_points = mongo.db.pointA


@app.route('/areas', methods=['GET', 'POST'])
def get_multiple_zip_county_points():
    """
    Given a list of areas return the list of corresponding points.

    input: list of zip and county objects in either of three formats:
        - list of zip-county objects as body of POST request
        - list of zip-county objects as params of GET request
        - list of zip-county as a csv file in body of POST request
    E.g. areas = [
        {"county": "sanFrancisco", "zip": "94102"},
        {"county": "sanFrancisco"},
        {"zip": "94705"}
    ]
    returns: json object with info about area and a list of points.
    """
    try:
        zipcounties = json.loads(flask.request.values['zipcounties'])
    except:
        try:
            zipcounties = json.loads(flask.request.args['zipcounties'])
        except:
            try:
                zipcounties_file = flask.request.files['zipcounty_file']
                zipcounties = get_service_areas_from_input_file(zipcounties_file, logger=app.logger)
            except:
                return flask.jsonify({'result': 'Something went wrong. Check your input.'})
    outputs = fetch_point_as(repr_points, zipcounties, logger=app.logger)
    return flask.jsonify({'result': outputs})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=port)
