async function drawSingleState(stateName, chartDiv, fuelsToShow) {

    // access data
    const dataset = await d3.json("../data/fuel_trends.json")
    const stateData = dataset[stateName]
  
    // chart dimensions
    const containerDiv = document.querySelector(chartDiv);
    const width = containerDiv.offsetWidth * 0.8;
    const height = containerDiv.offsetHeight * 0.8;
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
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(stateName);
  
    // accessors and scales
    const xAccessor = d => new Date(d.year, 0, 1);
    const yAccessor = d => d3.sum(fuelsToShow, fuel => d[fuel]);
  
    const xScale = d3.scaleTime()
      .domain([new Date(2001, 0, 1), new Date(2022, 0, 1)])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
  
    // create lines
    const fuelColors = {
        coal_share: "#DF7A5F",
        natural_gas_share: "#A9A9A9",
        conventional_hydroelectric_share: "#5E60CE",
        nuclear_share: "#3D405B",
        wind_share: "#80B29B",
        all_utility_scale_solar_share: "#F1CC90"
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
        .attr("stroke-width", 3);
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

    // map fuel names for legend
    const fuelNames = {
      coal_share: "Coal",
      natural_gas_share: "Natural Gas",
      conventional_hydroelectric_share: "Hydro",
      nuclear_share: "Nuclear",
      wind_share: "Wind",
      all_utility_scale_solar_share: "Solar"
    };

    // create legend
    const legend = svg.selectAll(".legend")
      .data(fuelsToShow)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", d => fuelColors[d]);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => fuelNames[d]);    
  }
  
  