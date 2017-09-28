"""All tests related to parsing CSV file."""

import io

from backend.app import _extract_zip_counties
from backend.lib.exceptions import InvalidPayload
from backend.lib.helper import jsonify_input
from backend.tests.helper import compare_lists_of_dict

import flask
from flask.ext.testing import LiveServerTestCase

import mock

import pytest


def _load_convert_file(file_path):
    with io.open(file_path, 'r') as fname:
        converted_input_file = io.BytesIO(fname.read().encode('ascii'))
    return converted_input_file


def test_jsonify_input():
    """Test jasonify_input method."""
    object_to_send = _load_convert_file('tests/assets/test_input_zip_and_county.csv')
    output_json = jsonify_input(object_to_send.read().decode('utf-8'))
    expected_output = [
        {
            'CountyName': 'San Diego',
            'City': 'Vista',
            'ZipCode': '92084',
            'PopulationPointsPerZipCode': '100'
        },
        {
            'CountyName': 'san francisco',
            'City': 'san Francisco',
            'ZipCode': '94117',
            'PopulationPointsPerZipCode': '1001'
        }
    ]
    assert (output_json == expected_output)


class TestGetZipCounties(LiveServerTestCase):
    """Test class for _extract_zip_counties method."""

    def create_app(self):
        """Start a new flask app for testing."""
        app = flask.Flask(__name__)
        app.config['TESTING'] = True
        return app

    def _testing_csv_parsing(self, file_path):
        """Generic test method for parsing valid CSV file."""
        mock_file = _load_convert_file(file_path)
        with mock.patch('flask.request') as mock_request:
            mock_request.files.__getitem__.return_value = mock_file
            output = _extract_zip_counties(self.app)
        return output

    def test_parsing_csv_zip_and_county(self):
        """Test parsing of test_input_zip_and_county.csv with both zip and county columns."""
        expected = [
            {
                'countyName': 'San Diego',
                'zipCode': '92084'
            },
            {
                'countyName': 'san francisco',
                'zipCode': '94117'
            }
        ]
        output = self._testing_csv_parsing('tests/assets/test_input_zip_and_county.csv')
        assert (compare_lists_of_dict(expected, output))

    def test_parsing_csv_county_only(self):
        """Test parsing of test_input_county_only.csv with only county column."""
        expected = [
            {
                'countyName': 'San Diego',
            },
            {
                'countyName': 'san francisco',
            }
        ]
        output = self._testing_csv_parsing('tests/assets/test_input_county_only.csv')
        assert (compare_lists_of_dict(expected, output))

    def test_parsing_csv_zip_only_self(self):
        """Test parsing of test_input_zip_only.csv with only zip column."""
        expected = [
            {
                'zipCode': '92084',
            },
            {
                'zipCode': '94117',
            }
        ]
        output = self._testing_csv_parsing('tests/assets/test_input_zip_only.csv')
        assert (compare_lists_of_dict(expected, output))

    def test_parsing_csv_no_zip_no_county(self):
        """Test parsing of test_input_no_zip_no_county.csv with no zip nor county columns."""
        message = 'Invalid CSV file. No Zip or County columns found.'
        with pytest.raises(InvalidPayload, message=message):
            self._testing_csv_parsing('tests/assets/test_input_no_zip_no_county.csv')

    def test_parsing_csv_invalid_file(self):
        """Test parsing of test_invalid_input_file.csv with invalid input file."""
        message = 'Invalid CSV file. Was not able to parse.'
        with pytest.raises(InvalidPayload, message=message):
            self._testing_csv_parsing('tests/assets/test_invalid_input_file.csv')
