window.addEventListener('load', function () {
  const checkApiStatus = () => {
    $.ajax('http://0.0.0.0:5001/api/v1/status')
      .done((data) => {
        if (data.status === 'OK') {
          $('#api_status').addClass('available');
        } else {
          $('#api_status').removeClass('available');
        }
      });
  };

  const handleAmenities = () => {
    const amenityIds = {};
    $('.amenities input[type=checkbox]').click(function () {
      const amenityId = $(this).attr('data-id');
      const amenityName = $(this).attr('data-name');
      if ($(this).prop('checked')) {
        amenityIds[amenityId] = amenityName;
      } else {
        delete amenityIds[amenityId];
      }
      const amenityNames = Object.values(amenityIds);
      $('div.amenities h4').text(amenityNames.join(', ') || '&nbsp;');
    });
    return amenityIds;
  };

  const handleLocations = () => {
    const stateIds = {};
    const cityIds = {};
    $('.stateCheckBox').click(function () {
      const stateId = $(this).attr('data-id');
      const stateName = $(this).attr('data-name');
      if ($(this).prop('checked')) {
        stateIds[stateId] = stateName;
      } else {
        delete stateIds[stateId];
      }
      updateLocationNames(stateIds, cityIds);
    });
    $('.cityCheckBox').click(function () {
      const cityId = $(this).attr('data-id');
      const cityName = $(this).attr('data-name');
      if ($(this).prop('checked')) {
        cityIds[cityId] = cityName;
      } else {
        delete cityIds[cityId];
      }
      updateLocationNames(stateIds, cityIds);
    });
    return { stateIds, cityIds };
  };

  const updateLocationNames = (stateIds, cityIds) => {
    const locationNames = [...Object.values(stateIds), ...Object.values(cityIds)];
    $('.locations h4').text(locationNames.join(', ') || '&nbsp;');
  };

  const handlePlacesSearch = (amenityIds, stateIds, cityIds) => {
    $('.filters button').click(function () {
      $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        contentType: 'application/json',
        data: JSON.stringify({
          amenities: Object.keys(amenityIds),
          states: Object.keys(stateIds),
          cities: Object.keys(cityIds)
        })
      }).done((data) => {
        $('section.places').empty();
        $('section.places').append('<h1>Places</h1>');
        data.forEach((place) => {
          const template = `<article>
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
          </article>`;
          $('section.places').append(template);
        });
      });
    });
  };

  checkApiStatus();
  const amenityIds = handleAmenities();
  const { stateIds, cityIds } = handleLocations();
  handlePlacesSearch(amenityIds, stateIds, cityIds);
});
