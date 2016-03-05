var favLocations = [
	{
		name: "Home, Crayford",
		lat: 51.450210,
		lng: 0.180518,
		markerNum: 0
	},
	{
		name: "Channel 4, London",
		lat: 51.496026,
		lng: -0.132962,
		markerNum: 1
	},
	{
		name: "Olympic Park, London",
		lat: 51.546307,
		lng: -0.020001,
		markerNum: 2
	},
	{
		name: "Amsterdam, Netherlands",
		lat: 52.361212,
		lng: 4.878265,
		markerNum: 3
	},
	{
		name: "Dieppe, France",
		lat: 49.933543,
		lng: 1.089050,
		markerNum: 4
	}
];

function initMap() {
	var initLocations = ko.observableArray(favLocations);

	// Add a initial position to map
	var mapInitMap = new google.maps.LatLng(51.450210,2.180518);
	var mapStyles = {
		center: mapInitMap,
		zoom: 6
	};
	// Initiate Google Maps
	var map = new google.maps.Map(document.getElementById('map'),
		mapStyles);

	// Place Markers on map
	for (i = 0; i < favLocations.length; i++) {
		marker = new google.maps.Marker({
		position: new google.maps.LatLng(favLocations[i].lat, favLocations[i].lng),
		map: map,
		title: favLocations[i].name
		});
	}
};

ko.applyBindings(new initMap());
