
async function drawPlannedGas() {

    // Access data
    const plantDataset = await d3.csv("../data/planned-power-plants.csv", d3.autoType)
    const usMapJson = await d3.json("../data/us-map-geojson.json")
  
    // filter by year
    const filteredPlantDataset = plantDataset.filter((d) => d['Energy Source Code'] == "NG");
  
    // plant accessors and filters
    const plantLat = d => d['Latitude']
    const plantLong = d => d['Longitude']
    const capacity = d => d['Nameplate Capacity (MW)']
  
  
     // chart dimensions
    const containerDiv = document.querySelector("#planned-gas-map-wrapper");
    const width = containerDiv.offsetWidth;
    const height = containerDiv.offsetHeight;
  
    // Set projection as Albers and create Path Generator function
    const projection = d3.geoAlbers() // tells d3 to use Albers projection
        .scale(width * 1.2) // Adjust the scale based on the width of the SVG element
        .translate([width / 2, height / 2]) // Center the map in the middle of the SVG element

    const pathGenerator = d3.geoPath(projection); // creates a function to convert lat and long to path
  
    //Create SVG element and append US map to the SVG
    const wrapper = d3.select("#planned-gas-map-wrapper")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
    
    const mapGroup = wrapper.append("g") // group to keep things organized
    const usMap = mapGroup.selectAll("#theMap") // take GeoJSON and turn into US Map svg
      .data(usMapJson.features)
      .join("path")
        .attr("d", pathGenerator)
        .attr("id", "gas-map")
  
    // Scales and geo converter
    const plantScale = d3.scaleLinear()
        .domain([0, d3.max(filteredPlantDataset, d => d['Nameplate Capacity (MW)'])])
        .range([1,10])
  
    function plantProjection (d) {   // create x, y coordinates for dot based on lat and long
      return "translate("
      + projection([plantLong(d),plantLat(d)])
      + ")"
    }
  
     // Create dots for each power plant and scale
     const plantGroup = wrapper.append("g")
     const plantDots = plantGroup.selectAll("#circles")
       .data(filteredPlantDataset)
       .enter().append("circle")
         .attr("r", d => plantScale(capacity(d)))
         .attr("transform", d => plantProjection(d))
         .attr("fill", "#DF7A5F")
         .attr('stroke', '#000')
        .attr('stroke-width', 1)
  
  }

window.onload = function () {
    drawPlannedGas();
}