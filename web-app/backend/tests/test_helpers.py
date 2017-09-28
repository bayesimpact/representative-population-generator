"""Test methods for all helper functions."""

from backend.lib.helper import prepare_return_object
from backend.lib.helper import remove_empty_items
from backend.lib.helper import standardize_keys
from backend.lib.helper import standardize_request
from backend.tests.helper import compare_lists_of_dict


def test_standardize_keys():
    """Test standardize_keys function."""
    input_dict_1 = {'county': 'abc', 'Zip': '21421'}
    input_dict_2 = {'countyname': 'abc', 'zip code': '21421', }
    input_dict_3 = {'CountyName': 'abc', 'zipCode': '21421', 'populationpointsperzipcode': 50}
    expected_output = {
        'countyName': 'abc',
        'zipCode': '21421'
    }
    assert (standardize_keys(input_dict_1) == expected_output)
    assert (standardize_keys(input_dict_2) == expected_output)
    assert (standardize_keys(input_dict_3) == expected_output)


def test_remove_empty_items():
    """Test remove_empty_items helper method."""
    input_json_1 = {'a': '', 'b': '1'}
    expected_output_1 = {'b': '1'}

    input_json_2 = {'c': None}
    expected_output_2 = None
    assert (remove_empty_items(input_json_1) == expected_output_1)
    assert (remove_empty_items(input_json_2) == expected_output_2)


def test_standardize_request():
    """Test standardize_request helper method."""
    input_json = [
        {
            'County name': 'San Diego',
            'City': 'Vista',
            'zip': '92084',
            'PopulationPointsPerZipCode': '100'
        },
        {
            'CountyName': 'sanfrancisco',
            'City': 'san Francisco',
            'ZipCode': '',
            'abc': '1001'
        }
    ]
    expected_output = [
        {
            'countyName': 'San Diego',
            'zipCode': '92084'
        },
        {
            'countyName': 'sanfrancisco'
        }
    ]
    assert(compare_lists_of_dict(standardize_request(input_json), expected_output))


def test_prepare_return_object_valid_points():
    """Test prepare_return_object method when recieving valid list of points."""
    points = [1, 2, 3]
    boundary = {'coordinates': [[[1, 2]]]}
    area = {'countyName': 'a', 'zipCode': '90000'}
    res = prepare_return_object(points, boundary, area)
    assert (res['points'] == points)
    assert (res['boundary'] == boundary)
    assert (res['availabilityStatus']['isServiceAreaAvailable'])


def test_prepare_return_object_no_points():
    """Test prepare_return_object method when recieving no points."""
    points = []
    boundary = {'coordinates': [[[1, 2]]]}
    area = {'countyName': 'a', 'zipCode': '90000'}
    res = prepare_return_object(points, boundary, area)
    assert (not res['points'])
    assert (res['boundary'] == boundary)
    assert (not res['availabilityStatus']['isServiceAreaAvailable'])
