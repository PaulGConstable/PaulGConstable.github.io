var favLocations = [
	{
		name: "Home, Crayford",
		lat: 51.450210,
		lng: 0.180518,
	},
	{
		name: "Channel 4, London",
		lat: 51.496026,
		lng: -0.132962,
	},
	{
		name: "Olympic Park, London",
		lat: 51.546307,
		lng: -0.020001,
	},
	{
		name: "Amsterdam, Netherlands",
		lat: 52.361212,
		lng: 4.878265,
	},
	{
		name: "Dieppe, France",
		lat: 49.933543,
		lng: 1.089050,
	}
];

// Take locations and turn them KO observables
var markers = function(data){
	this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
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
		if (!search) {
			return self.locationList();
		} else {
		return ko.utils.arrayFilter(self.locationList(), function(cycleLocation){
			return cycleLocation.name().toLowerCase().indexOf(query) > -1;
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

   		// Set variable outside function to equal each marker
		cycleLocation.marker = pin;

		// Add the content to infoWindow and open it
		cycleLocation.marker.addListener('click', function() {
			infoWindow.setContent('<div class="info-content">' + '<h1>' + 
				cycleLocation.name() + '</h1>' + '<div class="body-content">'
				+ '<p></b>See ride on Strava</b></p>' + '</div>' +
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
        close.classList.remove("open")

    };

    // Mobile Responsive navigiation to open drawer

    this.mobileNavToggle = function () {

    }
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