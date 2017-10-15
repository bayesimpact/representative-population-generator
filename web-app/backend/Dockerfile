FROM python:3.6
 
# Install uwsgi Python web server
RUN pip install uwsgi

# Install app requirements
COPY requirements.txt ./requirements.txt
RUN pip install -qr ./requirements.txt
 
# Create app directory
RUN mkdir /app
 
# Set the default directory for our environment
ENV HOME /app
WORKDIR /app
 
# Expose port 8080 for uwsgi
EXPOSE 8080

COPY ./config/entrypoint_bis.sh /entrypoint_bis.sh

RUN chmod +x /entrypoint_bis.sh

ENTRYPOINT ["/entrypoint_bis.sh"]

CMD ["uwsgi", "--ini", "uwsgi.ini"]
