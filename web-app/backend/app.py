"""Routing for backend API."""

import os

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
    outputs = []
    for area in areas:
        point_a = repr_points.find_one(area)
        output = {
            'area_info': {
                'county': area['county'],
                'zip': area['zip']
            }
        }
        if point_a:
            output['points'] = point_a['points']
        else:
            output['points'] = 'Zip/County pair unavailable.'
        outputs.append(output)

    return flask.jsonify({'result': outputs})


@app.route('/areas', methods=['OPTIONS'])
def no_op_handler():
    """Return 200 to any OPTIONS request."""
    return None

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=port)
