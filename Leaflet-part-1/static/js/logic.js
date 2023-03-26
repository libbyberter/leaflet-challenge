// Create make map function
function makeMap(quakeMarkersLayer) {
    console.log(`start makeMap`)
    console.log(quakeMarkersLayer)
    // Add a tile layer, location layer & add to map
    var mapTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMap = {
        "Street Map": mapTile
    };

    var overlayMaps = {
        "Quake Locations": quakeMarkersLayer
    };

    var myMap = L.map("map", {
        center: [40, -99],
        zoom: 5,
        layers: [mapTile, quakeMarkersLayer]
    });

    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap)
    console.log(`end makeMap`)
}



function createMarkers(response) {
    console.log(`start markers`)
    var quakes = response.features
    // console.log(quakes)

    // list to hold coordinates of each quake
    var quakeMarkers = []

    // loop through file to get all quake coordinates
    for (var i = 0; i < quakes.length; i++) {
        var quake = quakes[i].geometry
        var quakeLocation = L.marker([quake.coordinates[1],quake.coordinates[0]])
        quakeMarkers.push(quakeLocation)
    }
    console.log(`end makeMap`)
    // make layer group and pass info to make map function
    makeMap(L.layerGroup(quakeMarkers))

}











console.log(`start API`)
// Call API from USGS GeoJSON page
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
