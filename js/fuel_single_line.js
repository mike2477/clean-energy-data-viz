// create d3 function to create line chart
async function drawSingleLine(stateName, fuel) {

  // access data
  const dataset = await d3.json("../data/fuel_trends.json")
  const stateData = dataset[stateName]

  // chart dimensions
  const windowWidth = window.innerWidth;
  const width = windowWidth < 520 ? 300 : 200;
  const height = windowWidth < 520 ? 300 : 200;
  const margin = {top: 50, right: 40, bottom: 40, left: 40};

  // create svg
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  // accessors
  const xAccessor = d => new Date(d.year, 0, 1)
  const yAccessor = d => d[fuel]

  // scales
  const xScale = d3.scaleTime()
    .domain([new Date(2001, 0, 1), new Date(2022, 0, 1)])
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
    .attr("fill", "#404040")
    .text(stateName);

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  svg.append("path")
    .datum(stateData)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#DF7A5F")
    .attr("stroke-width", 3);

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


