csv_text = ""
$.ajax({
        url: 'waterlooAttributes.csv',
        type: 'get',
        async: false,
        success: function(html) {
                csv_text = html;
        }
});

var data = $.csv.toObjects(csv_text);
// console.log(data[0])

var constraints = {};

var validMarkers = data.slice(0);
console.log("PROCESSOR validMarkers" + validMarkers[0]);

var LAT = 43.4667;
var LON = 80.5167;
var R = 3961;

function handleConstraintsChange(new_constraints) {

	var min_reg = /^min/;
	var max_reg = /^max/;

	for (var name in new_constraints) {
		if (constraints[name] === undefined){
			constraints[name] = new_constraints[name];
			filter(validMarkers);
			return
		}

		if (min_reg.test(name)) {
			if (new_constraints[name] >= constraints[name]) {
				constraints[name] = new_constraints[name];
				continue
			}
			else {
				constraints[name] = new_constraints[name];
				filter(data);
				return
			}
		} else if (max_reg.test(name)) {
			if (new_constraints[name] <= constraints[name]) {
				constraints[name] = new_constraints[name];
				continue
			}
			else {
				constraints[name] = new_constraints[name];
				filter(data);
				return
			}
		} else {
			constraints[name] = new_constraints[name];
			filter(data);
			return
		}
	}

	filter(validMarkers);

}

function filter(start) {
	validMarkers = [];

	for (index in start) {
		if (check(start[index])) {
			validMarkers.push(start[index])
		}
	}
	//TODO send validMarkers to google maps
	handleUpdate();
}

function check(item) {
	var valid = true;

	if (constraints["min_dist"] !== undefined) {
		lon2 = parseFloat(item["longitude"]);
		lat2 = parseFloat(item["latitude"]);
		var dlon = lon2 - LON;
		var dlat = lat2 - LAT;
		var a = (Math.sin(dlat/2))^2 + Math.cos(LAT) * Math.cos(lat2) * (Math.sin(dlon/2))^2;
		c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
		d = R * c;

		valid = valid && d >= constraints["min_dist"];
		valid = valid && d <= constraints["max_dist"];
	}
	if (constraints["min_stars"] !== undefined) {
		valid = valid && parseFloat(item["stars"]) >= constraints["min_stars"];
	}
	if (constraints["max_stars"] !== undefined) {
		valid = valid && parseFloat(item["stars"]) <= constraints["max_stars"];
	}
	if (constraints["min_reviews"] !== undefined) {
		valid = valid && parseFloat(item["review_count"]) >= constraints["min_reviews"];
	}
	if (constraints["max_reviews"] !== undefined) {
		valid = valid && parseFloat(item["review_count"]) <= constraints["max_reviews"];
	}
	if (constraints["Reservations"] !== undefined && constraints["Reservations"]) {
		valid = valid && item["reservations"] === "TRUE" 
	}
	if (constraints["Wifi"] !== undefined && constraints["Wifi"]) {
		valid = valid && item["wifi"] === "free"
	}
	if (constraints["Credit"] !== undefined && constraints["Credit"]) {
		valid = valid && item["creditCards"] == "TRUE"
	}
	if (constraints["Take out"] !== undefined && constraints["Take out"]) {
		valid = valid && item["takeout"] == "TRUE"
	}
	// TODO handle time

	return valid

}

// TODO send data to map
$(function() { 
	$( "#dist_slider" ).slider({
	  range: true,
	  min: 0,
	  max: 7,
	  step: 0.1,
	  values: [ 0, 7],
	  slide: function( event, ui ) {
	    $( "#dist_amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] + " mi");
	  },
	  change: function(event, ui) {
	  	var new_constraints = {
	  		min_dist: ui.values[ 0 ],
	  		max_dist: ui.values[ 1 ]
	  	}

	  	handleConstraintsChange(new_constraints);
	  }
	});

	$( "#dist_amount" ).val( $( "#dist_slider" ).slider( "values", 0 ) +
    " - " + $( "#dist_slider" ).slider( "values", 1 ) + " mi"); 
});

$(function() {
    $( "#stars_slider" ).slider({
      range: true,
      min: 0,
      max: 5,
      step: 0.5,
      values: [ 0, 5 ],
      slide: function( event, ui ) {
        $( "#stars_amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] + " stars");
      },
	  change: function(event, ui) {
	  	var new_constraints = {
	  		min_stars: ui.values[ 0 ],
	  		max_stars: ui.values[ 1 ]
	  	}

	  	handleConstraintsChange(new_constraints);
	  }
    });
    $( "#stars_amount" ).val( $( "#stars_slider" ).slider( "values", 0 ) +
        " - " + $( "#stars_slider" ).slider( "values", 1 ) + " stars");   
});


$(function() {
    $( "#review_slider" ).slider({
      range: true,
      min: 3,
      max: 48,
      values: [ 3, 48 ],
      slide: function( event, ui ) {
        $( "#review_amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] + " reviews");
      },
	  change: function(event, ui) {
	  	var new_constraints = {
	  		min_reviews: ui.values[ 0 ],
	  		max_reviews: ui.values[ 1 ]
	  	}

	  	handleConstraintsChange(new_constraints);
	  }
    });
    $( "#review_amount" ).val( $( "#review_slider" ).slider( "values", 0 ) +
        " - " + $( "#review_slider" ).slider( "values", 1 ) + " reviews");   
});

$(function() {
	$(".type_check").change(function( event ) {
		var checked = $(event.target).is(':checked');
		var new_constraints = {};
		new_constraints[$(event.target).val()] = checked;

		handleConstraintsChange(new_constraints);
	});

	$("#days").change(function(event) {
		var new_constraints = {};
		var val = $(event.target).val();
		if (val === "n"){
			val = undefined;
		}
		new_constraints["day"] = val;

		handleConstraintsChange(new_constraints);
	});

	$("#hours").change(function(event){
		var new_constraints = {};
		var val = $(event.target).val();
		if (val === "n"){
			val = undefined;
		}
		new_constraints["hour"] = val;

		handleConstraintsChange(new_constraints);
	});
});