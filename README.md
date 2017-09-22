# Network-Adequacy
For the Network Adequacy project with CA DMHC.


# Development

Frontend is built on react.js and backend is built on Flask microservice. To start the development environment run

    docker-compose up -d webapp

This spins up a webserver for frontend (node), and a mircoservice for the backend on port 8080. Open a browser and point to `localhost` (port 80) to see the frontend react app.

It also loads sample data into MongoDB. Use your favorite client (e.g. Robot 3T) to browse the db on port 27017 with no user or password.

The backend API has the following endpoints and methods:

| Endpoint   |      Method  |  Options |
|----------- |:------------:|:------|
| /areas? 	 |  GET	 		| params: zipcounties=[{"county": "sanFrancisco", "zip": "94102"},{"county": "sanFrancisco", "zip": "94103"}] |
| /areas 	 |  POST	 		| body: zipcounties=[{"county": "sanFrancisco", "zip": "94102"},{"county": "sanFrancisco", "zip": "94103"}] |
| /areas 	 |  POST	 		| body: zipcounty_file=<zipcounty_csv_file> |

Input must have at least one of the following columns (regardless of whitespaces or case):

- `zip` or `zipcode`
- `county` or `countyname`

Return object is in the following format:

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
	            "points": [point_1, ..., point_200]
            },
            {
                "areaInfo": {
                    "countyName": "San Francisco",
                    "zipCode": "94107"
                },
                "availabilityStatus": {
                    "isServiceAreaAvailable": true,
                    "message": "Service area available."
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
	            "points": []
	        },
	        ....
	    ]
	}

## Exceptions
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

## Test and Lint
To run webapp tests locally simply run

    make webapp-test

To run the linter

    make webapp-lint
