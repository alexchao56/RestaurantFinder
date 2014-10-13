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

// TODO send data to map

