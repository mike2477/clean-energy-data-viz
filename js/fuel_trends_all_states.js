// create d3 function to create line chart
async function drawLineChart() {

  // access data
  const dataset = await d3.json("../data/fuel_trends.json")

  // get the container element
  const container = d3.select(".chart-container");

  // calculate the width of each chart based on the width of the container
  const containerWidth = container.node().clientWidth;
  const chartWidth = 0.8 * containerWidth / 5;

  // loop through each state using for..in loop
  for (const state in dataset) {
    
    const stateData = dataset[state]
    const stateName = state

    // Set the dimensions for each chart
    const width = chartWidth;
    const height = 200;
    const margin = { top: 20, right: 10, bottom: 30, left: 30 };

    // Create the SVG element for each chart
    const svg = d3.create("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // accessors
    const xAccessor = d => new Date(d.year, 0, 1)  // turn d.year which is integer into a date object to use in d3 time scale later
    const yAccessor = d => d.coal_proportion

    // Define the x and y scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(stateData, d => new Date(d.year, 0, 1)))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // create line generator
      const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)));
    
    // Draw the line
    svg.append("path")
      .datum(stateData)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // Draw the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format(".0%"));

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    // Add a title to the chart
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text(`${stateName} Fuel Trends`);
    
    // Append the chart to the container div
    const container = d3.select(".chart-container")
      container.node().appendChild(svg.node())


  }
}

drawLineChart()