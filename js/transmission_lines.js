async function drawTransmissionLines() {

    // access data
    const usMapJson = await d3.json("../data/us-map-geojson.json")
    const transmissionLinesJson = await d3.json("../data/electric_power_transmission_lines.json")

    // filter high voltage lines
    const highVoltageLines = transmissionLinesJson.features.filter(feature => feature.properties.VOLTAGE >= 200)

    // chart dimensions
    const containerDiv = document.querySelector("#transmission-line-map-wrapper");
    const width = containerDiv.offsetWidth;
    const height = containerDiv.offsetHeight;

    // Set projection as Albers and create Path Generator function
    const projection = d3.geoAlbers() // tells d3 to use Albers projection
        .scale(width * 1.2) // Adjust the scale based on the width of the SVG element
        .translate([width / 2, height / 2]) // Center the map in the middle of the SVG element

    const pathGenerator = d3.geoPath(projection); // creates a function to convert lat and long to path
  
    //Create SVG element and append US map to the SVG
    const wrapper = d3.select("#transmission-line-map-wrapper")
        .append("svg")
            .attr("width", width)
            .attr("height", height)

    const usMapGroup = wrapper.append("g") // group to keep things organized
    const usMap = usMapGroup.selectAll(".base-transmission-map") // take GeoJSON and turn into US Map svg
        .data(usMapJson.features)
        .join("path")
        .attr("d", pathGenerator)
        .attr("class", "base-transmission-map")

    // create all lines 
    const transmissionGroup = wrapper.append("g")
    const transmissionLines = transmissionGroup.selectAll(".all-transmission-lines")
        .data(transmissionLinesJson.features)
        .join("path")
        .attr("d", pathGenerator)
        .attr("class", "all-transmission-lines")
    
    // create high voltage lines
    const highVoltageGroup = wrapper.append("g")
    const highVoltagePath = highVoltageGroup.selectAll(".high-voltage-lines")
        .data(highVoltageLines)
        .join("path")
        .attr("d", pathGenerator)
        .attr("class", "high-voltage-lines")


}

drawTransmissionLines();
