"""All backend exceptions are defined here."""


class InvalidPayload(Exception):
    """Exception class for invalid CSV input file."""

    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        """Initialize an exception."""
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Convert the exception to dict."""
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv
