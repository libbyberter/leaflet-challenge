

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
        center: [45, -111],
        zoom: 3.5,
        layers: [mapTile, quakeMarkersLayer]
    });

    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap)
    console.log(`end makeMap`)
    console.log(`start legend`)

    // add legend (code from leaflet.js)
    var legend = L.control({position: 'topright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 20, 30, 40, 50, 60, 70],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var l = 0; l < grades.length; l++) {
            div.innerHTML +=
                '<i style="background:' + depthColor(grades[l] + 1) + ';"></i> ' +
                grades[l] + (grades[l + 1] ? '&ndash;' + grades[l + 1] + '<br>' : '+');
            // console.log(depthColor(grades[l] + 1))
            }
            
        return div;

    };

    legend.addTo(myMap);
}



function createMarkers(response) {
    console.log(`start markers`)
    var quakes = response.features
    // console.log(quakes)

    // list to hold coordinates of each quake
    var quakeMarkers = []
    // var quakeDepth = []
    // var magnitude = []

    // loop through file to get all quake coordinates
    for (var i = 0; i < quakes.length; i++) {
        var quake = quakes[i].geometry
        var quakeLocation = [quake.coordinates[1],quake.coordinates[0]]
        // quakeMarkers.push(quakeLocation)

        var depth = quake.coordinates[2]
        // quakeDepth.push(depth)



        
        var mag = quakes[i].properties.mag
        if (mag < 0) {
            var magnitude = 0}
        else 
            var magnitude = mag
        // quakeMagnitude.push(magnitude)
        // console.log(depth)
        // console.log(magnitude)

        quakeMarkers.push(
            L.circle(quakeLocation, {
                stroke:true,
                fillOpacity: 0.85,
                color: 'gray',
                fillColor: depthColor(depth),
                radius: markerSize(magnitude),
                weight: 1
            })
        )
    }

    console.log(`end makeMap`)
    // make layer group and pass info to make map function
    makeMap(L.layerGroup(quakeMarkers))

}

function depthColor(depth) {
    return  depth > 70 ? '#6e016b':
            depth > 60 ? '#88419d':
            depth > 50 ? '#8c6bb1':
            depth > 40 ? '#8c96c6':
            depth > 30 ? '#9ebcda':
            depth > 20 ? '#bfd3e6':
            depth > 10 ? '#e0ecf4':
            depth > -10 ? '#f7fcfd':
            'white';

// ['#edf8fb','#bfd3e6','#9ebcda','#8c96c6','#8856a7','#810f7c']
}


function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 50000;
  }









console.log(`start API`)
// Call API from USGS GeoJSON page
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
