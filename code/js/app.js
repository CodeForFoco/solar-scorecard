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

  // Make dummy data
  // { all, past, currentFuture }
  var data = generateDummyData();

  // Build Chart Scales and Components
  var xData = d3.scaleTime()
    .domain(d3.extent(data.all, function(d) { return d.date; }))
    .range([0,cwidth]) //allYears.map(randomIntGen(1, 500)))

  var yData = d3.scaleLinear()
    .domain(d3.extent(data.all, function(d) { return d.megawatts}))
    .range([cheight, 0])

  var xAxis = d3.axisBottom(xData)
    .ticks(10)
    .tickFormat(d3.timeFormat("%Y"))

  var line = d3.line()
    .x(function(d) { return xData(d.date);})
    .y(function(d) { return yData(d.megawatts)})

  var yAxis = d3.axisLeft(yData)
    .ticks(10);

  // Draw Chart
  var chart = d3.select(".solar-progress-js").append('svg')
    .attr("width", owidth)
    .attr("height", oheight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  chart.append("g")
    .attr("transform", "translate(0," + cheight + ")")
    .call(xAxis)
  chart.append("g")
    .call(yAxis)
  chart.append('path')
    .data([data.past])
    .attr('class','line')
    .attr('stroke','black')
    .attr('fill','none')
    .attr('d', line)
    .attr('stroke-width',3)
  chart.append("path")
    .data([data.currentFuture])
    .attr('class','line')
    .attr('stroke','#0f0')
    .attr('fill', 'none')
    .attr('d', line)
    .attr('stroke-width',3)

}

// { all : Array DataPoint, past : Array DataPoint, currentFuture : Array DataPoint }
function generateDummyData() {
  var allYears = [];
  for (var year = 2005; year <= 2030; year++) {
    allYears.push(new Date(year + "/01/01"));
  }

  var data = allYears.map(function(date, index) {
      return {
        date : date,
        megawatts : randomIntGen(index * 3, (index * 3)+10)()
      }
  })

  var pastData = data.filter(function(d) {
    return yearBefore(d.date, new Date())
  })

  var currentFutureData = data.filter(function(d) {
    return !yearBefore(d.date, new Date()) ||
           d.date.getFullYear() == (new Date()).getFullYear();
  });

  return {
    all : data,
    past : pastData,
    currentFuture : currentFutureData
  }
}

// Date -> Date -> Boolean
function yearBefore(d1, d2) {
  return d1.getFullYear() <= d2.getFullYear();
}

// Int -> Int -> (Void -> Int)
function randomIntGen(a, b) {
  var max = Math.max(a, b);
  var min = Math.min(a, b);
  return function() {
    return Math.round(min + (Math.random() * (max - min)))
  }
}

return { run : run }
}());
document.addEventListener('DOMContentLoaded', App.run);
