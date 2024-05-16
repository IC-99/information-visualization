// visualization parameters
const margin = 100;
const width = 1000;
const height = 800;
const balloonMinSize = 50;
const balloonMaxSize = 100;
const basketMinSize = 10;
const basketMaxSize = 50;
const basketDistance = 20;

d3.json("data.json")
  .then(function(data) {
    var svg = d3.select("body").append("svg")
      .attr("width", width + margin)
      .attr("height", height + margin);

    const minXScale = d3.min(data, function(element){ return element["x1"] });
    const maxXScale = d3.max(data, function(element){ return element["x1"] });
    const xScale = d3.scaleLinear().domain([minXScale, maxXScale]).range([margin, width - margin]);

    const minYScale = d3.min(data, function(element){ return element["x2"] });
    const maxYScale = d3.max(data, function(element){ return element["x2"] });
    const yScale = d3.scaleLinear().domain([minYScale, maxYScale]).range([margin, height - margin]);

    const minCircleSizeScale = d3.min(data, function(element){ return element["x3"] });
    const maxCircleSizeScale = d3.max(data, function(element){ return element["x3"] });
    const circleSizeScale = d3.scaleLinear().domain([minCircleSizeScale, maxCircleSizeScale]).range([balloonMinSize, balloonMaxSize]);

    const minSquareSizeScale = d3.min(data, function(element){ return element["x4"] });
    const maxSquareSizeScale = d3.max(data, function(element){ return element["x4"] });
    const squareSizeScale = d3.scaleLinear().domain([minSquareSizeScale, maxSquareSizeScale]).range([basketMinSize, basketMaxSize]);

    const minColorScale = d3.min(data, function(element){ return element["x5"] });
    const maxColorScale = d3.max(data, function(element){ return element["x5"] });
    const colorScale = d3.scaleLinear().domain([minColorScale, maxColorScale]).range(["#99ffff", "#003366"]);

    var selectionActive = false;
    var selectedIndex = null;
    var selectedBalloon = null;

    function updateBalloons(newData) {
      const balloons = svg.selectAll(".balloon")
        .data(newData);
    
      balloons.select("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return xScale(d.x1); })
        .attr("cy", function(d) { return yScale(d.x2); })
        .attr("r", function(d) { return circleSizeScale(d.x3); })
        .attr("fill", function(d) { return colorScale(d.x5); });

      balloons.select(".lineLeft")
        .transition()
        .duration(1000)
        .attr("x1", function(d) { return xScale(d.x1) - circleSizeScale(d.x3); })
        .attr("y1", function(d) { return yScale(d.x2); })
        .attr("x2", function(d) { return xScale(d.x1) - squareSizeScale(d.x4) / 2; })
        .attr("y2", function(d) { return yScale(d.x2) + circleSizeScale(d.x3) + basketDistance; });

      balloons.select(".lineRight")
        .transition()
        .duration(1000)
        .attr("x1", function(d) { return xScale(d.x1) + circleSizeScale(d.x3); })
        .attr("y1", function(d) { return yScale(d.x2); })
        .attr("x2", function(d) { return xScale(d.x1) + squareSizeScale(d.x4) / 2; })
        .attr("y2", function(d) { return yScale(d.x2) + circleSizeScale(d.x3) + basketDistance; });
      
      balloons.select("rect")
        .transition()
        .duration(1000)
        .attr("width", function(d) { return squareSizeScale(d.x4); })
        .attr("height", function(d) { return squareSizeScale(d.x4); })
        .attr("x", function(d) { return xScale(d.x1) - squareSizeScale(d.x4) / 2; })
        .attr("y", function(d) { return yScale(d.x2) + circleSizeScale(d.x3) + basketDistance; });
    }

    const balloons = svg.selectAll(".balloon")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "balloon")
      .on("click", function(event, d) {
        const clickedBalloon = d3.select(this);
        if (!selectionActive) {
          clickedBalloon.select("circle").transition().duration(300).attr("fill", "white");
          selectionActive = true;
          selectedIndex = data.indexOf(d)
          selectedBalloon = clickedBalloon
        }
        else {
          clickedIndex = data.indexOf(d);
          selectedBalloon.select("circle").transition().duration(300).attr("fill", function(d) { return colorScale(d.x5); });
          if (selectedIndex !== clickedIndex) {
            const tempX3 = data[selectedIndex]["x3"];
            const tempX4 = data[selectedIndex]["x4"];
            data[selectedIndex]["x3"] = data[clickedIndex]["x3"];
            data[selectedIndex]["x4"] = data[clickedIndex]["x4"];
            data[clickedIndex]["x3"] = tempX3;
            data[clickedIndex]["x4"] = tempX4;
            updateBalloons(data);
          }
          selectionActive = false;
          selectedIndex = null;
          selectedBalloon = null;
        }
        console.log("selection active: " + selectionActive);
        console.log("selected index: " + selectedIndex);
      });
    
    balloons.append("circle")
      .attr("cx", function(d) { return xScale(d.x1); })
      .attr("cy", function(d) { return yScale(d.x2); })
      .attr("r", function(d) { return circleSizeScale(d.x3); })
      .attr("fill", function(d) { return colorScale(d.x5); })
      .attr("stroke-width", "2")
      .attr("stroke", "black");

    balloons.append("line")
      .attr("x1", function(d) { return xScale(d.x1) - circleSizeScale(d.x3); })
      .attr("y1", function(d) { return yScale(d.x2); })
      .attr("x2", function(d) { return xScale(d.x1) - squareSizeScale(d.x4) / 2; })
      .attr("y2", function(d) { return yScale(d.x2) + circleSizeScale(d.x3) + basketDistance; })
      .attr("stroke", "black")
      .attr("class", "lineLeft");

    balloons.append("line")
      .attr("x1", function(d) { return xScale(d.x1) + circleSizeScale(d.x3); })
      .attr("y1", function(d) { return yScale(d.x2); })
      .attr("x2", function(d) { return xScale(d.x1) + squareSizeScale(d.x4) / 2; })
      .attr("y2", function(d) { return yScale(d.x2) + circleSizeScale(d.x3) + basketDistance; })
      .attr("stroke", "black")
      .attr("class", "lineRight");

    balloons.append("rect")
      .attr("width", function(d) { return squareSizeScale(d.x4); })
      .attr("height", function(d) { return squareSizeScale(d.x4); })
      .attr("x", function(d) { return xScale(d.x1) - squareSizeScale(d.x4) / 2; })
      .attr("y", function(d) { return yScale(d.x2) + circleSizeScale(d.x3) + basketDistance; })
      .attr("fill", "#4B0000");
  })
  .catch(function(error) {
    console.log("error loading JSON file: " + error)
  });
