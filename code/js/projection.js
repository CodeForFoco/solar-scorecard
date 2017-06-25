'use strict';

// Data should be
// ElectricData = { date : Date, megawatts : Number }
// { all :: Array ElectricData
// , past :: Array ElectricData,
// , currentFuture :: Array ElectricData }
function drawProjectionChart(context) {
  var data = context.data;

  console.log('Draw', context);

  // Draw Chart
  var root = d3.select(this).append('svg')
    .attr('class', 'root')
    .attr("width", context.width)
    .attr("height", context.height)

  var chart = root
    .append("g")
    .attr('class', "margin")
    .attr("transform", "translate(" + context.marginSize + "," + context.marginSize + ")");

  // Initial Rendering of chart...
  var xData = d3.scaleTime()
  .domain(d3.extent(data.all, function(d) {
    return d.date;
  }))
  .range([0, context.innerWidth]);

  var yData = d3.scaleLinear()
    .domain(d3.extent(data.all, function(d) {
      return d.megawatts;
    }))
    .range([context.innerHeight, 0]);

  var xAxis = d3.axisBottom(xData)
  .ticks(10)
  .tickFormat(d3.timeFormat("%Y"));
  //
  // var line = d3.line()
  //   .x(function(d) { return xData(d.date);})
  //   .y(function(d) {
  //     return yData(d.megawatts);
  //   });
  //
  var yAxis = d3.axisLeft(yData).ticks(10);

  chart.selectAll("g.xAxis")
    .data(data.all)
    .enter()
    .append('g').attr('class', 'xAxis')
    .attr("transform", "translate(0," + context.innerHeight + ")")
    .call(xAxis);

  chart.selectAll("g.yAxis")
    .data(data.all)
    .enter()
    .append('g').attr('class', 'yAxis')
    .call(yAxis);
  //
  // chart.selectAll('path.past')
  //   .data([data.past])
  //   .enter()
  //     .append('path')
  //     .attr('class', 'past line')
  //     .attr('stroke', 'black')
  //     .attr('fill', 'none')
  //     .attr('d', line)
  //     .attr('stroke-width', 3);
  //
  // chart.selectAll("path.future")
  //   .data([data.currentFuture])
  //   .enter()
  //   .append('path')
  //   .attr('class', 'future line')
  //   .attr('stroke', '#0f0')
  //   .attr('fill', 'none')
  //   .attr('d', line)
  //   .attr('stroke-width', 3);

  // chart.selectAll("text.yaxis")
  //   .enter()
  //   .append('text')
  //   .attr('class', 'yaxis')
  //   .attr('x', 0)
  //   .attr('y', 0)
  //   .text('KW')
  // Update the Chart
}

function updateProjectionChart(context) {

  console.log('Update', context);
  var data = context.data;

  var chart = d3.select(this);

  chart
    .attr("width", context.width)
    .attr("height", context.height)

  // Build Chart Scales and Components
  var xData = d3.scaleTime()
  .domain(d3.extent(data.all, function(d) { return d.date; }))
  .range([0, context.innerWidth]);

  var yData = d3.scaleLinear()
  .domain(d3.extent(data.all, function(d) {
    return d.megawatts;
  }))
  .range([context.innerHeight, 0]);

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
