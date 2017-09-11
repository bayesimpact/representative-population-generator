FROM mongo

COPY sample_data.json /sample_data.json
CMD mongoimport --host mongo --db representativepoints --collection pointA --type json --file /sample_data.json --jsonArray --drop
