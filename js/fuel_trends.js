// create d3 function to create line chart
async function drawLineChart() {

  // access data
  const dataset = await d3.json("../data/fuel_trends.json")

  for (const state in dataset) {

    const stateData = dataset[state]
    const stateName = state

    // set dimensions
    const width = 200;
    const height = 200;
    const margin = {top: 50, right: 20, bottom: 40, left: 40};
    
    // create svg
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // accessors
    const xAccessor = d => new Date(d.year, 0, 1)  // turn d.year which is integer into a date object to use in d3 time scale later
    const yAccessor = d => d.coal_proportion

    // create scales
    const xScale = d3.scaleTime()
      .domain([new Date(2000, 0, 1), new Date(2020, 0, 1)])  // this looks complicate, but it just turns the int 2000 and 2020 into a date object
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0])

    // create title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(`${stateName} Fuel Trends`);

    // create line generator
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)));

    // draw line
    svg.append("path")
      .datum(stateData)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", '#DF7A5F')
      .attr("stroke-width", 3)

    // draw axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(4);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickValues([0.2, 0.4, 0.6, 0.8, 1.0])
      .tickFormat(d3.format(".0%"));

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

  }

}

drawLineChart()