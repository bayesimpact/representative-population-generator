# Network-Adequacy
For the Network Adequacy project with CA DMHC.


# Development

Frontend is built on react.js and backend is built on Flask microservice. To start the development environment run

    docker-compose up -d webapp

This spins up a webserver for frontend (node), and a mircoservice for the backend. Open a browser and point to localhost:3000 to see the frontend react app.

It also loads sample data into MongoDB. Use your favorite client (e.g. Robot 3T) to browse the db on port 27017 with no user or password.

The backend API has 3 endpoints:
	
	- http://localhost/area/<zipcode>/<county>
	This endpoint will received a zipcode/county info and return the associated data as json.
	
	- http://localhost/areas/	
	This endpoint will received a json-formatted list of zipcode/county info and return the associated data as json.
	
	- http://localhost/csv/
	This endpoint will received a csv with county,zip info and return the associated data as json.