// create d3 function to create line chart
async function drawSingleBar(stateName, fuel, chartDiv, minYear, maxYear) {

  const data = await d3.csv("../data/all-power-plants.csv", d3.autoType)
  const filteredData = data.filter(d => d.energy_source_code === fuel && d.state === stateName && d.op_year >= minYear && d.op_year <= maxYear);
  const capacityByYear = d3.rollup(filteredData, v => d3.sum(v, d => d.nameplate_capacity), d => d.op_year);

  // add zero values for years with no capacity
  let allYears = {};
  for (let i = minYear; i <= maxYear; i++) {
    allYears[i] = 0;
  }

  for (let [year, value] of capacityByYear.entries()) {
    allYears[year] = value;
  }

  const dataArray = Object.entries(allYears).map(([year, value]) => ({year: +year, value}));
  dataArray.sort((a, b) => a.year - b.year);
  
  // chart dimensions
  const windowWidth = window.innerWidth;
  const width = windowWidth < 520 ? 300 : 800;
  const height = windowWidth < 520 ? 300 : 400;
  const margin = {top: 50, right: 60, bottom: 40, left: 60};

  // create svg
  const svg = d3.select(chartDiv)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  // accessors
  const xAccessor = d => new Date(d.year, 0, 1)
  const yAccessor = d => d.value

  // scales
  const xScale = d3.scaleBand()
    .domain(dataArray.map(d => d.year))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataArray, d => d.value)])
    .range([height, 0]);
  
  // create title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", "#404040")
    .text(stateName);

  // Add y-axis label
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-size", "13px")
  .text("New capacity (MW)");

  // create bars
  svg.selectAll(".bar")
    .data(dataArray)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.year))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(yAccessor(d)))
    .attr("height", d => height - yScale(yAccessor(d)))
    .style("fill", "#F1CC90")
    .style("stroke", "#000") 
    .style("stroke-width", "1");

  // create axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(4);
  
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale).ticks(4))


}