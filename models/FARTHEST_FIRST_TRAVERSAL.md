# Farthest-First Traversal Algorithm

We use the farthest-first traversal algorithm to identify representative population points in a given service area. The farthest first traversal algorithm provides an approximate solution to the metric k-center problem: "Given $*n$* cities with specified distances, one wants to build $k$ warehouses in different cities and minimize the maximum distance of a city to a warehouse."

Intuitively, we want every input population point (city) in a ZIP code to be near to one of the selected representative population points (warehouse). Accordingly, solutions to this problem should make for "good" selections of representative population points, where "good" remains to be defined.

This greedy solution has an approximation factor of 2 and a runtime of $O(n^2)$.

## Advantages

* Sequential choice of points allows for agnosticism about the correct value of $k$ prior to running

* Time complexity $O(n^2)$

## Disadvantages

* Sensitivity to outliers

* Element of randomness (selection of first point)

* This disadvantage can be avoided by choosing the first point deterministically

* Does not treat regions of varying densities differently

For an in-depth exploration of the use of this algorithm, visit [this Python notebook.](data_analysis/notebooks/Farthest%20First%20Traversal.ipynb)

