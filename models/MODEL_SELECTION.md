## Model Selection and Validation

### Problem Statement

The ultimate purpose of the representative population points generator is to assist in measuring the adequacy of insurance networks. If a remote cluster of points has no representative point among them, the ensuing network adequacy analysis will utterly overlook the people who live there. Accordingly, good algorithms for this particular use case should ensure that _all_ points are near to at least one representative point.

**Caveat**: the _Garbage In, Garbage Out_ principle applies here. If the input data does not accurately reflect where people actually live and work, then any points selected by an algorithm won’t either. For the purposes of this document, we assume that the input is valid and concern ourselves only with the problem of selecting representative points from trustworthy data. See [this document](data/DATA_SOURCES.md) for an explanation of the data sources underlying the application.

### Facility Location Problems

We can consider this problem as belonging to a class of facility location problems, where the goal is to choose the optimal placements of facilities to minimize a certain objective function (for example, transportation costs). See [this paper](http://www.sciencedirect.com/science/article/pii/S0305054816301253?via%3Dihub) for an overview of facility location problems in the field of healthcare.

Specifically, consider the _Metric k-center Problem_: Given _n_ cities with specified locations, build warehouses in _k_ different cities to minimize the maximum distance of a city to the nearest warehouse.

This problem comes with its own built-in validation metric, _viz._ the largest distance between a city and the nearest city with a warehouse.

Intuitively, we want every input population point (city in the analogy) in a service area to have at least one selected representative population point (warehouse) nearby. If after applying the algorithm even a single input population point does not have a selected point nearby, the maximum distance between the input and the selected points will still be high. This facet of the problem means that solutions must explicitly prioritize remote points, an appropriate feature given the ultimate use of the selected points in measuring network adequacy.

On the other hand, if the maximum distance between the input and selected points is some small value _d_, we have guaranteed that distances that replace the input point with the selected one will have an error bounded by _d_.
Taken together, these features entail that solutions to this more specific problem make for reasonable solutions to the broader one.

### Farthest-First Traversal Algorithm
The metric k-center problem is NP-hard. The literature contains several polynomial-time approximations to make the computation more tractable. For an analysis of the problem's complexity and an overview of optimal algorithms, see [[1]](https://ac.els-cdn.com/0304397585902245/1-s2.0-0304397585902245-main.pdf?_tid=6c644f16-a72f-11e7-b1e9-00000aacb361&acdnat=1506920958_ef265d284be26c85f897df3ebcee3d74), [[2]](https://pdfs.semanticscholar.org/f276/c00bac7594107c291947f560b7b48b1439d7.pdf), and [[3]](http://theory.stanford.edu/~tomas/clustering.ps).

One straightforward such approximation employs _farthest-first traversal_. At each stage, this algorithm finds the point that is farthest away from the currently selected points and chooses it as the next point. Essentially the algorithm looks to see what point is the most problematic (in terms of the objective function) and eliminates the problem: By selecting the farthest point next, its distance from the selected points drops to 0. The algorithm greedily puts out the biggest fire at each successive step.

This solution has an approximation factor of 2, ensuring that the objective function is at worst two times the smallest value that could be achieved considering any possible subset of size k from the original input. The algorithm has a runtime of _O(kn)_.

A further advantage of this algorithm is the sequential selection of points: once some number _K_ of representative points are chosen, each initial segment of size _k_ for _k < K_ can be taken as a selection of _k_ representative population points. This means that a single calculation with a high value of _K_ is sufficient to provide users with sets of representative population points of all smaller sizes.

For an illustration of the algorithm applied to the application's underlying data, see [this IPython notebook](./data_analysis/notebooks/Farthest%20First%20Traversal.ipynb).

### Next Steps

__Defining Alternative Halting Rules__. The implementation of the algorithm has a single pre-defined halting rule: stop once _k_ points have been selected. For dense regions, there will be diminishing returns to selecting more points. Knowing when to stop early can save computation time, especially for downstream applications using the results of the algorithm. These rules could take the following forms:

-  Based on the value of the objective function: Stop once all input points are within a fixed distance of the nearest selected point.
- Based on the delta of the objective function: Stop once the objective function has reached a plateau and is unlikely to decrease more as new points are chosen.

__Account for Population Density__. The current algorithm doesn't take population information into account when selected the next point, but such information is present in the source data. A weighted version of the algorithm could more accurately reflect where people live _on average_. Care must be taken to ensure that the modified algorithm does not systematically ignore points in regions of low population density.

__Explore Alternative Methods for Selecting the First Point__. At present, the first point is chosen randomly. While this may sound less-than-ideal, the typical use case involves generating sufficiently many points for the initial conditions not to matter. However, for use cases that depend on using small values of _k_, choosing the initial point in a more deliberate manner could have a substantial impact.

__Apply Methods from Supervised Learning__. We can treat the problem of representative population points as a supervised problem and use standard cross-validation techniques to evaluate the algorithm's expected performance on unseen data. This would help to account for the uncertainty inherent in the source data.