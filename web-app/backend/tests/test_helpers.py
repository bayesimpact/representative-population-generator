"""Test methods for all helper functions."""

import codecs

from backend.lib.helper import clean_input
from backend.lib.helper import jsonify_input
from backend.lib.helper import standardize_input_keys


def test_standardize_input_keys():
    """Test standardize_input_keys function."""
    input_dict_1 = {'county': 'abc', 'Zip': '21421'}
    input_dict_2 = {'countyname': 'abc', 'zip code': '21421', }
    input_dict_3 = {'CountyName': 'abc', 'zipCode': '21421', 'populationpointsperzipcode': 50}
    expected_output = {
        'ServiceArea.CountyName': 'abc',
        'ServiceArea.ZipCode': '21421'
    }
    assert (standardize_input_keys(input_dict_1) == expected_output)
    assert (standardize_input_keys(input_dict_2) == expected_output)
    assert (standardize_input_keys(input_dict_3) == expected_output)


def test_jsonify_input():
    """Test jasonify_input method."""
    with codecs.open('tests/assets/test.csv', 'r') as test_file:
        output_json = jsonify_input(test_file.read())
    expected_output = [
        {
            'CountyName': 'San Diego',
            'City': 'Vista',
            'ZipCode': '92084',
            'PopulationPointsPerZipCode': '100'
        },
        {
            'CountyName': 'sanfrancisco',
            'City': 'san Francisco',
            'ZipCode': '94117',
            'PopulationPointsPerZipCode': '1001'
        }
    ]
    assert (output_json == expected_output)


def test_clean_input():
    """Test clean_input helper method."""
    input_json = [{'a': '', 'b': '1'}, {'c': None}]
    expected_output = [{'b': '1'}]
    assert (clean_input(input_json) == expected_output)
