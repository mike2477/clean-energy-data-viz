window.onload = function() {
  function updateMap() {
    const year = document.getElementById("year-slider").value;
    document.getElementById("year-display").innerText = year;
    const technology = "Solar Photovoltaic";
    drawMap(year, technology);
  }

  let intervalID = setInterval(() => {
    const yearSlider = document.getElementById("year-slider");
    const currentYear = parseInt(yearSlider.value);
    if (currentYear < 2022) {
      yearSlider.value = currentYear + 1;
      updateMap();
    } else {
      clearInterval(intervalID);
    }
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
        const currentYear = parseInt(yearSlider.value);
        if (currentYear < 2022) {
          yearSlider.value = currentYear + 1;
          updateMap();
        } else {
          clearInterval(intervalID);
        }
      }, 1000);
      document.getElementById("pause-button").innerText = "Pause";
    }
  });

  updateMap();
}
