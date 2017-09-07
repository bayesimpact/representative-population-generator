"""Routing for backend API."""
import csv
import json
import os

from io import StringIO

from backend.lib import api_exceptions

import flask

from flask_cors import CORS

from flask_pymongo import PyMongo


app = flask.Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://mongo:27017/representativepoints'
CORS(app)

mongo = PyMongo(app)
with app.app_context():
    repr_points = mongo.db.pointA


# TODO - Move helper functions to lib.
def get_areas_data(areas):
    """Process a list of zipcode/county pair."""
    outputs = []
    invalid_areas = []
    for area in areas:
        # Force int casting.
        area['zip'] = int(area['zip'])
        point_a = repr_points.find_one(area)
        output = {
            'area_info': {
                'county': area['county'],
                'zip': area['zip']
            }
        }
        app.logger.info(point_a)
        if point_a:
            output['points'] = point_a['points']
            outputs.append(output)
        else:
            output['points'] = 'Zip/County pair unavailable.'
            invalid_areas.append(output)

    return outputs, invalid_areas


def csv2json(data):
    """Transform a csv into json."""
    reader = csv.DictReader(data, delimiter=',', fieldnames=['county', 'zip'])
    # Exclude header.
    json_list = list(reader)[1:]
    json_output = json.dumps(json_list)
    app.logger.info('JSON parsed!')
    return json_output


@app.errorhandler(api_exceptions.UnavailableZipCounty)
def handle_invalid_usage(error):
    """Function to handle an internal server error."""
    response = flask.jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route('/area', methods=['GET'])
def get_single_zip_county_points():
    """
    Given a single zip/county pair, return the corresponding points.

    input: two params, zip and county
    E.g ?"county":"sanFrancisco","zip":94102
    returns: json object with info about area and a list of points.
    """
    county = flask.request.args['county']
    zipcode = int(flask.request.args['zip'])
    point_a = repr_points.find_one({'zip': zipcode, 'county': county})
    if point_a:
        output = {
            'area_info': {
                'county': county,
                'zip': zipcode
            },
            'points': point_a['points']
        }
    else:
        raise api_exceptions.UnavailableZipCounty(
            message='Zip/County pair unavailable.',
            status_code=500)
    return flask.jsonify(output)


@app.route('/areas', methods=['GET'])
def get_multiple_zip_county_points():
    """
    Given a list of areas return the list of corresponding points.

    input: list of zip and county objects.
    E.g. areas = [
        {"county": "sanFrancisco", "zip": 94102},
        {"county": "sanFrancisco", "zip": 94705}
    ]
    returns: json object with info about area and a list of points.
    """
    areas = eval(flask.request.args['areas'])
    outputs, _ = get_areas_data(areas)
    return flask.jsonify({'result': outputs})


@app.route('/csv/', methods=['GET', 'POST'])
def convert():
    """
    Convert a POSTed csv into json.

    Given a list of areas as csv, return the info about the areas
    and list of points.

    returns: json object with info about area and a list of points.
    """
    f = flask.request.files['data_file']
    if not f:
        app.logger.info('No file')
        return 'No file'
    file_contents = f.stream.read().decode('utf-8')
    file_contents = StringIO(file_contents)
    areas = csv2json(file_contents)
    app.logger.info('Areas {}'.format(areas))
    outputs, _ = get_areas_data(eval(areas))
    return flask.jsonify({'result': outputs})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=port)
