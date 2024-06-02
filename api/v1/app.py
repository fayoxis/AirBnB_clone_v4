#!/usr/bin/python3
"""this Contains a Flask web application API.
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from models import storage
from api.v1.views import app_views


app = Flask(__name__)
"""This is the  API app"""
app.url_map.strict_slashes = False
app.register_blueprint(app_views)
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

app_host = os.getenv('HBNB_API_HOST', '0.0.0.0')
app_port = int(os.getenv('HBNB_API_PORT', '5000'))


@app.teardown_appcontext
def teardown_flask(exception):
    """ This is a Flask app/request context end event listener."""
    # print(exception)
    storage.close()


@app.errorhandler(404)
def error_404(error):
    """ this Handles the 404 HTTP error code."""
    return jsonify(error='Not found'), 404


@app.errorhandler(400)
def error_400(error):
    """ this Handles the 400 HTTP error code."""
    msg = 'Bad request'
    while isinstance(error, Exception) and hasattr(error, 'description'):
        msg = error.description
    return jsonify(error=msg), 400


if __name__ == '__main__':
    app.run(host=app_host, port=app_port, threaded=True)
