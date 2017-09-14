"""Helper functions for the backend."""

import csv
import json


def get_areas_data(repr_points, areas, logger=None):
    """Process a list of zipcode/county pair."""
    outputs = []
    invalid_areas = []
    for area in areas:
        # Force int casting.
        area['zip'] = area['zip']
        point_a = repr_points.find_one(area)
        output = {
            'area_info': {
                'county': area['county'],
                'zip': area['zip']
            }
        }
        if logger:
            logger.info(point_a)
        if point_a:
            output['points'] = point_a['points']
            outputs.append(output)
        else:
            output['points'] = 'Zip/County pair unavailable.'
            invalid_areas.append(output)

    return outputs, invalid_areas


def csv2json(data, logger=None):
    """Transform a csv into json."""
    reader = csv.DictReader(data, delimiter=',', fieldnames=['county', 'zip'])
    # Exclude header.
    json_list = list(reader)[1:]
    json_output = json.dumps(json_list)
    if logger:
        logger.info('JSON parsed!')
    return json_output
