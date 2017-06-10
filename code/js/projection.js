'use strict';

// D3Selection -> ChartInterface
d3.projectionChart = function projectionChart() {

  // Default Sizing
  var innerWidth, innerHeight, data;
  var width = 900, height = 500;
  var minMargin = 50;
  var margin = {top: 30, right: 50, bottom: 60, left: 50};

  function setWidth(value) {
    width = value;
    var marginSize = width * .05;
    margin.right = Math.max(marginSize, minMargin);
    margin.left = Math.max(marginSize, minMargin);
    innerWidth = width - margin.left - margin.right;
  }

  function setHeight(value) {
    height = value;
    var marginSize = width * .05;
    margin.right = Math.max(marginSize, minMargin);
    margin.left = Math.max(marginSize, minMargin);
    innerHeight = height - margin.top - margin.bottom;
  }

  setWidth(width);
  setHeight(height);
  var updateView = function() {};

  // We'll assume selection returns a single element.
  // If multiple elements are returned they will all
  // share the same display variables.
  var i = function(selection) {

    // Data should be
    // ElectricData = { date : Date, megawatts : Number }
    // { all :: Array ElectricData
    // , past :: Array ElectricData,
    // , currentFuture :: Array ElectricData }
    selection.each(function() {

      // Draw Chart
      var root = d3.select(this).append('svg')
        .attr('class', 'root')
        .attr("width", width)
        .attr("height", height)

      var chart = root
        .append("g")
        .attr('class', "margin")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Initial Rendering of chart...
      var xData = d3.scaleTime()
      .domain(d3.extent(data.all, function(d) {
        return d.date;
      }))
      .range([0, innerWidth]);

      var yData = d3.scaleLinear()
        .domain(d3.extent(data.all, function(d) {
          return d.megawatts;
        }))
        .range([innerHeight, 0]);

      var xAxis = d3.axisBottom(xData)
      .ticks(10)
      .tickFormat(d3.timeFormat("%Y"));

      var line = d3.line()
        .x(function(d) { return xData(d.date);})
        .y(function(d) {
          return yData(d.megawatts);
        });

      var yAxis = d3.axisLeft(yData).ticks(10);

      chart.selectAll("g.xAxis")
        .data(data.all)
        .enter()
        .append('g').attr('class', 'xAxis')
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(xAxis);

      chart.selectAll("g.yAxis")
        .data(data.all)
        .enter()
        .append('g').attr('class', 'yAxis')
        .call(yAxis);

      chart.selectAll('path.past')
        .data([data.past])
        .enter()
          .append('path')
          .attr('class', 'past line')
          .attr('stroke', 'black')
          .attr('fill', 'none')
          .attr('d', line)
          .attr('stroke-width', 3);

      chart.selectAll("path.future")
        .data([data.currentFuture])
        .enter()
        .append('path')
        .attr('class', 'future line')
        .attr('stroke', '#0f0')
        .attr('fill', 'none')
        .attr('d', line)
        .attr('stroke-width', 3);

      // Update the Chart
      updateView = function() {

        console.log(width, height)
        // chart.each(function() {
        root
          .attr("width", width)
          .attr("height", height)

        root.selectAll('g.margin')
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );
          // .selectAll("g")
          // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // })

        // Build Chart Scales and Components
        var xData = d3.scaleTime()
        .domain(d3.extent(data.all, function(d) { return d.date; }))
        .range([0, innerWidth]);

        var yData = d3.scaleLinear()
        .domain(d3.extent(data.all, function(d) {
          return d.megawatts;
        }))
        .range([innerHeight, 0]);

        var xAxis = d3.axisBottom(xData)
        .ticks(10)
        .tickFormat(d3.timeFormat("%Y"));

        var line = d3.line()
          .x(function(d) { return xData(d.date); })
          .y(function(d) { return yData(d.megawatts); });

        var yAxis = d3.axisLeft(yData).ticks(10);

        chart.selectAll("g.xAxis")
          .call(xAxis);

        chart.selectAll("g.yAxis")
          .call(yAxis);

        chart.selectAll('path.future')
          .attr('d', line);

        chart.selectAll('path.past')
          .attr('d', line);

      };
    });
  };

  // Original Idea Back in 2012
  // http://bl.ocks.org/cpbotha/5073718
  // https://bost.ocks.org/mike/chart/

  // Discussion on using same idea in version 4
  // https://groups.google.com/forum/#!topic/d3-js/Wh85AE_mS1Q
  // Example using d3 version 4
  // https://bl.ocks.org/rcmoore38/9f2908455355c0589619

  i.data = function(d) {
    data = d;
    return i;
  };

  i.width = function(value) {
    if (!arguments.length) return width;
    setWidth(value);
    updateView();
    return i;
  };

  i.height = function(value) {
    if (!arguments.length) return height;
    setHeight(value);
    updateView();
    return i;
  };

  i.update = function() {
    updateView();
  };

  return i;

}
