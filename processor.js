csv_text = ""
$.ajax({
        url: 'waterlooAttributes.csv',
        type: 'get',
        async: false,
        success: function(html) {
                csv_text = html
        }
});

var data = $.csv.toObjects(csv_text);

var markers = [];
for data in result:
	markers.push(data[""]);

// TODO send markers to map

