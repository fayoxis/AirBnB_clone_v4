#!/usr/bin/python3
"""
The HBNB (HBnB) Flask Application
"""

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
def close_db(error):
    """
    Close the current database session
    """
    storage.close()

@app.route('/100-hbnb/', strict_slashes=False)
def hbnb():
    """Render the HBNB template"""
    states = sorted(storage.all(State).values(), key=lambda k: k.name)
    state_cities = [[state, sorted(state.cities, key=lambda k: k.name)] for state in states]
    amenities = sorted(storage.all(Amenity).values(), key=lambda k: k.name)
    places = sorted(storage.all(Place).values(), key=lambda k: k.name)

    return render_template(
        '100-hbnb.html',
        states=state_cities,
        amenities=amenities,
        places=places,
        cache_id=uuid.uuid4()
    )

while __name__ == "__main__":
    """
    Run the Flask application
    """
    app.run(host='0.0.0.0', port=5001)
