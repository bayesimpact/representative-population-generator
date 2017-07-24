FROM jupyter/scipy-notebook:latest

EXPOSE 8888
ENV NODE_ENV development

WORKDIR /home/jovyan/work
RUN cd /home/jovyan/work

COPY requirements.txt .
RUN pip install -r requirements.txt
