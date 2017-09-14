# Network-Adequacy
For the Network Adequacy project with CA DMHC.


# Development

Frontend is built on react.js and backend is built on Flask microservice. To start the development environment run

    docker-compose up -d webapp

This spins up a webserver for frontend (node), and a mircoservice for the backend. Open a browser and point to localhost:3000 to see the frontend react app.

It also loads sample data into MongoDB. Use your favorite client (e.g. Robot 3T) to browse the db on port 27017 with no user or password.

The backend API has the following endpoints and methods:

| Endpoint   |      Method  |  Options |
|----------- |:------------:|:------|
| /area?	 |  GET	 		| params: zip=94102,county=sanFrancisco |
| /areas? 	 |  GET	 		| params: zipcounties=[{"county": "sanFrancisco", "zip": "94102"},{"county": "sanFrancisco", "zip": "94103"}] |
| /areas 	 |  POST	 		| body: zipcounties=[{"county": "sanFrancisco", "zip": "94102"},{"county": "sanFrancisco", "zip": "94103"}] |
| /areas 	 |  POST	 		| body: zipcounty_file=<zipcounty_csv_file> |

Return object is in the following format:

	{
	    "result": [
	        {
	            "area_info": {
	                "county": "sanFrancisco",
	                "zip": "94105"
	            },
	            "points": [point_1, ..., point_200]
	        },
	        {
	            "area_info": {
	                "county": "sanFrancisco",
	                "zip": "94107"
	            },
	            "points": [point_1, ..., point_200]
	        },
	        ....
	    ]
	}

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

