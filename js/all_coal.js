let dataset;

// when coal_all.html loads, load the data and draw charts for each state alphabetically
async function loadAndDrawCharts() {
  dataset = await d3.json("../data/fuel_trends.json");
  drawAllCoalStates("alphabetical");

  d3.select('#download-button')
  .on('click', function() {
      let chartDiv = document.getElementById('chart-container');
      html2canvas(chartDiv, {scale: 2}).then(function(canvas) {
          let img = canvas.toDataURL("image/png");
          let link = document.createElement('a');
          link.href = img;
          link.download = 'decline-of-coal-in-50-states.png';
          link.click();
      });
  });

}

// runs function in fuel_single_line.js to draw a single line for each state 
// based on user input from sortCharts()

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

// runs on user input change
function sortCharts() {
  const sortBy = document.getElementById("sort").value;
  drawAllCoalStates(sortBy);
}

loadAndDrawCharts();



