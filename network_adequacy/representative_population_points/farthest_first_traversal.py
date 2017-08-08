"""This module contains a greedy implementation of a farthest-first traversal algorithm."""
import numpy as np


class FarthestFirstTraversal(object):
    """
    A wrapper for the farthest-first traversal algorithm.

    Parameters
    ----------
    k: int
        The number of points to select.

    distance_metric: two-argument callable
        A function that measures the distance between two input geometries.
        Defaults to the Euclidean distance between points.
        Note that the default metric is inaccurate if the input geometries are coordinates
        in a non-Euclidean space (e.g., latitude and longitude).

    method_to_select_first_point: one-argument callable
        A function that selects a single point from an array of geometric objects.
        Defaults to uniform random selection using numpy.

    Attributes
    ----------
    is_fitted: bool
        Indicates whether or not the algorithm has been fitted to input data.

    selected_points: list
        The `k` points chosen by the traversal.

    distances_to_selected_points: np.array
        Array containing the final distance from each input point to the selected points.

    assignments_to_selected_points: np.array
        Final assignments for each input point to the nearest selected point.

    _distances_as_function_of_k: list(np.array)
        List of the historical values of `distances_to_selected_points` after each new point
    """

    def __init__(
        self,
        k,
        distance_metric=lambda p1, p2: p1.distance(p2),
        method_to_select_first_point=np.random.choice,
    ):
        """Initialize self."""
        self.k = k
        self._distance_metric = distance_metric
        self._method_to_select_first_point = method_to_select_first_point
        self.is_fitted = False

    def fit(self, data):
        """
        Select k points using the farthest first traversal algorithm.

        Parameters
        ----------
        data: Array of geometric objects implementing self._distance_metric.
        """
        self._choose_first_point(data)

        for i in range(1, self.k):
            self._choose_next_point(data)

        self.is_fitted = True

    def _choose_first_point(self, data):
        """Choose the first point and update attributes."""
        point = self._method_to_select_first_point(data)
        self.selected_points = [point]

        self.distances_to_selected_points = np.asarray(
            [self._distance_metric(x, point) for x in data]
        )

        self._distances_as_function_of_k = [self.distances_to_selected_points]

        self.assignments_to_selected_points = np.zeros(shape=data.shape, dtype=int)

        return point

    def _choose_next_point(self, data):
        """
        Choose the new point as the point farthest from the selected points.

        Update distances to reflect the choice.
        """
        # Choose the point that is farthest away from all currently selected points.
        new_point = data[np.argmax(self.distances_to_selected_points)]
        self.selected_points.append(new_point)

        # Calculate distances to the new point.
        distances_to_new_point = np.asarray(
            [self._distance_metric(x, new_point) for x in data]
        )

        # Set the distance to the selected points as the minimum distance over all selected points.
        self.distances_to_selected_points = np.minimum(
            distances_to_new_point,
            self.distances_to_selected_points,
        )

        # Reassign nearby data points to the new selected point as needed.
        self.assignments_to_selected_points[
            self.distances_to_selected_points == distances_to_new_point
        ] = len(self.selected_points) - 1

        self._distances_as_function_of_k.append(self.distances_to_selected_points)

        return new_point
