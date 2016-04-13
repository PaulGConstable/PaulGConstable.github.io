function app() {
    'use strict';
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
// KO observable array below
favLocations.forEach(function(cycleLocation){
    self.locationList.push(new markers(cycleLocation));
});

//Info window for markers
var infoWindow = new google.maps.InfoWindow();

// Variables for marker data
var pin, route;

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

// Set timer for JSONP data retrieval from Strava
var stravaRequestTimeout = setTimeout(function(){
    alert('Error: Sorry, Strava data could not be loaded. Please refresh the page.');
}, 5000);

// Retrieve data with JSON
$.ajax({
    url: stravaURL,
    dataType: "jsonp",
    jsonp: "callback",
    success: function ( response ) {
// Get encoded polyline data to and add to array
cycleLocation.routeMap = response.map.polyline;
// Get Strava Distance and convert to miles for array
cycleLocation.distance = response.distance*0.000621371192;
// Get Strava Moving time and convert to hours and minutes
cycleLocation.time = response.moving_time/3600;
// Get Strava average speed and add to array;
cycleLocation.speed = response.average_speed* 2.23693629;
// Get Strava ID to for URL in infoWindow
cycleLocation.url = "http://www.strava.com/activities/" + response.id;

clearTimeout(stravaRequestTimeout);

},
error: function (){
    alert('Sorry, Strava data could not be loaded. Please refresh the page.');
}
});

// Set variable outside function to equal each marker
cycleLocation.marker = pin;

// Make marker animate
function toggleBounce() {
    if (cycleLocation.marker.getAnimation() !== null) {
        cycleLocation.marker.setAnimation(null);
    } else {
        cycleLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

// Add the content to infoWindow and open it
cycleLocation.marker.addListener('click', function() {
    toggleBounce();
    infoWindow.setContent('<div class="info-content">' + '<h2>' +
        cycleLocation.name() + '</h2>' +
        '<div class="body-content"><p>Cycle distance: ' + cycleLocation.distance.toFixed(2) + ' miles</p>' +
        '<p>Average speed: ' + cycleLocation.speed.toFixed(2) + 'mph</p>' +
        '<p>Rough Moving Time: ' + cycleLocation.time.toFixed(0) + ' hours</p>' +
        '<p></b><a href="' + cycleLocation.url + '">See ride on Strava</a></b></p>' +
        '</div></div>');
    infoWindow.open(map, cycleLocation.marker);

// Remove the current polyline from the Map when you close an infoWindow
google.maps.event.addListener(infoWindow,'closeclick',function(){
route.setMap(null); //removes polyline
cycleLocation.marker.setAnimation(null); //removes animation
});

// Zoom in and set clicked marker to centre
map.setZoom(8);
map.setCenter(cycleLocation.marker.getPosition());

// Decode Strava Route and show it on click of marker
var decodedRoute = google.maps.geometry.encoding.decodePath(cycleLocation.routeMap);

// Show decoded Strava route on each marker click
route = new google.maps.Polyline({
    path: decodedRoute,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 5,
    map: map
});

});

});

// Display ride for the given map marker when clicked in Nav
this.displayRide = function(cycleLocation){
    google.maps.event.trigger(cycleLocation.marker, 'click', {
    });
};

// Mobile Responsive navigiation to open drawer
this.mobileNavToggle = function (cycleLocation) {
    var menu = document.querySelector('#menu');
    var main = document.querySelector('content');
    var drawer = document.querySelector('.rides-container');
    var close = document.getElementById('drawer');

    menu.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
    });
    main.addEventListener('click', function() {
        drawer.classList.remove('open');
    });

    close.classList.remove('open');

};
};

// Initialize the Map
var map;
var ViewModel;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(51.450210, 2.180518),
        zoom: 6
    });
}

//call the map initialization and apply bindings
function initApp() {
    initMap();
    ViewModel = new viewModel();
    ko.applyBindings(ViewModel);
}

initApp();
}