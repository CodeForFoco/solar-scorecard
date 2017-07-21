var util = {}

// Convert and array of [year,value] into
// and object seperating the values into past and future,
// where the current year is considered the future.
// Array [year, value] -> { past : Array DataPoint, future : Array DataPoint }
util.toYearlyFormat = function(data) {
  var data = data.map(function(val, index) {
    return {
      date : new Date(val[0] + "/01/01"),
      value : val[1]
    }
  })

  // Date -> Date -> Boolean
  function yearBefore(d1, d2) {
    return d1.getFullYear() < d2.getFullYear();
  }

  var pastData = data.filter(function(d) {
    return yearBefore(d.date, new Date())
  })

  var futureData = data.filter(function(d) {
    return !yearBefore(d.date, new Date()) ||
           d.date.getFullYear() == (new Date()).getFullYear();
  });

  return {
    past : pastData,
    future : futureData
  }
}

// Array [year, value]
util.generateDummyData = function generateDummyData() {
  var data = [];
  var generateData = line_generator();
  for (var year = 2005; year <= 2030; year++) {
    data.push([year, generateData()]);
  }
  return data;
}

// Connect one series of data with another,
// by putting the last data point of the first
// as the first data point of the second.
util.connectDataTo = function(series1, series2) {
  return [series1[series1.length-1]].concat(series2);
}

util.ready = function(domReadyFn) {
  document.addEventListener('DOMContentLoaded', domReadyFn);
}

// Array [year, value] -> {
//   all : Array { date : Date, value : Number },
//   past : Array { date : Date, value : Number },
//   future : Array { date : Date, value : Number },
//   futureMinus : Array { date : Date, value : Number },
//   futurePlus : Array { date : Date, value : Number }
// }
util.toProjectionFormat = function(data) {

  var data1 = util.toYearlyFormat(data);

  var linearmodel = new LinearModel2d(data1.past.map(function(point) {
    return [point.date.getFullYear(), point.value];
  }));

  data1.futurePlus = util.connectDataTo(
    data1.past,
    data1.future.map(function(point) {
      var year = point.date.getFullYear();
      // console.log(year, year-2017+1);
      var proj = linearmodel.project_r_squared(year, year-2017+1);
      console.log(proj[0], proj[1], proj[2])
      return {
        date : point.date,
        value : proj[1]
      }
    })
  );

  data1.futureMinus = util.connectDataTo(
    data1.past,
    data1.future.map(function(point) {
      var year = point.date.getFullYear();
      var proj = linearmodel.project_r_squared(year, year-2017+1);
      return {
        date : point.date,
        value : proj[2]
      }
    })
  );

  data1.all = data1.past.concat(data1.future);

  return data1;
}
