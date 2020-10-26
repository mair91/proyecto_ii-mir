// Create the tile layer that will be the background of our map
var map_layer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var map = L.map("map-id", {
  center: [23.9, -102.66],
  layers: [map_layer],
  zoom: 6
});

map_layer.addTo(map)

// Initialize all of the LayerGroups we'll be using
var layers = {
  PRD: new L.LayerGroup(),
  PAN: new L.LayerGroup(),
  PRI: new L.LayerGroup(),
  Verde: new L.LayerGroup(),
  MORENA: new L.LayerGroup(),
  PT: new L.LayerGroup(),
  Otro: new L.LayerGroup()
};

// //Create the map with our layers
// var map = L.map("map-id", {
//   center: [23.9, -102.66],
//   zoom: 6,
//   layers: [
//     layers.map_layer,
//     layers.PRD,
//     layers.PAN,
//     layers.PRI,
//     layers.Verde,
//     layers.MORENA,
//     layers.PT,
//     layers.Otro
//   ]
// });

// map_layer.addTo(map)

// Create an overlays object to add to the layer control
//var overlays = {
  //"PRD": layers.PRD,
  //"PAN": layers.PAN,
  //"PRI": layers.PRI,
  //"Verde": layers.Verde,
  //"MORENA": layers.MORENA,
  //"PT": layers.PT,
  //"Otro": layers.Otro
//};

// Create a control for our layers, add our overlay layers to it
//L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
//var info = L.control({
  //position: "bottomright"
//});

// When the layer control is added, insert a div with the class of "legend"
//info.onAdd = function() {
  //var div = L.DomUtil.create("div", "legend");
  //return div;
//};
// Add the info legend to the map
//info.addTo(map);

// Initialize an object containing icons for each layer group
//var icons = {
  //PRD: L.ExtraMarkers.icon({
    //markerColor: "yellow",
    //shape: "star"
  //}),
  //PAN: L.ExtraMarkers.icon({
    //markerColor: "blue",
    //shape: "circle"
  //}),
  //PRI: L.ExtraMarkers.icon({
    //markerColor: "green",
    //shape: "circle"
  //}),
  //Verde: L.ExtraMarkers.icon({
    //markerColor: "green",
    //shape: "square"
  //}),
  //MORENA: L.ExtraMarkers.icon({
    //markerColor: "red",
    //shape: "circle"
  //}),
  //PT: L.ExtraMarkers.icon({
    //markerColor: "red",
    //shape: "star"
  //}),
  //Otro: L.ExtraMarkers.icon({
    //markerColor: "white",
    //shape: "circle"
  //})
//};



// call the json file
d3.json(`/api/votos/1994`, function(resultados) {
  console.log(resultados)

  // Create an object to keep of the number of states won per presidential party
  // var Votos_partidos = {
  //   PRD: 0,
  //   PAN: 0,
  //   PRI: 0,
  //   Verde: 0,
  //   MORENA: 0,
  //   PT: 0,
  //   Otro: 0
  // };

  // // Initialize partido to access appropriate layers
  // var partido;

  // Loop through the states (they're the same size and have partially matching data)
  resultados.forEach(d => {
    
    var color = "";
    if (d.ganador = "MORENA") {
      color = "brown";
    }
    else if (d.ganador = "PAN") {
      color = "blue";
    }
    else {
      color = "gray";
    }

    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.circleMarker([d.latitud, d.longitud], {
      // icon: icons[partido]
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
    });

    // Add the new marker to the appropriate layer
    // newMarker.addTo(layers[partido]);
    newMarker.addTo(map)

    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    // newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
    newMarker.bindPopup("<h8>" + d.estado + "</h8> <hr> <h9>Ganador: " + d.ganador + "</h9>").addTo(map);
  });

  // Call the updateLegend function, which will... update the legend!
  // updateLegend(GanadorEstado, Votos_partidos);
});


// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, Votos_partidos) {
  document.querySelector(".legend").innerHTML = [
    "<p> Partidos con su cantidad de votos a nivel nacional </p>",
    "<p class='out-of-order'>PRI " + Votos_partidos.PRI + "</p>",
    "<p class='coming-soon'>PAN " + Votos_partidos.PAN +  "</p>",
    "<p class='empty'>PRD " + Votos_partidos.PRD +  "</p>",
    "<p class='low'>Verde " + Votos_partidos.Verde +  "</p>",
    "<p class='healthy'>MORENA " + Votos_partidos.MORENA +  "</p>",
    "<p class='low'>Verde " + Votos_partidos.PT +  "</p>",
    "<p class='healthy'>MORENA " + Votos_partidos.Otro +  "</p>" 
  ].join("")
};

// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = {MORENA: 53.2, PAN: 22.3, PRI:16.4, IND:5.3}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){ return d.data.key + " - " + d.value})
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)





// set the dimensions and margins of the graph
var width2012 = 450
    height2012 = 450
    margin2012 = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius2012 = Math.min(width2012, height2012) / 2 - margin2012


var svg2012 = d3.select("#my_dataviz2012")
  .append("svg")
    .attr("width", width2012)
    .attr("height", height2012)
  .append("g")
    .attr("transform", "translate(" + width2012 / 2 + "," + height2012 / 2 + ")");

// Create dummy data
var data2012 = {PRD: 31.6, PAN: 25.4, PRI:38.2, OTHERS:4.7}

// set the color scale
var color2012 = d3.scaleOrdinal()
  .domain(data2012)
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie2012 = d3.pie()
  .value(function(d) {return d.value; })
var data_ready2012 = pie(d3.entries(data2012))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator2012 = d3.arc()
  .innerRadius(0)
  .outerRadius(radius2012)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg2012
  .selectAll('mySlices')
  .data(data_ready2012)
  .enter()
  .append('path')
    .attr('d', arcGenerator2012)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg2012
  .selectAll('mySlices')
  .data(data_ready2012)
  .enter()
  .append('text')
  .text(function(d){ return d.data.key + " - " + d.value})
  .attr("transform", function(d) { return "translate(" + arcGenerator2012.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)





// set the dimensions and margins of the graph
var width2008 = 450
    height2008 = 450
    margin2008 = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius2008 = Math.min(width2008, height2008) / 2 - margin2008


var svg2008 = d3.select("#my_dataviz2008")
  .append("svg")
    .attr("width", width2008)
    .attr("height", height2008)
  .append("g")
    .attr("transform", "translate(" + width2008 / 2 + "," + height2008 / 2 + ")");

// Create dummy data
var data2008 = {PRD: 35.3, PAN: 35.9, PRI:22.0, OTHERS:6.7}

// set the color scale
var color2008 = d3.scaleOrdinal()
  .domain(data2008)
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie2008 = d3.pie()
  .value(function(d) {return d.value; })
var data_ready2008 = pie(d3.entries(data2008))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator2008 = d3.arc()
  .innerRadius(0)
  .outerRadius(radius2008)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg2008
  .selectAll('mySlices')
  .data(data_ready2008)
  .enter()
  .append('path')
    .attr('d', arcGenerator2008)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg2008
  .selectAll('mySlices')
  .data(data_ready2008)
  .enter()
  .append('text')
  .text(function(d){ return d.data.key + " - " + d.value})
  .attr("transform", function(d) { return "translate(" + arcGenerator2008.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)


  // set the dimensions and margins of the graph
var width2000 = 450
height2000 = 450
margin2000 = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius2000 = Math.min(width2008, height2008) / 2 - margin2008


var svg2000 = d3.select("#my_dataviz2000")
.append("svg")
.attr("width", width2000)
.attr("height", height2000)
.append("g")
.attr("transform", "translate(" + width2000 / 2 + "," + height2000 / 2 + ")");

// Create dummy data
var data2000 = {PRD: 16.6, PAN: 42.5, PRI:36.1, OTHERS:2.7}

// set the color scale
var color2000 = d3.scaleOrdinal()
.domain(data2000)
.range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie2000 = d3.pie()
.value(function(d) {return d.value; })
var data_ready2000 = pie(d3.entries(data2000))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator2000 = d3.arc()
.innerRadius(0)
.outerRadius(radius2000)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg2000
.selectAll('mySlices')
.data(data_ready2000)
.enter()
.append('path')
.attr('d', arcGenerator2000)
.attr('fill', function(d){ return(color(d.data.key)) })
.attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg2000
.selectAll('mySlices')
.data(data_ready2000)
.enter()
.append('text')
.text(function(d){ return d.data.key + " - " + d.value})
.attr("transform", function(d) { return "translate(" + arcGenerator2000.centroid(d) + ")";  })
.style("text-anchor", "middle")
.style("font-size", 17)



  // set the dimensions and margins of the graph
  var width1994 = 450
  height1994 = 450
  margin1994 = 40
  
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius1994 = Math.min(width1994, height1994) / 2 - margin1994
  
  
  var svg1994 = d3.select("#my_dataviz1994")
  .append("svg")
  .attr("width", width1994)
  .attr("height", height1994)
  .append("g")
  .attr("transform", "translate(" + width1994 / 2 + "," + height1994 / 2 + ")");
  
  // Create dummy data
  var data1994 = {PRD: 17.1, PAN: 26.7, PRI:50.1, OTHERS:6.1}
  
  // set the color scale
  var color1994 = d3.scaleOrdinal()
  .domain(data1994)
  .range(d3.schemeSet2);
  
  // Compute the position of each group on the pie:
  var pie1994 = d3.pie()
  .value(function(d) {return d.value; })
  var data_ready1994 = pie(d3.entries(data1994))
  // Now I know that group A goes from 0 degrees to x degrees and so on.
  
  // shape helper to build arcs:
  var arcGenerator1994 = d3.arc()
  .innerRadius(0)
  .outerRadius(radius1994)
  
  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg1994
  .selectAll('mySlices')
  .data(data_ready1994)
  .enter()
  .append('path')
  .attr('d', arcGenerator1994)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
  
  // Now add the annotation. Use the centroid method to get the best coordinates
  svg1994
  .selectAll('mySlices')
  .data(data_ready1994)
  .enter()
  .append('text')
  .text(function(d){ return d.data.key + " - " + d.value})
  .attr("transform", function(d) { return "translate(" + arcGenerator1994.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)