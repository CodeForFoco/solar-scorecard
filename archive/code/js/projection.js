'use strict';

// Data should be
// ElectricData = { date : Date, value : Number }
// { all :: Array ElectricData
// , past :: Array ElectricData,
// , futurePlus :: Array ElectricData
// , futureMinus :: Array ElectricData }
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
  var xData = d3
    .scaleTime()
    .domain(d3.extent(data.all, function(d) {
      return d.date;
    }))
    .range([0, context.innerWidth]);

  var yData = d3.scaleLinear()
    .domain(d3.extent(data.all, function(d) {
      return d.value;
    }))
    .range([context.innerHeight, 0]);

  var xAxis = d3.axisBottom(xData)
    .ticks(10)
    .tickFormat(d3.timeFormat("%Y"));

  var line = d3.line()
    .x(function(d) { return xData(d.date);})
    .y(function(d) {
      return yData(d.value);
    });

  var yAxis = d3.axisLeft(yData).ticks(10);

  chart.selectAll("g.xAxis")
    .data(data.past)
    .enter()
    .append('g').attr('class', 'xAxis')
    .attr("transform", "translate(0," + context.innerHeight + ")")
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
      .attr('d', line)

  chart.selectAll("path.futurePlus")
    .data([data.futurePlus])
    .enter()
    .append('path')
    .attr('class', 'future-plus line')
    .attr('d', line)

  chart.selectAll("path.futureMinus")
    .data([data.futureMinus])
    .enter()
    .append('path')
    .attr('class', 'future-minus line')
    .attr('d', line)

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

  var root = d3.select(this).select('.root');
  var chart = d3.select(this).select('.root.margin');

  root
    .attr("width", context.width)
    .attr("height", context.height)

  var xData = d3
    .scaleTime()
    .domain(d3.extent(data.all, function(d) {
      return d.date;
    }))
    .range([0, context.innerWidth]);

  var yData = d3.scaleLinear()
    .domain(d3.extent(data.all, function(d) {
      return d.value;
    }))
    .range([context.innerHeight, 0]);

  var xAxis = d3.axisBottom(xData)
    .ticks(10)
    .tickFormat(d3.timeFormat("%Y"));

  var line = d3.line()
    .x(function(d) { return xData(d.date);})
    .y(function(d) {
      return yData(d.value);
    });

  var yAxis = d3.axisLeft(yData).ticks(10);

  chart.selectAll("g.xAxis").call(xAxis);
  chart.selectAll("g.yAxis").call(yAxis);
  chart.selectAll('path.futurePlus').attr('d', line);
  chart.selectAll('path.futureMinus').attr('d', line);
  chart.selectAll('path.past').attr('d', line);

};
