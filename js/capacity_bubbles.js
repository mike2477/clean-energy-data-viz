async function capacityBubbles (chartDiv, year, technology) {

    // Load and parse data
    const data = await d3.csv("../data/all-power-plants.csv", d3.autoType);
    const filteredData = data.filter(d => d.technology === technology && d.op_year === year);

    // Accessor functions
    const plantName = d => d.plant_name;
    const utilityName = d => d.entity_name;
    const plantState = d => d.state;
    const plantCounty = d => d.county;
    const plantCapacity = d => d.nameplate_capacity;
    const plantOpYear = d => d.op_year;

    // Define the SVG element and its dimensions
    const width = 1000
    const height = 600

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
        .style("stroke-width", "1")
        .on("mouseover", onMouseEnter)
        .on("mousemove", onMouseMove)
        .on("mouseout", onMouseLeave)

    // Update the bubbles' positions on each tick of the simulation
    function ticked() {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    function onMouseEnter (e, datum) {

        const tooltip = d3.select(".tooltip")

        tooltip.style("opacity", 1)

        const x = e.pageX;
        const y = e.pageY;

        tooltip.style("left", (x+10) + "px")
                .style("top", (y+10) + "px")
        
        tooltip.select(".tooltip-title")
            .text(plantName(datum))
      
        tooltip.select("#utility-name")
            .text(utilityName(datum))
        
        tooltip.select("#plant-location")
            .text(plantCounty(datum))
        
        tooltip.select("#plant-state")
            .text(plantState(datum))
        
        tooltip.select("#plant-capacity")
            .text(plantCapacity(datum))
        
        tooltip.select("#plant-year")
            .text(plantOpYear(datum))

    }

    function onMouseMove (e) {
        const tooltip = d3.select(".tooltip")
        const x = e.pageX;
        const y = e.pageY;
        tooltip.style("left", (x+10) + "px")
                .style("top", (y+10) + "px")
    }

    function onMouseLeave () {
        const tooltip = d3.select(".tooltip")
        tooltip.style("opacity", 0)
    }


}

// need to wait for DOM to load to ensure that the SVG element exists
document.addEventListener("DOMContentLoaded", function() {
    capacityBubbles("#solar-capacity-bubbles-wrapper", 2022, "Solar Photovoltaic");
});