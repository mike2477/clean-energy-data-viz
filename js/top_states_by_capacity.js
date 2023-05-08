async function topStatesbyCapacity (year, technology) {

    // Load and parse data
    const data = await d3.csv("../data/all-power-plants.csv", d3.autoType);
    const filteredData = data.filter(d => d.technology === technology && d.op_year === year);

    // Aggregate capacity by state and sort by descending capacity
    const capacityByState = d3.rollup(filteredData, v => d3.sum(v, d => d.nameplate_capacity), d => d.state);
    const sortedStates = Array.from(capacityByState.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Chart dimensions
    const windowWidth = window.innerWidth;
    const width = windowWidth < 520 ? windowWidth * 0.8 : 800;
    const height = windowWidth < 520 ? windowWidth * 0.8 : 300;
    const margin = { top: 50, right: 70, bottom: 40, left: 70 };

    // Scales
    const x = d3.scaleBand()
        .domain(sortedStates.map(d => d[0]))
        .rangeRound([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedStates, d => d[1])])
        .range([height, 0]);

    // Create SVG element
    const svg = d3.select("#top-state-capacity-bar-chart-wrapper")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(year);

    // Add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "12px")

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "12px")

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .text("New capacity (MW)");

    // Add bars
    svg.selectAll(".bar")
        .data(sortedStates)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))
        .attr("height", d => height - y(d[1]))
        .style("fill", "#F1CC90")
        .style("stroke", "#000") 
        .style("stroke-width", "1");

}

// for loop to iterate through years between 2001 and 2022
// needs to be async to wait for each chart to load before moving on to the next
async function loadTopStatesByCapacity() {
    for (let i = 2010; i <= 2022; i++) {
      await topStatesbyCapacity(i, "Solar Photovoltaic");
    }
  }
  
  loadTopStatesByCapacity();