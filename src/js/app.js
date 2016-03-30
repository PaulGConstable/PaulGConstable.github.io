var favLocations = [
	{
		name: "Hadlow College, Tonbridge",
		lat: 51.223217,
		lng: 0.331976,
		stravaID: 127445893
	},

	{
		name: "Channel 4, London",
		lat: 51.496026,
		lng: -0.132962,
		stravaID: 150243926
	},
	{
		name: "Olympic Park, London",
		lat: 51.546307,
		lng: -0.020001,
		stravaID: 359827471
	},
	{
		name: "Amsterdam, Netherlands",
		lat: 52.361212,
		lng: 4.878265,
		stravaID: 168304053
	},
	{
		name: "Dieppe, France",
		lat: 49.933543,
		lng: 1.089050,
		stravaID: 151990703
	}
];

// Take locations and turn them KO observables
var markers = function(data){
	this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.stravaID=ko.observable(data.stravaID);
    this.marker = ko.observable();
};

var viewModel = function(data){
	var self = this;

	this.locationList = ko.observableArray([]);
	this.cycleSearch = ko.observable('');

	self.cycleFiltered = ko.pureComputed(function(){
		// Represents a filtered list of Location List names
		// i.e., only those matching the "cycleSearch" condition
		var search = self.cycleSearch().toLowerCase();
		var add = document.getElementById("drawer");
		if (!search) {
			return self.locationList();
		} else {
		add.classList.add("open");
		return ko.utils.arrayFilter(self.locationList(), function(cycleLocation){
			return cycleLocation.name().toLowerCase().indexOf(search) > -1;
		});
	}
	});

	 // Gets data from markers function and puts in
	 // KO observable array above
	favLocations.forEach(function(cycleLocation){
		self.locationList.push(new markers(cycleLocation));
	});

	//Info window for markers
    var infoWindow = new google.maps.InfoWindow();

    // Variable for marker data
    var pin;

    //iterate over observable array
   	this.locationList().forEach(function(cycleLocation){
   		pin = new google.maps.Marker({
			position: new google.maps.LatLng(cycleLocation.lat(), cycleLocation.lng()),
			map: map,
			title: cycleLocation.name(),
			animation: google.maps.Animation.DROP
		});

		// Get Strava API Data
		var stravaURL = 'https://www.strava.com/api/v3/activities/'+cycleLocation.stravaID()+'?per_page=200&access_token=01d55b235d8b40e4733bc5b843c2d61c5e13911a';

		$.ajax({
		    url: stravaURL,
		    dataType: "jsonp",
		    jsonp: "callback",
		    success: function ( response ) {
		    	var routeMap = response["map"];
		    	cycleLocation.distance = response["distance"];
		    	cycleLocation.url = "http://www.strava.com/activities/" + response["id"];
		    	console.log(routeMap);
		    },
		    error: function (){
		    	console.log('Strava data could not be loaded');
		    }
    	});

   		// Set variable outside function to equal each marker
		cycleLocation.marker = pin;

		// Add the content to infoWindow and open it
		cycleLocation.marker.addListener('click', function() {
			infoWindow.setContent('<div class="info-content">' + '<h1>' + 
				cycleLocation.name() + '</h1>' + '<p>Cycle Distance: ' + cycleLocation.distance + '</p>' + '<div class="body-content">'
				+ '<p></b><a href="' + cycleLocation.url + '">See ride on Strava</a></b></p>' + '</div>' +
				'</div>');
			infoWindow.open(map, cycleLocation.marker);
			// Zoom in and set clicked marker to centre
			map.setZoom(10);
			map.setCenter(cycleLocation.marker.getPosition());
		});
   	});

   	//Display the ride for the given map marker on click
    this.displayRide = function(cycleLocation){
        google.maps.event.trigger(cycleLocation.marker, 'click', {
        });
        var close = document.getElementById("drawer");
        close.classList.remove("open");

    };

    // Mobile Responsive navigiation to open drawer
    this.mobileNavToggle = function () {
    	// Do Navigation in Knockout
    };
};

// Initialize the Map
var map = new google.maps.Map(document.getElementById('map'), {
	center: new google.maps.LatLng(51.450210, 2.180518),
	zoom: 6
});

// Mobile responsive navigation using JQuery to open drawer
    var menu = document.querySelector('#menu');
    var main = document.querySelector('section');
    var drawer = document.querySelector('.rides-container');

    menu.addEventListener('click', function(e) {
      drawer.classList.toggle('open');
      e.stopPropagation();
    });
    main.addEventListener('click', function() {
      drawer.classList.remove('open');
    });

ko.applyBindings(new viewModel());