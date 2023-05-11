// create d3 function to create line chart
async function drawLineChart(stateName) {

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
  const yAccessor = d => d.coal_share

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
    .text(stateName);

  // create lines
  const fuelColors = {
    coal_share: "#DF7A5F",
    natural_gas_share: "#A9A9A9",
    conventional_hydroelectric_share: "#5E60CE",
    nuclear_share: "#3D405B",
    wind_share: "#80B29B",
    all_utility_scale_solar_share: "#F1CC90"
  };

  for (const fuelType of ["coal_share", "natural_gas_share", "conventional_hydroelectric_share", "nuclear_share", "wind_share", "all_utility_scale_solar_share"]) {
    const lineGenerator = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(d[fuelType]));

    svg.append("path")
      .datum(stateData)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", fuelColors[fuelType])
      .attr("stroke-width", 2);
  }

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