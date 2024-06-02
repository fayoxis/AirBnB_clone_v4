// This script executes when the DOM is fully loaded
$(document).ready(function() {
  // Create an object to store the selected amenities
  const amenityDict = {};

  // Add an event listener for checkbox clicks
  $('input[type=checkbox]').click(function() {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    // Update the amenityDict object based on the checkbox state
    if ($(this).is(':checked')) {
      amenityDict[amenityId] = amenityName;
    } else {
      delete amenityDict[amenityId];
    }

    // Update the amenities list text
    const amenityNames = Object.values(amenityDict);
    const amenityList = amenityNames.join(', ');
    $('.amenities h4').text(amenityList);
  });
});
