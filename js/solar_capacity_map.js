async function drawSolarMap () {

     // Access data
    const plantDataset = await d3.csv("../data/all-power-plants.csv", d3.autoType)
    const usMapJson = await d3.json("../data/us-map-geojson.json")

    // plant accessors and filters
    const plantLat = d => d.lat
    const plantLong = d => d.long
    const capacity = d => d.nameplate_capacity

    // chart dimensions
    const containerDiv = document.querySelector("#solar-time-series-map-wrapper");
    const width = containerDiv.offsetWidth;
    const height = containerDiv.offsetHeight;

    // Set projection as Albers and create Path Generator function
    const projection = d3.geoAlbers() // tells d3 to use Albers projection
        .scale(width * 1.2) // Adjust the scale based on the width of the SVG element
        .translate([width / 2, height / 2]) // Center the map in the middle of the SVG element


    const pathGenerator = d3.geoPath(projection); // creates a function to convert lat and long to path

    //Create SVG element and append US map to the SVG
    const wrapper = d3.select("#solar-time-series-map-wrapper")
    .append("svg")
        .attr("width", width)
        .attr("height", height)

    const mapGroup = wrapper.append("g") // group to keep things organized
    const usMap = mapGroup.selectAll("#theMap") // take GeoJSON and turn into US Map svg
    .data(usMapJson.features)
    .join("path")
        .attr("d", pathGenerator)
        .attr("class", "theMap")

    // Scales and geo converter
    const plantScale = d3.scaleLinear()
        .domain(d3.extent(plantDataset, d => capacity(d)))
        .range([1,10])

    function plantProjection (d) {   // create x, y coordinates for dot based on lat and long
    return "translate("
    + projection([plantLong(d),plantLat(d)])
    + ")"
    }

    // Create dots for each power plant and scale
    const plantGroup = wrapper.append("g")
    const plantDots = plantGroup.selectAll("#circles")
    .data(plantDataset)
    .enter()
    .append("circle")
        .attr("r", d => plantScale(capacity(d)))
        .attr("transform", d => plantProjection(d))
        .attr("fill", "#2F394B")
        .attr("opacity", 0.7)


}

window.onload = function () {
    drawSolarMap();
}

