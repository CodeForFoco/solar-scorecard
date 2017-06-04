'use strict';

var App = (function() {
function run() {

  var margin = {top: 30, right: 50, bottom: 60, left: 50};

  // Outer Sizing
  var owidth = 960;
  var oheight = 500;

  // Inner Sizing
  var cwidth = owidth - margin.left - margin.right;
  var cheight = oheight - margin.top - margin.bottom;

  // Draw Chart
  var chart = d3.select(".solar-monthly-js").append('svg')
    .attr("width", owidth)
    .attr("height", oheight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

}
return { run : run }
}());
document.addEventListener('DOMContentLoaded', App.run);
