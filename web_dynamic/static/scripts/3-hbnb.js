const $ = window.jQuery;

$(document).ready(() => {
  const amenities = {};

  $('body').on('click', 'input:checkbox', function() {
    const $this = $(this);
    const id = $this.data('id');
    const name = $this.data('name');

    if (this.checked) {
      amenities[id] = name;
    } else {
      delete amenities[id];
    }

    const amenitiesValues = Object.values(amenities);
    $('.amenities h4').html(amenitiesValues.join(', ') || '&nbsp;');
  });
});

$.get('http://localhost:5001/api/v1/status/')
  .done(data => {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    }
  })
  .fail(() => {
    $('#api_status').removeClass('available');
  });

$.ajax({
  method: 'POST',
  url: 'http://localhost:5001/api/v1/places_search/',
  data: '{}',
  contentType: 'application/json; charset=utf-8'
})
  .done(data => {
    data.forEach(place => {
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
          <div class="description">
            ${place.description}
          </div>
        </article>
      `;
      $('.places').append(placeTemplate);
    });
  })
  .fail(() => {
    $('.places').hide();
  });
