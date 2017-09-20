FROM mongo:latest

RUN mkdir /data/localdb && chown mongodb /data/localdb
RUN apt-get -qq update
RUN apt-get -qqy install curl && apt-get install -qqy psmisc
COPY sample_eddm_data.json ./eddm_data.json


COPY populate.sh ./
RUN gosu mongodb /bin/bash ./populate.sh --dbpath=/data/localdb

CMD ["mongod",  "--dbpath=/data/localdb"]
