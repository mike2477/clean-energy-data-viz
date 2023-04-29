// create d3 function to create line chart
async function drawLineChart() {

  // access data
  const dataset = await d3.json("../data/fuel_trends.json")

  // sorted by 2020 coal generation
  const sortedData = Object.entries(dataset)
    .map(([stateName, stateData]) => ({ stateName, coalGeneration: stateData[stateData.length - 1].coal_proportion }))
    .sort((a, b) => b.coalGeneration - a.coalGeneration)

  console.log(dataset)
  console.log(sortedData)


  const windowWidth = window.innerWidth;

  for (const state in dataset) {

    const stateData = dataset[state]
    const stateName = state

    // set dimensions based on window width
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
      .text(stateName);

      const fuelColors = {
        coal_proportion: "#DF7A5F",
        natural_gas_proportion: "#F1CC90",
        hydroelectric_proportion: "#5E60CE",
        nuclear_proportion: "#3D405B",
        wind_proportion: "#80B29B"
      };

      for (const fuelType of ["coal_proportion", "natural_gas_proportion", "hydroelectric_proportion", "nuclear_proportion", "wind_proportion"]) {
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