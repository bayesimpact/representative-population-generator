"""Routing for backend API."""

import flask
import pymongo
import random
import os

app = flask.Flask(__name__)
client = pymongo.MongoClient('mongo', 27017)


@app.route("/get/area/<int:zipcode>/<int:county>")
def get_zip_county_points(zipcode, county):
    """
    Given a zip code and a county return the list of corresponding points.

    input: zip and county
    """
    number = str(random.randint(1, 100))  # TODO: replace this with model
    return number


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0', port=port)
