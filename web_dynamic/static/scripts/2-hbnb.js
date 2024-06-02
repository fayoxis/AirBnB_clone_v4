// This script should be executed only when the DOM is loaded
$(function () {
  const amenityDict = {};
  $('input[type=checkbox]').click(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenityDict).join(', '));
  });
});

// Request the url http://0.0.0.0:5001/api/v1/status/:
// If the status is “OK”, add the class available to the DIV#api_status
// Otherwise, remove the class available to the DIV#api_status
$(function() {
  url = 'http://0.0.0.0:5001/api/v1/status/';
  $.getJSON(url, function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    };
    if (data.status !== 'OK') {
      if ($('div#api_status').hasClass('available')) {
        $('div#api_status').removeClass('available');
      }
    };
  });
});
