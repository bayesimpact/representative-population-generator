"""This file contains common methods and functions used throughout the test suite."""
import geopandas as gpd


def load_sample_data():
    """Load the sample data into a GeoPandas GeoDataFrame."""
    return gpd.read_file('tests/assets/sample_data.geojson')
