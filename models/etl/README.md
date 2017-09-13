## Updating Data

### Overview

The ETL consists of four main stages:

1. Extraction of the data from EDDM for each ZIP code
2. Transformation of the data into a form usable by the algorithm and assignment of points to counties
3. Predicting / selecting the representative population points
4. Merging the data for all service areas into a single file

Each stage builds on the previous one and runs only on new files. For example, this means that if a single new ZIP code is detected in the output directory of the `extract` step, re-running the `transform` step will transform only that single file. This is designed for robustness: if the ETL process is interrupted, it can easily be restarted without losing progress.

### Prerequisites

1. A delimited file listing the ZIP codes to extract from EDDM
2. A GeoJSON file with county polygons
3. A GeoJSON file with census tract, block group, or block information

[TIGER shapefiles](https://www.census.gov/geo/maps-data/data/tiger-line.html) are a natural source for the data in items 2 and 3. Both should be restricted to the region of interest (e.g., the state of California) beforehand.

### Running

TBD

### ETL Failures
Each stage of the ETL logs failures in the `data/etl/artifacts/` directory along with the corresponding error messages.

