window.onload = function() {
  function updateMap() {
    const year = document.getElementById("year-slider").value;
    document.getElementById("year-display").innerText = year;
    const technology = "Solar Photovoltaic";
    drawMap(year, technology);
  }

  let intervalID = setInterval(() => {
    const yearSlider = document.getElementById("year-slider");
    yearSlider.value = (parseInt(yearSlider.value) + 1 - 2005) % 18 + 2005;
    updateMap();
  }, 1000);

  document.getElementById("year-slider").addEventListener("change", updateMap);

  document.getElementById("pause-button").addEventListener("click", () => {
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
      document.getElementById("pause-button").innerText = "Resume";
    } else {
      intervalID = setInterval(() => {
        const yearSlider = document.getElementById("year-slider");
        yearSlider.value = (parseInt(yearSlider.value) + 1 - 2005) % 18 + 2005;
        updateMap();
      }, 1000);
      document.getElementById("pause-button").innerText = "Pause";
    }
  });

  updateMap();
}
