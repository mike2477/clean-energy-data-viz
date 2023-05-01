async function drawSorted (fuel) {
    const dataset = await d3.json("../data/fuel_trends.json")
  
    // sorted by 2020 fuel generation
    const sortedData = Object.entries(dataset)
      .map(([stateName, stateData]) => ({ stateName, fuelGeneration: stateData[stateData.length - 1][fuel] }))
      .sort((a, b) => b.fuelGeneration - a.fuelGeneration);
  
    // for each loop to log all state names in sortedData
    sortedData.forEach(d => drawLineChart(d.stateName))
  
  }
  
  
  drawSorted("wind_proportion")