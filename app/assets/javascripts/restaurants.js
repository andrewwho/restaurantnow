function initialize() {
var konrad = new google.maps.LatLng(43.65036, -79.39671);
var mapOptions = {
center: new google.maps.LatLng(43.65036, -79.39671),
zoom: 15,
mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById("gmaps"), mapOptions);
var input = document.getElementById('search-field');
var error = document.getElementById('search-error');
var autocomplete = new google.maps.places.Autocomplete(input);
var list = $(".foodspots");
autocomplete.bindTo('bounds', map);
//autocomplete.setTypes('establishments');

var infowindow = new google.maps.InfoWindow();
var marker = new google.maps.Marker({
	map: map
});

google.maps.event.addListener(autocomplete, 'place_changed', function() {
	infowindow.close(); // close the info pop
	marker.setVisible(false); // hide the current marker
	input.className = '';
	error.className = '';
	var place = autocomplete.getPlace();
	if (!place.geometry) {
        // nothing found
        input.className = 'notfound';
		error.className = 'searcherror';
        return;
      }

	if (place.geometry.viewport) {
		map.fitBounds(place.geometry.viewport);
		map.setZoom(14);
		list.empty();
	} else {
		map.setZoom(14);
		map.setCenter(place.geometry.location);
		findrestaurants(place);
		createMarker(place);
		list.empty();
		$.ajax({
			type: 'POST',
			url: '/history',
			data: {
				name: input.value},
			dataType: "json"
		  });
	}
	
	var image = new google.maps.MarkerImage(
      place.icon,
      new google.maps.Size(71, 71),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 20),
      new google.maps.Size(35, 35)
	);
	
    marker.setIcon(image);
    marker.setPosition(place.geometry.location);

	var address = '';
	// break up the search field
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

	infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
});

	function findrestaurants(place) {
		var request = {
		    location: place.geometry.location,
		    radius: '2000', //radius around the location in meters
		    types: ['food']
		  };
		
		service = new google.maps.places.PlacesService(map);
	  	service.nearbySearch(request, callback);
	}

	function createMarker(place) {
	   var placeLoc = place.geometry.location;
	   var marker = new google.maps.Marker({
	     map: map,
	     position: place.geometry.location
	   });

	   google.maps.event.addListener(marker, 'click', function() {
	     infowindow.setContent(place.name);
	     infowindow.open(map, this);
	   });
	 }

	function callback(results, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
		var foodspots = '';
	    for (var i = 0; i < results.length; i++) {
	      var place = results[i];
	      createMarker(results[i]);
		  list.append("<li><i class='icon-glass'> </i>"+place.name+"<br>Rating: "+(!(place.rating===undefined) ? place.rating : '0')+"</li>");
		  getLocation(place);
			// 
			// 		  $.ajax({
			// type: 'POST',
			// url: '/restaurants',
			// data: {
			// 	name: place.name,
			// 	address: 'wtf'
			// },
			// dataType: "json"
			// 		  });
	    }
	  }
	}
	
	function getLocation(address) {
	  var request = {
			reference : address.reference
	  }
		
	  service = new google.maps.places.PlacesService(map);
 	  service.getDetails(request, saveAddress);
	  	  function saveAddress(results, status) {
	  		if (status == google.maps.places.PlacesServiceStatus.OK) {
	  			console.log(results.formatted_address);
	  		}
	  	  }

	}

}
