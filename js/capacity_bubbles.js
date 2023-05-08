async function capacityBubbles (chartDiv, year, technology) {

    // Load and parse data
    const data = await d3.csv("../data/all-power-plants.csv", d3.autoType);
    const filteredData = data.filter(d => d.technology === technology && d.op_year === year);

    // Define the SVG element and its dimensions
    const width = 700
    const height = 500

    const svg = d3.select(chartDiv)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Define the radius scale for the bubbles based on capacity
    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(filteredData, d => d.nameplate_capacity)])
        .range([5, 30]);
    
    // force simulation setup with all forces
    const simulation = d3.forceSimulation(filteredData)
        .force('charge', d3.forceManyBody().strength(0.5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => radiusScale(d.nameplate_capacity)))
        .on('tick', ticked);
    
    // Add bubbles
    const bubbles = svg.selectAll(".bubble")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => radiusScale(d.nameplate_capacity))
        .style("fill", "#F1CC90")
        .style("stroke", "#000")
        .style("stroke-width", "1");

    // Update the bubbles' positions on each tick of the simulation
    function ticked() {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

}

// need to wait for DOM to load to ensure that the SVG element exists
document.addEventListener("DOMContentLoaded", function() {
    capacityBubbles("#solar-capacity-bubbles-wrapper", 2019, "Solar Photovoltaic");
});