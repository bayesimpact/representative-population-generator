FROM esridocker/arcgis-api-python-notebook:latest

EXPOSE 8888
ENV NODE_ENV development

USER root

# Install libraries used by geopandas
RUN sudo apt-get update
RUN sudo apt-get install libgeos-dev -y

USER jovyan

WORKDIR /home/jovyan/work
RUN cd /home/jovyan/work

COPY requirements.txt .
RUN pip install -r requirements.txt
