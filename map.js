// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];
var markers_map = {};

function initialize() {
  var waterloo = new google.maps.LatLng(43.4667, -80.5167);
/*  var p1 = new google.maps.LatLng(43.471988, -80.5365704);
  var p2 = new google.maps.LatLng(43.4725940388016, -80.5382770299911);
  var p3 = new google.maps.LatLng(43.477593, -80.5250886);
  var p4 = new google.maps.LatLng(43.471988, -80.5365704);*/
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
/*  google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng);
  });*/

  // Adds a marker at the center of the map.
  // addMarker(waterloo);
  fillMap(); 
}

// Add a marker to the map and push to the array.
function addMarker(location, row_id) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  markers_map[row_id] = marker;
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

//Fill map with initial markers
function fillMap() {
    for (var i = 0; i < data.length; i++) {
        var point = new google.maps.LatLng(data[i]["latitude"], data[i]["longitude"]);
        addMarker(point, data[i][""]);
    }
}

//Handling updates
function handleUpdate() {
    for (var i = 0; i < data.length; i++) {
        if ($.inArray(data[i],validMarkers) != -1) {
          if ($.inArray(markers_map[data[i][""]], markers) == -1) {
            markers_map[data[i][""]].setMap(map);
            markers.push(markers_map[data[i][""]]);
          }
        } else {
          if ($.inArray(markers_map[data[i][""]], markers) != -1) {
            markers_map[data[i][""]].setMap(null);
            markers.splice($.inArray(markers_map[data[i][""]], markers), 1);
          }   
        }
    }
}

google.maps.event.addDomListener(window, 'load', initialize);