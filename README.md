# Neighbourhood Map Project: My Favourite Rides</h1>

To run this project, please visit: [http://paulgconstable.github.io/dist/](http://paulgconstable.github.io/dist/) in any browser! Alternatively, please download the files and go to the 'dist' folder directory.

### Project Preview
![My Favourite Rides Project Preview](screengrab.jpg)
Using Google Maps API in combination with Strava's API I have pulled in my favourite cycle rides and put them on the map for your perusal

### My Favourite Rides included on the Map

- Hadlow College, Tonbridge;
- Channel 4, London;
- Olympic Park, London;
- Amsterdam, Netherlands;
- Dieppe, France.

_**Note:** The above rides are the start point locations of my favourite rides_

### The Strava API provides:

- The Cycle Distance;
- The Average Speed;
- The rough moving time;
- The data for the polyline on the map.

### Google Maps API provides:

- The map;
- Markers;
- Info Windows;
- Polyline to map the ride.

The AJAX call to Strava's API retrieves my data for each of my favourite ride and then displays it on the map using the info window, polyline and marker functionality from Google's API.

### Search Functionality

In the top right hand corner you'll note a search functionality with the placeholder text "Search My Rides". This will filter through the names of the map markers (the names of my favourite rides, noted above). Once filtered, you will then need to either tap or click on the name of the ride in the left hand menu to show the data from your input.

### Bibliography

- [Strava API](https://strava.github.io/api/)
- [Google Maps API](https://developers.google.com/maps/)
- [Paul's Geek Dad Blog - using Strava API as JSON](http://pdwhomeautomation.blogspot.co.uk/2016/03/strava-api-lap-analysis-using-raspberry.html)
- [Blog on using Strava data](https://hendrikbulens.wordpress.com/2015/08/03/c-and-the-strava-web-api/)
- [Stack Overflow on using Strava Data](http://stackoverflow.com/questions/19730040/strava-v3-api-js-get-data)
- [Knockout Documentation](http://knockoutjs.com/index.html)

