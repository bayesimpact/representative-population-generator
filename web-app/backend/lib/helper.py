"""Helper functions for the backend."""

import csv
import io
import re


def fetch_representative_points(representative_point_db, service_areas, boundary_db, logger=None):
    """Given a list of service areas, fetch and return point As for each one."""
    outputs = []
    logger.info('Finding representative points for {} service areas'.format(len(service_areas)))
    for area in service_areas:
        representative_points = find_representative_points(representative_point_db, area, logger)
        boundary = find_boundary(boundary_db, area, logger)
        output = prepare_return_object(representative_points, boundary, area)
        outputs.append(output)
    logger.info(outputs)
    return outputs


def parse_csv_to_json(zipcounty_file, logger=None):
    """Transform a csv into json."""
    json_zipcounty_output = jsonify_input(zipcounty_file.read().decode('utf-8'), logger)
    return json_zipcounty_output


def jsonify_input(input_string, logger=None):
    """Convert input CSV file into a JSON object."""
    file_content = io.StringIO(input_string)
    return list(csv.DictReader(file_content))


def standardize_request(input_json_list):
    """
    Given a list of json object, standardize it by removing empty items and change the keys.

    Return a list of dicts with keys being any combination of ('countyName', 'zipCode').
    """
    stage_1 = list(map(_standardize_keys, input_json_list))
    zipcounties = list(map(_remove_empty_items, filter(None, stage_1)))
    zipcounties = _remove_duplicates(zipcounties)
    # Standardize county names.
    zipcounties = [_standardize_county_name(zipcounty) for zipcounty in zipcounties]
    return zipcounties


def _standardize_keys(zipcounty):
    """Standardize and keep relevent fields (zip and county)."""
    standard_area = {}
    for k, v in zipcounty.items():
        if k.replace(' ', '').lower() in ['zip', 'zipcode', 'zip code']:
            standard_area['zipCode'] = v
        if k.replace(' ', '').lower() in ['county', 'countyname', 'county name']:
            standard_area['countyName'] = v
    return standard_area


def _remove_empty_items(input_json):
    """Removing nulls and empty strings from input_json."""
    row_output = dict((k, v) for k, v in input_json.items() if v)
    return row_output if row_output else None


def _remove_duplicates(zipcounties):
    return [
        dict(zipcounty_tuple) for zipcounty_tuple in
        set([tuple(zipcounty.items()) for zipcounty in zipcounties])
    ]


def _standardize_county_name(zipcounty):
    """
    Standardize county name to match with our 'San Francisco' like formatting.

    Takes a zipcounty dict and updates 'countyName' key if exists.
    """
    if 'countyName' in zipcounty.keys():
        countyname = zipcounty['countyName'].lower()
        county_list = [word[0].upper() + word[1:] for word in countyname.split()]
        zipcounty['countyName'] = ' '.join(county_list)

    return zipcounty


def find_representative_points(representative_point_db, service_area, logger=None):
    """Given a standard service_area, return corresponding representative points from db."""
    key_map = {'countyName': 'ServiceArea.CountyName', 'zipCode': 'ServiceArea.ZipCode'}
    try:
        area = dict((key_map[k], v) for k, v in service_area.items())
        representative_point = representative_point_db.find_one(area)
        return representative_point['ReprPopPoints']['PointA']
    except:
        return []


def find_boundary(boundary_db, service_area, logger=None):
    """Given a standard service_area, find and return boundaries."""
    key_map = {'countyName': 'properties.NAME', 'zipCode': 'properties.ZIP'}
    try:
        area = dict((key_map[k], v) for k, v in service_area.items())
        boundary = boundary_db.find_one(area)
        return {'geometry': boundary['geometry']}
    except:
        return None


def prepare_return_object(points, boundary, area):
    """Prepare the object that is being returned for each service_area."""
    return_object = {
        'areaInfo': area,
        'points': points,
        'boundary': boundary
    }
    return_object['availabilityStatus'] = _flag_service_area_availability(bool(points))
    return return_object


def _flag_service_area_availability(is_available=True):
    available_msg = 'Service area available.'
    unavailable_msg = 'Service area unavailable.'
    status = {}

    status['isServiceAreaAvailable'] = is_available
    status['message'] = available_msg if is_available else unavailable_msg
    return status
