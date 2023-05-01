let dataset;

async function loadAndDrawCharts() {
  dataset = await d3.json("../data/fuel_trends.json");
  drawAllCoalStates("alphabetical");
}

function drawAllCoalStates(sortBy) {
  // Clear the chart container
  d3.select("#chart").html("");

  // Sort the dataset based on the selected option
  let sortedStates = Object.keys(dataset);
  if (sortBy === "largest_share") {
    sortedStates.sort((a, b) => {
      const aShare = dataset[a][dataset[a].length - 1].coal_share;
      const bShare = dataset[b][dataset[b].length - 1].coal_share;
      return bShare - aShare;
    });
  } else if (sortBy === "smallest_share") {
    sortedStates.sort((a, b) => {
      const aShare = dataset[a][dataset[a].length - 1].coal_share;
      const bShare = dataset[b][dataset[b].length - 1].coal_share;
      return aShare - bShare;
    });
  } else {
    sortedStates.sort();
  }

  // Loop through each state and call drawSingleLine with the state name
  for (const stateName of sortedStates) {
    drawSingleLine(stateName, "coal_share");
  }
}

function sortCharts() {
  const sortBy = document.getElementById("sort").value;
  drawAllCoalStates(sortBy);
}

loadAndDrawCharts();
