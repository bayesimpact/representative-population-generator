"""Requests handling."""
import json

from backend.lib.exceptions import InvalidPayload
from backend.lib.helper import (parse_csv_to_json, standardize_request)
from backend.lib.timer import timed

import flask

# TODO - Revamp request handling.
@timed
def extract_zip_counties(app):
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
                    raw_zipcounties = json.loads(flask.request.data)
                except:
                    try:
                        zipcounties_file = flask.request.files['zipcounty_file']
                        raw_zipcounties = parse_csv_to_json(zipcounties_file, logger=app.logger)
                    except KeyError:
                        msg = (
                            'The CSV file has to be given as a form parameter named zipcounty_file.'
                        )
                        raise InvalidPayload(msg)
        try:
            zipcounties = standardize_request(raw_zipcounties)
            if not zipcounties:
                raise InvalidPayload(message='Invalid CSV file. No Zip or County columns found.')
        except:
            raise InvalidPayload(message='Invalid CSV file. Was not able to parse.')
    app.logger.debug('Extracted zip counties.')
    return zipcounties