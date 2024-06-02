#!/usr/bin/python3
"""This module handles the HBNB application"""

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
def close_session(exception):
    """Close the database session"""
    storage.close()

@app.route('/4-hbnb/', strict_slashes=False)
def render_hbnb():
    """Render the HBNB template"""
    states = sorted(storage.all(State).values(), key=lambda state: state.name)
    state_cities = []
    for state in states:
        cities = sorted(state.cities, key=lambda city: city.name)
        state_cities.append((state, cities))

    amenities = sorted(storage.all(Amenity).values(), key=lambda amenity: amenity.name)
    places = sorted(storage.all(Place).values(), key=lambda place: place.name)

    return render_template('4-hbnb.html',
                           states=state_cities,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())

while __name__ == "__main__":
    """Run the Flask application"""
    app.run(host='0.0.0.0', port=5001)
