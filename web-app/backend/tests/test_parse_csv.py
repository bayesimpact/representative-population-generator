"""All tests related to parsing CSV file."""

import io

from backend.app import extract_zip_counties
from backend.lib.exceptions import InvalidPayload
from backend.lib.helper import jsonify_input

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
    object_to_send = _load_convert_file('tests/assets/test_1.csv')
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
    """Test class for extract_zip_counties method."""

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
            output = extract_zip_counties(self.app)
        return output

    def test_parsing_csv_1(self):
        """Test parsing of test_1.csv with both zip and county columns."""
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
        output = self._testing_csv_parsing('tests/assets/test_1.csv')
        assert (expected == output)

    def test_parsing_csv_2(self):
        """Test parsing of test_2.csv with only county column."""
        expected = [
            {
                'countyName': 'San Diego',
            },
            {
                'countyName': 'san francisco',
            }
        ]
        output = self._testing_csv_parsing('tests/assets/test_2.csv')
        assert (output == expected)

    def test_parsing_csv_3(self):
        """Test parsing of test_3.csv with only zip column."""
        expected = [
            {
                'zipCode': '92084',
            },
            {
                'zipCode': '94117',
            }
        ]
        output = self._testing_csv_parsing('tests/assets/test_3.csv')
        assert (output == expected)

    def test_parsing_csv_4(self):
        """Test parsing of test_4.csv with no zip nor county columns."""
        message = 'Invalid CSV file. No Zip or County columns found.'
        with pytest.raises(InvalidPayload, message=message):
            self._testing_csv_parsing('tests/assets/test_4.csv')

    def test_parsing_csv_5(self):
        """Test parsing of test_5.csv with invalid input file."""
        message = 'Invalid CSV file. Was not able to parse.'
        with pytest.raises(InvalidPayload, message=message):
            self._testing_csv_parsing('tests/assets/test_5.csv')
