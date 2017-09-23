"""Routing for backend API."""
import json
import os

from backend.lib.exceptions import InvalidPayload
from backend.lib.helper import fetch_point_as
from backend.lib.helper import parse_csv_to_json
from backend.lib.helper import standardize_request

import flask

from flask_cors import CORS

from flask_pymongo import PyMongo


app = flask.Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://mongo:27017/representativepoints'
CORS(app, resources={r'/*': {'origins': '*'}}, supports_credentials=True)

mongo = PyMongo(app)
with app.app_context():
    repr_points = mongo.db.pointAs
    service_areas = mongo.db.service_areas
    boundaries = mongo.db.boundaries


@app.route('/available-service-areas', methods=['GET'])
def fetch_available_service_areas():
    """Fetch and return all available service areas from db."""
    fetched_areas = list(service_areas.find({}, {'_id': 0}))
    return flask.jsonify({'result': fetched_areas})


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
    zipcounties = exctract_zip_counties(app)
    outputs = fetch_point_as(repr_points, zipcounties, boundaries, logger=app.logger)
    return flask.jsonify({'result': outputs})


def exctract_zip_counties(app):
    """
    Extract zipcounties from different flask input methods.

    There are three different methods to send zip/county payload.
    There is a try-catch section for each one.
    """
    with app.app_context():
        try:
            raw_zipcounties = json.loads(flask.request.values['zipcounties'])
        except:
            try:
                raw_zipcounties = json.loads(flask.request.args['zipcounties'])
            except:
                try:
                    zipcounties_file = flask.request.files['zipcounty_file']
                    raw_zipcounties = parse_csv_to_json(zipcounties_file, logger=app.logger)
                except KeyError:
                    msg = 'The CSV file has to be given as a form parameter named zipcounty_file.'
                    raise InvalidPayload(msg)
        try:
            zipcounties = standardize_request(raw_zipcounties)
            if not zipcounties:
                raise InvalidPayload(message='Invalid CSV file. No Zip or County columns found.')
        except:
            raise InvalidPayload(message='Invalid CSV file. Was not able to parse.')
    return zipcounties


@app.errorhandler(InvalidPayload)
def handle_invalid_payload(error):
    """Handle exception when the payload is invalid."""
    response = flask.jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=port)
