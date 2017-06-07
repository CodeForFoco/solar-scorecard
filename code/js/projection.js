'use strict';

// D3Selection -> ChartInterface
d3.projectionChart = function projectionChart() {

  // Outer Sizing
  var width = 960;
  var height = 500;
  var margin = {top: 30, right: 50, bottom: 60, left: 50};

  // Inner Sizing
  var cwidth = width - margin.left - margin.right;
  var cheight = height - margin.top - margin.bottom;
  var updateData = function() {};
  var data;

  var i = function(selection) {

    // Data should be
    // ElectricData = { date : Date, megawatts : Number }
    // { all :: Array ElectricData
    // , past :: Array ElectricData,
    // , currentFuture :: Array ElectricData }
    selection.each(function() {

      // Draw Chart
      var chart = d3.select(this).append('svg')
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // Build Chart Scales and Components
        var xData = d3.scaleTime()
        .domain(d3.extent(data.all, function(d) { return d.date; }))
        .range([0,cwidth])

        var yData = d3.scaleLinear()
        .domain(d3.extent(data.all, function(d) { return d.megawatts}))
        .range([cheight, 0])

        var xAxis = d3.axisBottom(xData)
        .ticks(10)
        .tickFormat(d3.timeFormat("%Y"))

        var line = d3.line()
          .x(function(d) { return xData(d.date);})
          .y(function(d) { return yData(d.megawatts)})

        var yAxis = d3.axisLeft(yData).ticks(10);

        chart.selectAll("g.xAxis")
          .data(data.all)
          .enter()
          .append('g').attr('class', 'xAxis')
          .attr("transform", "translate(0," + cheight + ")")
          .call(xAxis)

        chart.selectAll("g.yAxis")
          .data(data.all)
          .enter()
          .append('g').attr('class', 'yAxis')
          .call(yAxis)

        chart.selectAll('path.past')
          .data([data.past])
          .enter()
            .append('path')
            .attr('class', 'past line')
            .attr('stroke','black')
            .attr('fill','none')
            .attr('d', line)
            .attr('stroke-width', 3)

        chart.selectAll("path.future")
          .data([data.currentFuture])
          .enter()
          .append('path')
          .attr('class', 'future line')
          .attr('stroke', '#0f0')
          .attr('fill', 'none')
          .attr('d', line)
          .attr('stroke-width', 3)

      updateData = function() {

        // Build Chart Scales and Components
        var xData = d3.scaleTime()
        .domain(d3.extent(data.all, function(d) { return d.date; }))
        .range([0,cwidth])

        var yData = d3.scaleLinear()
        .domain(d3.extent(data.all, function(d) { return d.megawatts}))
        .range([cheight, 0])

        var xAxis = d3.axisBottom(xData)
        .ticks(10)
        .tickFormat(d3.timeFormat("%Y"))

        var line = d3.line()
          .x(function(d) { return xData(d.date);})
          .y(function(d) { return yData(d.megawatts)})

        var yAxis = d3.axisLeft(yData).ticks(10);

        chart.selectAll("g.xAxis")
          .transition()
          .duration(500)
          .call(xAxis)

        chart.selectAll("g.yAxis")
          .transition()
          .duration(500)
          .call(yAxis)

        d3.selectAll('path.future')
          .transition()
          .duration(500)
          .attr('d', line)

        d3.selectAll('path.past')
          .transition()
          .duration(500)
          .attr('d', line)


      }


    })
  }

  // http://bl.ocks.org/cpbotha/5073718
  // https://bost.ocks.org/mike/chart/
  // https://groups.google.com/forum/#!topic/d3-js/Wh85AE_mS1Q
  // https://bl.ocks.org/rcmoore38/9f2908455355c0589619

  i.data = function(d) {
    data = d;
    updateData();
    return i;
  }

  i.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return i;
  }

  i.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return i;
  }

  i.update = function() {
    updateData();
  }

  return i;

}

// { all : Array DataPoint, past : Array DataPoint, currentFuture : Array DataPoint }
d3.projectionChart.generateDummyData = function generateDummyData() {

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

  var allYears = [];
  for (var year = 2005; year <= 2030; year++) {
    allYears.push(new Date(year + "/01/01"));
  }

  var data = allYears.map(function(date, index) {
      return {
        date : date,
        megawatts : randomIntGen(index * 3, (index * 3)+15)()
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

d3.projectionChart.ready = function(domReadyFn) {
  document.addEventListener('DOMContentLoaded', domReadyFn);
}
