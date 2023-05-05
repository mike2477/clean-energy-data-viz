function updateMap() {
  const year = document.getElementById("year-slider").value;
  const technology = document.getElementById("tech-dropdown").value;
  if (technology) {
    drawMap(year, technology);
  }
}

window.onload = function() {
  document.getElementById("year-slider").addEventListener("input", updateMap);
  document.getElementById("tech-dropdown").addEventListener("change", updateMap);

  drawMap(2018, "Solar Photovoltaic");
}