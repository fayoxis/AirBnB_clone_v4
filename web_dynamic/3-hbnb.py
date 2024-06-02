#!/usr/bin/python3
"""This is the 3-hbnb module"""

from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid

app = Flask(__name__)

@app.teardown_appcontext
def teardown(exception):
    """Close the database connection"""
    storage.close()

@app.route('/3-hbnb/', strict_slashes=False)
def hbnb_route():
    """Render the HBNB template"""
    states = sorted(storage.all(State).values(), key=lambda state: state.name)
    state_city_pairs = [[state, sorted(state.cities, key=lambda city: city.name)] for state in states]

    amenities = sorted(storage.all(Amenity).values(), key=lambda amenity: amenity.name)
    places = sorted(storage.all(Place).values(), key=lambda place: place.name)

    return render_template('3-hbnb.html',
                           states=state_city_pairs,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())

while __name__ == "__main__":
    """Start the Flask application"""
    app.run(host='0.0.0.0', port=5001)
