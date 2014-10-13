// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];

function initialize() {
  var waterloo = new google.maps.LatLng(43.4667, -80.5167);
  var p1 = new google.maps.LatLng(43.471988, -80.5365704);
  var p2 = new google.maps.LatLng(43.4725940388016, -80.5382770299911);
  var p3 = new google.maps.LatLng(43.477593, -80.5250886);
  var p4 = new google.maps.LatLng(43.471988, -80.5365704);
  var mapOptions = {
    zoom: 13,
    center: waterloo,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    panControl: false,
    zoomControl: false,
    scaleControl: false
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // This event listener will call addMarker() when the map is clicked.
  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng);
  });

  // Adds a marker at the center of the map.
  addMarker(waterloo);
  addMarker(p1);
  addMarker(p2);
  addMarker(p3);
  addMarker(p4);
}

// Add a marker to the map and push to the array.
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);