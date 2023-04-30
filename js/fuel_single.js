async function drawSingleState(stateName, chartDiv, fuelsToShow) {

    // access data
    const dataset = await d3.json("../data/fuel_trends.json")
    const stateData = dataset[stateName]
  
    // chart dimensions
    const containerDiv = document.querySelector(chartDiv);
    const width = containerDiv.offsetWidth * 0.9;
    const height = containerDiv.offsetHeight * 0.9;
    const margin = {
        top: containerDiv.offsetHeight * 0.1, 
        right: containerDiv.offsetWidth * 0.1, 
        bottom: containerDiv.offsetHeight * 0.1, 
        left: containerDiv.offsetWidth * 0.1
    };
  
    // create svg
    const svg = d3.select(chartDiv)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
    // create title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(stateName);
  
    // accessors and scales
    const xAccessor = d => new Date(d.year, 0, 1);
    const yAccessor = d => d3.sum(fuelsToShow, fuel => d[fuel]);
  
    const xScale = d3.scaleTime()
      .domain([new Date(2000, 0, 1), new Date(2020, 0, 1)])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
  
    // create lines
    const fuelColors = {
        coal_proportion: "#DF7A5F",
        natural_gas_proportion: "#7f8c8d",
        hydroelectric_proportion: "#5E60CE",
        nuclear_proportion: "#3D405B",
        wind_proportion: "#80B29B",
        solar_proportion: "#F1CC90"
    };

    for (const fuelType of fuelsToShow) {
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
  
    // create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(4);
  
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d3.format(".0%"));
  
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
  
    svg.append("g")
      .call(yAxis);
  
  }
  
  // example usage
  drawSingleState("California", ".scrolly-chart-1", ["solar_proportion", "natural_gas_proportion", "hydroelectric_proportion", "nuclear_proportion", "wind_proportion"]);