"""Helper functions for the backend."""

import csv
import json
import io
import re


def fetch_point_as(point_a_db, service_areas, logger=None):
    """Given a list of service areas, fetch and return point As for each one."""
    outputs = []
    logger.info('Finding point As for {} service areas'.format(len(service_areas)))
    for area in service_areas:
        service_area = standardize_input_keys(area)
        output = {
            'area_info': service_area
        }
        try:
            area_regex = dict((k, _regexifgy_input(v)) for k, v in service_area.items())
            point_a = point_a_db.find_one(area_regex)
            output['points'] = point_a['points']
            output['availability_status'] = _flag_service_area_availability(True)
        except:
            output['points'] = []
            output['availability_status'] = _flag_service_area_availability(False)
        outputs.append(output)
    return outputs


def get_service_areas_from_input_file(zipcounty_file, logger=None):
    """Transform a csv into json."""
    json_zipcounty_input = jsonify_input(zipcounty_file.read().decode('utf-8'))
    json_zipcounty_output = clean_input(json_zipcounty_input)
    if logger:
        logger.info('Input CSV file parsed into JSON format!')
    return json_zipcounty_output


def clean_input(input_json):
    """Prepare input json file by removing nulls and empty strings."""
    output_json = []
    for row_input in input_json:
        # Remove empty strings and Null elements
        row_output = dict((k, v) for k, v in row_input.items() if v)
        if row_output:
            output_json.append(row_output)
    return output_json


def jsonify_input(input_string):
    """Convert input CSV file into a JSON object."""
    file_content = io.StringIO(input_string)
    raw_input = list(csv.DictReader(file_content))
    return eval(json.dumps(raw_input))


def standardize_input_keys(input_dict):
    """Standardize all keys to match db."""
    standard_area = {}
    for k, v in input_dict.items():
        if k.replace(' ', '').lower() in ['zip', 'zipcode']:
            standard_area['zip'] = v
        if k.replace(' ', '').lower() in ['county', 'countyname']:
            standard_area['county'] = v
    return standard_area


def _regexifgy_input(input_value):
    return re.compile(input_value.replace(' ', ''), re.IGNORECASE)


def _flag_service_area_availability(is_available=True):
    available_msg = 'Service area available.'
    unavailable_msg = 'Service area unavailable.'
    status = {}

    status['is_service_area_available'] = is_available
    status['message'] = available_msg if is_available else unavailable_msg
    return status
