async function drawSolarMap () {

     // Access data
    const plantDataset = await d3.csv("../data/all-power-plants.csv", d3.autoType)
    const usMapJson = await d3.json("../data/us-map-geojson.json")
    const solarDataset = plantDataset.filter((d) => d.technology == "Solar Photovoltaic")

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
        .domain(d3.extent(solarDataset, d => capacity(d)))
        .range([2,10])

    function plantProjection (d) {   // create x, y coordinates for dot based on lat and long
        return "translate("+ projection([plantLong(d),plantLat(d)])+ ")"
    }

    // Calculate the range of years in the dataset
    const minYear = d3.min(solarDataset, (d) => d.op_year);
    const maxYear = d3.max(solarDataset, (d) => d.op_year);


    // Create dots for each power plant and scale
    function addDots (year) {

        // filter by year
        filteredData = solarDataset.filter((d) => d.op_year == year);

        const plantGroup = wrapper.append("g");
        const plantDots = plantGroup.selectAll("#circles")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("r", 0) // Set the initial radius to 0
            .attr("transform", d => plantProjection(d))
            .attr("fill", "#2F394B")
            .attr("opacity", 0.7);

        // Apply the transition to grow and then shrink the dots
        plantDots.transition()
            .duration(250) // Duration of the growing phase
            .attr("r", d => plantScale(capacity(d)) * 1.2) // Make the dots 1.5 times bigger
            .transition()
            .duration(250) // Duration of the shrinking phase
            .attr("r", d => plantScale(capacity(d))); // Set the final radius

    }

    // loop through years and add dots
    for (let year = minYear; year <= 2010; year++) {
        setTimeout(() => {
            addDots(year);
        }, (year - minYear) * 500); // have to do this otherwise all years will be added at once (JS is async)
    }

    // old dot creator
    // const plantGroup = wrapper.append("g")
    // const plantDots = plantGroup.selectAll("#circles")
    // .data(solarDataset)
    // .enter()
    // .append("circle")
    //     .attr("r", d => plantScale(capacity(d)))
    //     .attr("transform", d => plantProjection(d))
    //     .attr("fill", "#2F394B")
    //     .attr("opacity", 0.7)



}

window.onload = function () {
    drawSolarMap();
}

