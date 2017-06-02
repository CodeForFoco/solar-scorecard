'use strict';

var App = (function() {
function run() {
  var cwidth = 800;
  var cheight = 600;
  var axisSize = 2;
  var padding = 40;
  var xAxisY = cheight - padding;
  var xAxisX = 0;
  var tickSize = 3;
  var tickHeight = tickSize * 2 + axisSize;
  var tickStart = xAxisY - tickSize;
  var labelStart = tickStart + tickHeight * 3;

  var allCategories = [];
  for (var year = 2005; year <= 2030; year++) {
    allCategories.push(year);
  }
  var categories = allCategories.slice(12,28);

  var chart = d3.select(".solar-progress-js")
    .attr("width", cwidth)
    .attr("height", cheight)

  rect(chart, xAxisX, xAxisY, cwidth, axisSize)
  categories.forEach(function(label, index) {
    var xLabelPosition = padding + (cwidth / categories.length) * index;
    rect(chart, xLabelPosition, tickStart, 1, tickHeight);
    text(chart, xLabelPosition, labelStart, label)
      .style("fill", "red");
  })
}

function rect(chart, x, y, width, height) {
  return chart.append("rect")
    .attr("y", y)
    .attr("x", x)
    .attr("height", height)
    .attr("width", width);
}

function text(chart, x, y, content) {
  var text = chart.append("text")
    .attr("x", x)
    .attr("y", y)
    .text(content);

  text.attr("width",
    function() {
      return this.getBBox().width;
    })
    .attr("x", function() {
      return this.getBBox().x - this.getBBox().width / 2;
    });

  return text;
}

return { run : run }
}());
document.addEventListener('DOMContentLoaded', App.run);
