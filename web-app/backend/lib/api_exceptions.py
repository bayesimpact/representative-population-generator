"""Exception classes for backend."""
# TODO Remove this since it is not in use.


class UnavailableZipCounty(Exception):
    """Exception class for unavailable zip/county request."""

    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        """Initialize an exception with a message and a status_code."""
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Convert the payload to a dictionary."""
        payload = dict(self.payload or ())
        payload['message'] = self.message
        return payload
