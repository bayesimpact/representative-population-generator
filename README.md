# network-adequacy
For the Network Adequacy project with CA DMHC.


# Development

Frontend is built on react.js and backend is built on Flask microservice. To start the development environment run

    docker-compose up -d mongo-seed
    docker-compose up -d backend
    docker-compose up -d frontend

This spins up a webserver for frontend (node), and a mircoservice for the backend. Open a browser and point to localhost:3000 to see the frontend react app.

The backend API can be accessed via:

    http://localhost/get/area/<zipcode>/<county>
