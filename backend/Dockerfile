FROM python:3.6
COPY requirements.txt /var/local/
COPY app.py /var/local/
RUN pip install -qr /var/local/requirements.txt
WORKDIR /var/local
EXPOSE 5000
CMD ["python", "app.py"]
