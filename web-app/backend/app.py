"""Routing for backend API."""

import os

import flask

from flask_pymongo import PyMongo


app = flask.Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://mongo:27017/representativepoints'

mongo = PyMongo(app)
with app.app_context():
    repr_points = mongo.db.pointA


@app.route('/areas', methods=['GET'])
def get_zip_county_points():
    """
    Given a list of areas return the list of corresponding points.

    input: list of zip and county objects.
    areas = [
        {"county": "sanFrancisco", "zip": 94102},
        {"county": "sanFrancisco", "zip": 94705}
    ]
    """
    areas = eval(flask.request.args['areas'])
    outputs = []
    for area in areas:
        points = repr_points.find_one(area)
        output = {
            'area_info': {
                'county': area['county'],
                'zip': area['zip']
            }
        }
        if points:
            output['points'] = points['points']
        else:
            output['points'] = 'No such zip/county'
        outputs.append(output)
    return flask.jsonify({'result': outputs})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=port)
