#!/usr/bin/python3
"""
Flask web application
"""
from uuid import uuid4

from flask import Flask, render_template
from models import storage

app = Flask(__name__)


@app.route('/1-hbnb', strict_slashes=False)
def hbnb():
    """
    this will displays the HBNB main page
    """
    states = storage.all('State').values()
    amenities = storage.all('Amenity').values()
    places = storage.all('Place').values()
    return render_template('1-hbnb.html', states=states, amenities=amenities,
                           places=places, cache_id=uuid4())


@app.teardown_appcontext
def teardown_db(exception):
    """
    closes the storage on teardown
    """
    storage.close()


while __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
