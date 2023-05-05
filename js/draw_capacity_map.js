
async function drawMap(year, technology) {

  // Access data
  const plantDataset = await d3.csv("../data/all-power-plants.csv", d3.autoType)
  const usMapJson = await d3.json("../data/us-map-geojson.json")

  // filter by year
  const filteredPlantDataset = plantDataset.filter((d) => d.op_year == year && d.technology == technology);

  // Clear existing map before drawing a new one
  d3.select("#map-wrapper svg").remove();

  // plant accessors and filters
  const plantLat = d => d.lat
  const plantLong = d => d.long
  const capacity = d => d.nameplate_capacity


   // Create bounds for the map to go in as usual
   let dimensions = {
      width: window.innerWidth * 0.75,
      height: 500,
    }

  // Set projection as Albers and create Path Generator function
  const projection = d3.geoAlbers() // tells d3 to use Albers projection
  const pathGenerator = d3.geoPath(projection); // creates a function to convert lat and long to path

  //Create SVG element and append US map to the SVG
  const wrapper = d3.select("#map-wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
  
  const mapGroup = wrapper.append("g") // group to keep things organized
  const usMap = mapGroup.selectAll("#theMap") // take GeoJSON and turn into US Map svg
    .data(usMapJson.features)
    .join("path")
      .attr("d", pathGenerator)
      .attr("class", "theMap")

  // Scales and geo converter
  const plantScale = d3.scaleLinear()
      .domain([0,420])
      .range([1.5,15])

  function plantProjection (d) {   // create x, y coordinates for dot based on lat and long
    return "translate("
    + projection([plantLong(d),plantLat(d)])
    + ")"
  }

   // Create dots for each power plant and scale
   const plantGroup = wrapper.append("g")
   const plantDots = plantGroup.selectAll("#circles")
     .data(filteredPlantDataset)
     .enter().append("circle")
       .attr("r", d => plantScale(capacity(d)))
       .attr("transform", d => plantProjection(d))
       .attr("fill", "#2F394B")
       .attr("opacity", 0.7)

}