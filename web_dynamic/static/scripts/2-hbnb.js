// This script updates the amenity list and the API status
$(function () {
  const amenityDict = {};
  $('input[type=checkbox]').click(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      amenityDict[amenityId] = amenityName;
    } else {
      delete amenityDict[amenityId];
    }
    const amenityList = Object.values(amenityDict).join(', ');
    $('.amenities h4').text(amenityList);
  });
});

// Request the url http://0.0.0.0:5001/api/v1/status/
$(function() {
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.getJSON(url, function (data) {
    const $apiStatus = $('div#api_status');
    if (data.status === 'OK') {
      $apiStatus.addClass('available');
    } else {
      $apiStatus.removeClass('available');
    }
  });
});
