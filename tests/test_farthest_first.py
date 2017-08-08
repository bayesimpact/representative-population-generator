"""Tests for the farthest-first algorithm and implementation."""
from network_adequacy.representative_population_points import farthest_first_traversal

import pytest

from tests.assets import helpers


class TestFarthestFirstTraversal():
    """Test the farthest-first traversal implementation."""

    def setup(self):
        """Initialize and fit algorithm."""
        self.points = helpers.load_sample_data()['geometry'].values
        self.k = 40
        self.traversal = farthest_first_traversal.FarthestFirstTraversal(k=self.k)
        self.traversal.fit(self.points)

    def test_that_the_fitted_model_picks_the_correct_number_of_points(self):
        """Test that the farthest first algorithm picks the correct number of points."""
        assert(len(self.traversal.selected_points) == self.k)

    def test_that_unfitted_traversal_raises_attribute_error(self):
        """Test that the farthest first raises an error if not fitted."""
        unfitted_traversal = farthest_first_traversal.FarthestFirstTraversal(k=self.k)
        with pytest.raises(AttributeError):
            unfitted_traversal.selected_points
