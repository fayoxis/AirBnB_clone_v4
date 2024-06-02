#!/usr/bin/env python3
"""Flask Web Application for HBNB"""

from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
import os
import uuid
from flask import Flask, render_template

app = Flask(__name__)

@app.teardown_appcontext
def close_db(error):
    """Close the current SQLAlchemy Session"""
    storage.close()

@app.route('/2-hbnb', strict_slashes=False)
def hbnb():
    """Render the HBNB template"""
    states = sorted(storage.all(State).values(), key=lambda state: state.name)
    state_cities = [[state, sorted(state.cities, key=lambda city: city.name)] for state in states]

    amenities = sorted(storage.all(Amenity).values(), key=lambda amenity: amenity.name)
    places = sorted(storage.all(Place).values(), key=lambda place: place.name)

    return render_template(
        '2-hbnb.html',
        state_cities=state_cities,
        amenities=amenities,
        places=places,
        cache_id=uuid.uuid4()
    )

while __name__ == "__main__":
    """Start the Flask app"""
    app.run(host='0.0.0.0', port=5000)
