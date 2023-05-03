async function drawBubbles() {

  // Define the dataset
  const data = [
    { id: 1, radius: 20, color: '#DF7A5F'},
    { id: 2, radius: 30, color: '#80B29B' },
    { id: 3, radius: 25, color: '#DF7A5F'},
    { id: 4, radius: 15, color: '#F1CC90'},
    { id: 5, radius: 28, color: '#DF7A5F'},
    { id: 6, radius: 40, color: '#80B29B'},
    { id: 7, radius: 18, color: '#DF7A5F'},
    { id: 8, radius: 32, color: '#3D405B'},
    { id: 9, radius: 24, color: '#80B29B' },
    { id: 10, radius: 35, color: '#DF7A5F'},
  ];

  // Define the SVG element and its dimensions
  const width = 700
  const height = 500

  const svg = d3.select("#bubble-svg")
    .attr("width", width)
    .attr("height", height);

  // force simulation setup with all forces
  const simulation = d3.forceSimulation(data)
    .force('charge', d3.forceManyBody().strength(15))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.radius))
    .on('tick', ticked);

  // function to run the force simulation tick and update circle positions
  function ticked() {
    svg.selectAll('circle')
      .data(data)
      .join(
        enter => enter
          .append('circle')
          .attr('r', d => d.radius),
        update => update,
        exit => exit.remove()
      )
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => d.color);
  }

  // move the first bubble to the right
  function moveBubble() {
    simulation.stop();  // added this to prevent glitch after bubble is moved. 
    
    svg.select('circle')
      .filter(d => d.id === 1)
      .transition()
      .duration(1000) // duration of the transition in milliseconds
      .attr('cx', d => d.x + 100)
      .on('end', () => {
        // Update the data for the moved bubble
        const movedBubble = data.find(d => d.id === 1);
        if (movedBubble) {
          movedBubble.x += 100;
        }
      });
  }

  // trigger moveBubble after 2 seconds
  setTimeout(moveBubble, 2000);

}

// need to wait for DOM to load to ensure that the SVG element exists
document.addEventListener("DOMContentLoaded", function() {
  drawBubbles();
});

