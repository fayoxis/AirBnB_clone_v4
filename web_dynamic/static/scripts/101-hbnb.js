const $ = window.jQuery;
const apiURL = 'http://localhost:5001/api/v1';

$(document).ready(() => {
  const amenities = {};
  const states = {};
  const cities = {};

  handleCheckboxes('.amen-checkbox', amenities, updateAmenities);
  handleCheckboxes('.state-checkbox', states, updateLocations);
  handleCheckboxes('.city-checkbox', cities, updateLocations);

  $('button').click(() => {
    const data = {
      amenities: Object.keys(amenities),
      states: Object.keys(states),
      cities: Object.keys(cities)
    };
    $('.places').empty();
    searchPlaces(data);
  });

  checkAPIStatus();
  loadPlaces();
});

function handleCheckboxes(selector, storage, updateFunc) {
  $(`input[type="checkbox"]${selector}`).click(function () {
    $(this).each(function () {
      const id = $(this).data('id');
      const name = $(this).data('name');
      this.checked ? (storage[id] = name) : delete storage[id];
    });
    updateFunc();
  });
}

function updateAmenities() {
  $('.amenities h4').html(Object.values(amenities).join(', ') || '&nbsp;');
}

function updateLocations() {
  const locations = Object.values(states).concat(Object.values(cities));
  $('.locations h4').html(locations.join(', ') || '&nbsp;');
}

function searchPlaces(data) {
  $.ajax({
    method: 'POST',
    url: `${apiURL}/places_search/`,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8'
  })
    .done(findPlaces)
    .fail(() => $('.places').hide());
}

function checkAPIStatus() {
  $.get(`${apiURL}/status/`)
    .done(data => {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      }
    })
    .fail(() => $('#api_status').removeClass('available'));
}

async function getReviews(placeId) {
  const reviews = await $.get(`${apiURL}/places/${placeId}/reviews`);
  return Promise.all(
    reviews.map(async review => {
      const user = await $.get(`${apiURL}/users/${review.user_id}`);
      const formatDate = new Date(review.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return `
        <li>
          <h3>From ${user.first_name} ${user.last_name} on ${formatDate}</h3>
          <p>${review.text}</p>
        </li>
      `;
    })
  ).then(reviewsHTML => reviewsHTML.join(''));
}

async function findPlaces(places) {
  for (const place of places) {
    const amenities = await $.get(`${apiURL}/places/${place.id}/amenities`);
    const reviews = await getReviews(place.id);
    const placeTemplate = `
      <article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
        </div>
        <div class="description">${place.description}</div>
        <div class="amenities">
          <h2>Amenities</h2>
          <hr>
          <ul>${amenities.map(amenity => `<li class="${amenity.name.toLowerCase().replace(' ', '_')}">${amenity.name}</li>`).join('')}</ul>
        </div>
        <div class="reviews">
          <h2>${reviews.length} Review${reviews.length !== 1 ? 's' : ''}</h2>
          <hr>
          <ul>${reviews}</ul>
        </div>
      </article>
    `;
    $('.places').append(placeTemplate);
  }
}

function loadPlaces() {
  $.ajax({
    method: 'POST',
    url: `${apiURL}/places_search/`,
    data: '{}',
    contentType: 'application/json; charset=utf-8'
  })
    .done(findPlaces)
    .fail(() => $('.places').hide());
}
