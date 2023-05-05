async function drawSolarBarChart() {

  // Load and parse data
  const data = await d3.csv("../data/all-power-plants.csv", d3.autoType)
  const solarData = data.filter(d => d.technology === "Solar Photovoltaic");
  const capacityByYear = d3.rollup(solarData, v => d3.sum(v, d => d.nameplate_capacity), d => d.op_year);
  const years = Array.from(capacityByYear.keys())
    .filter(year => year >= 2010 && year <= 2022)
    .sort();

  // Define dimensions and margins for the chart
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 480 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  // Scales
  const x = d3.scaleBand()
    .domain(years)
    .rangeRound([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(Array.from(capacityByYear.values()))])
    .range([height, 0]);
  
  // Create SVG element
  const svg = d3.select("#bar-chart-wrapper")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));


  // Add bars incrementally
  let index = 0;

  function updateChart() {
    if (index < years.length) {
      const year = years[index];
      const capacity = capacityByYear.get(year);

      svg.append("rect")
        .attr("class", "bar")
        .attr("x", x(year))
        .attr("width", x.bandwidth())
        .attr("y", y(capacity))
        .attr("height", height - y(capacity))
        .style("fill", "#3D405B");

      index++;
    } else {
      clearInterval(intervalID);
    }
  }

  const intervalID = setInterval(updateChart, 1000);
  
}

drawSolarBarChart();