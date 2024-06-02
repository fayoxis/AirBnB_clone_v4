window.addEventListener('load', () => {
  const api_status = document.getElementById('api_status');
  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};
  
  fetch('http://0.0.0.0:5001/api/v1/status')
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        api_status.classList.add('available');
      } else {
        api_status.classList.remove('available');
      }
    });

 
  const amenityCheckboxes = document.querySelectorAll('.amenities input[type=checkbox]');
  amenityCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      const id = checkbox.getAttribute('data-id');
      const name = checkbox.getAttribute('data-name');
      if (checkbox.checked) {
        amenityIds[id] = name;
      } else {
        delete amenityIds[id];
      }
      const amenityNames = Object.values(amenityIds);
      const amenityHeading = document.querySelector('div.amenities h4');
      amenityHeading.textContent = amenityNames.length ? amenityNames.join(', ') : '\u00A0';
    });
  });


  const filtersButton = document.querySelector('.filters button');
  filtersButton.addEventListener('click', () => {
    fetch('http://0.0.0.0:5001/api/v1/places_search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds)
      })
    })
    .then(response => response.json())
    .then(data => {
      const placesSection = document.querySelector('section.places');
      placesSection.innerHTML = '<h1>Places</h1>';
      data.forEach(place => {
        const articleElement = document.createElement('article');
        articleElement.innerHTML = `
          <div class="title">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">
              <i class="fa fa-users fa-3x" aria-hidden="true"></i>
              <br />
              ${place.max_guest} Guests
            </div>
            <div class="number_rooms">
              <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_rooms} Bedrooms
            </div>
            <div class="number_bathrooms">
              <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_bathrooms} Bathroom
            </div>
          </div>
          <div class="description">${place.description}</div>
          <div class="reviews">
            <h2>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h2>
            <ul></ul>
          </div>
        `;
        placesSection.appendChild(articleElement);
      });

      
      const reviewSpans = document.querySelectorAll('.reviewSpan');
      reviewSpans.forEach(span => {
        span.addEventListener('click', () => {
          const placeId = span.getAttribute('data-id');
          fetch(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`)
            .then(response => response.json())
            .then(data => {
              const reviewList = span.nextElementSibling;
              reviewList.innerHTML = '';
              if (span.textContent === 'show') {
                data.forEach(review => {
                  const listItem = document.createElement('li');
                  listItem.textContent = review.text;
                  reviewList.appendChild(listItem);
                });
                span.textContent = 'hide';
              } else {
                span.textContent = 'show';
              }
            });
        });
      });
    });
  });


  const stateCheckboxes = document.querySelectorAll('.stateCheckBox');
  stateCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      const id = checkbox.getAttribute('data-id');
      const name = checkbox.getAttribute('data-name');
      if (checkbox.checked) {
        stateIds[id] = name;
      } else {
        delete stateIds[id];
      }
      updateLocationsHeading();
    });
  });

  const cityCheckboxes = document.querySelectorAll('.cityCheckBox');
  cityCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      const id = checkbox.getAttribute('data-id');
      const name = checkbox.getAttribute('data-name');
      if (checkbox.checked) {
        cityIds[id] = name;
      } else {
        delete cityIds[id];
      }
      updateLocationsHeading();
    });
  });

  function updateLocationsHeading() {
    const locationNames = [...Object.values(stateIds), ...Object.values(cityIds)];
    const locationsHeading = document.querySelector('.locations h4');
    locationsHeading.textContent = locationNames.length ? locationNames.join(', ') : '\u00A0';
  }
});
