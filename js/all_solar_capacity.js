async function loadAllSolarStateBars () {
  dataset = await d3.csv("../data/all-power-plants.csv");

  // Filter dataset to only include data for 2022 and solar energy
  const filteredData2022 = dataset.filter(d => d.energy_source_code === "SUN" && d.op_year === "2022");

  // Calculate total capacity for each state in 2022
  const capacityByState2022 = d3.rollup(filteredData2022, v => d3.sum(v, d => d.nameplate_capacity), d => d.state);

  // Create an array from the capacityByState2022 map and sort it in descending order of capacity
  let stateCapacityArray2022 = Array.from(capacityByState2022, ([state, capacity]) => ({state, capacity}));
  stateCapacityArray2022.sort((a, b) => b.capacity - a.capacity);

  // Get the sorted array of states
  const sortedStates = stateCapacityArray2022.map(d => d.state);

  sortedStates.forEach(state => {
    drawSingleBar(state, "SUN", "#solar-bar-chart-wrapper", 2010, 2022);
  });


  // // Extract all the states from the dataset
  // const allStates = dataset.map(d => d.state);
  
  // // Get unique states by converting to Set then back to array
  // const uniqueStates = [...new Set(allStates)];

  // uniqueStates.forEach(state => {
  //   drawSingleBar(state, "SUN", "#solar-bar-chart-wrapper", 2010, 2022);
  // });
}

loadAllSolarStateBars();

