# Representative Population Generation
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Overview

The Representative Population Generator web application was built by [Bayes Impact](https://www.bayesimpact.org) in partnership with California [Department of Managed Health Care](http://www.dmhc.ca.gov/) (DMHC). The application generates representative population points for the State of California based on United States Postal Service (USPS) mailing addresses and Census data.

There are many potential applications for this data, but the primary intent for this project is to assist health and policy analysts at the DMHC in measuring the network adequacy of health plans. Network adequacy is a measure that ensures health plans have enough physicians, hospitals, clinics, and other providers to allow plan enrollees access to the right doctor within a reasonable distance from home or work. The representative population points generated by the application will be used to calculate the distance and travel time for enrollees to access health care services.  The specific time and distance standards in the state of California are dictated by the [Knox-Keene Act](http://wpso.dmhc.ca.gov/regulations/docs/2017kkaregs.pdf).

This application is a critical component in helping the DMHC protect consumers’ health care rights and monitor the compliance of health plans representing over 25 million people in California.

## Table of Contents
<!-- Table of contents generated generated by http://tableofcontent.eu -->
- [About the Application](#about-the-application)
    - [Open Source](#open-source)
- [More Information](#more-information)
- [Development](#development)
    - [Test and Lint](#test-and-lint)
    - [Datasets](#datasets)
    - [Exceptions](#exceptions)
- [License](#license)

## About the Application

[[Link to App](http://network-adequacy-lb-950847297.us-west-1.elb.amazonaws.com/)]

The web app generates and displays representative points for where people live and work in a given service area. The points generated by the application are sampled from existing addresses registered by the USPS (more on data sources here). Service areas are defined as ZIP Code/County pairs.

Users can specify multiple service areas by either uploading a CSV of valid counties, ZIP Codes or both, as well as by using the provided dropdown menus. Users can also specify the number of points they wish to generate for each service area. Data points can be viewed either as a table or visualized on a map. Users can also download the data as a CSV, to be used for subsequent analysis, such as calculating time and distance from health providers.

### Open Source

Our reasons for open-sourcing the network adequacy algorithm and web app are two-fold: (1) to foster transparency in government software and analyses used for regulation, and (2) to be a useful model for other states and localities who wish to implement a tool of this nature.


## More Information

1. [Model Selection and Validation](models/MODEL_SELECTION.md)

2. [Data Sources](data/DATA_SOURCES.md)

3. [Deployment](deploy/README.md)


## Development

Frontend is built on react.js and backend is built on Flask microservice. To start the development environment run

    docker-compose up -d webapp

This spins up a webserver for frontend (node), and a mircoservice for the backend on port 8080. Open a browser and point to `localhost` (port 80) to see the frontend react app.

It also loads sample data into MongoDB. Use your favorite client (e.g. Robot 3T) to browse the db on port 27017 with no user or password.

The backend API has the following endpoints and methods:

| Endpoint                  |      Method  |  Options |
|-------------------------- |:------------:|:------|
| /available-service-areas|  GET         |  |
| /areas?    |  GET         | params: zipcounties=[{"county": "sanFrancisco", "zip": "94102"},{"county": "sanFrancisco", "zip": "94103"}] |
| /areas     |  POST            | body: zipcounties=[{"county": "sanFrancisco", "zip": "94102"},{"county": "sanFrancisco", "zip": "94103"}] |
| /areas     |  POST            | body: zipcounty_file=<zipcounty_csv_file> |


The return object of `/available-service-areas` endpoint is the following:

    {
      "result": [
        {
            "Alameda": {
                "zips": ["94501", "94502", ...]
            },
            "Marin": {
                "zips": ["91501", "97332", ...]
            },
            ...
        }
      ]
    }


For `/areas` endpoint, input (for `GET` or `POST`) must have at least one of the following columns (regardless of whitespaces or case):

- `zip` or `zipcode`
- `county` or `countyname`

And the return object is in the following format:

    {
        "result": [
            {
                "areaInfo": {
                    "countyName": "San Francisco",
                    "zipCode": "94105"
                },
                "availabilityStatus": {
                    "isServiceAreaAvailable": true,
                    "message": "Service area available."
                },
                "boundary": {
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -117.23250138140729,
                                    33.19171791814623
                                ],
                                [
                                    -117.23260861869265,
                                    33.19171791814623
                                ],
                                [
                                    -117.23250138140729,
                                    33.19180808215501
                                ],
                                [
                                    -117.23250138140729,
                                    33.19171791814623
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                },
                "points": [point_1, ..., point_200]
            },
            {
                "areaInfo": {
                    "countyName": "San Diego",
                    "zipCode": "94130"
                },
                "availabilityStatus": {
                    "isServiceAreaAvailable": false,
                    "message": "Service area unavailable."
                },
                "boundary": null,
                "points": []
            },
            ....
        ]
    }



#### Test and Lint
To run webapp tests locally simply run

    make webapp-test

To run the linter

    make webapp-lint


#### Datasets
The backend Docker automatically downloads all necessary datasets and populate the database. If you need to download seed files, you can prepare sample datasets for development by running in `data` directory:

     make all-sample-datasets

Similarly, full datasets for production can be built by running in `data` directory:

    make all-full-datasets

#### Exceptions
If the input file is not parsable by the backend, it throws a `HTTP 400` error with the following message:

    Invalid CSV file. Was not able to parse.

If the payload key is invalid (e.g. `zipcountyfile` instead of `zipcounty_file`), it throws a `HTTP 400` error with the following message:

    Payload key is invalid.

Each point is a geojson object of type Point:

    {
        "geometry": {
            "coordinates": [
                -122.39987717199995,
                37.78892673000007
            ],
            "type": "Point"
        },
        "properties": {
            "county": "sanFrancisco",
            "residents": 1870,
            "zip": "94105"
        },
        "type": "Feature"
    }

## License

The Representative Population Generator web application is released under the [Apache License 2.](https://opensource.org/licenses/Apache-2.0)[0.](https://opensource.org/licenses/Apache-2.0)
