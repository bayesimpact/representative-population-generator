"""Helper functions for the backend."""

import csv
import json
import io
import re


def get_areas_data(repr_points, service_areas, logger=None):
    """Process a list of zipcode/county pair."""
    outputs = []
    logger.info('Finding point As for {} service areas'.format(len(service_areas)))
    for area in service_areas:
        service_area = standardize_input_keys(area)
        output = {
            'area_info': service_area
        }
        try:
            area_regex = dict((k, _regexifgy_input(v)) for k, v in service_area.items())
            point_a = repr_points.find_one(area_regex)
            output['points'] = point_a['points']
            outputs.append(output)
        except:
            output['points'] = 'Zip/County pair unavailable.'
            outputs.append(output)
    return outputs


def get_service_areas_from_input_file(zipcounty_file, logger=None):
    """Transform a csv into json."""
    json_zipcounty_input = jsonify_input(zipcounty_file)
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
        output_json.append(row_output)
    return output_json


def jsonify_input(input_file):
    """Convert input CSV file into a JSON object."""
    file_content = io.StringIO(input_file.stream.read().decode('utf-8'))
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
