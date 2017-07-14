var util = {}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
util.throttle = function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};


// Int -> Int -> (Void -> Int)
util.randomIntGen = function randomIntGen(a, b) {
  var max = Math.max(a, b);
  var min = Math.min(a, b);
  return function() {
    return Math.round(min + (Math.random() * (max - min)))
  }
}
// { past : Array DataPoint, future : Array DataPoint }
util.generateDummyData = function generateDummyData() {

  // Date -> Date -> Boolean
  function yearBefore(d1, d2) {
    return d1.getFullYear() < d2.getFullYear();
  }

  var allYears = [];
  for (var year = 2005; year <= 2030; year++) {
    allYears.push(new Date(year + "/01/01"));
  }

  var generateData = line_generator();
  var data = allYears.map(function(date, index) {
    return {
      date : date,
      value : generateData()
    }
  })

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

// Connect one series of data with another,
// by putting the last data point of the first
// as the first data point of the second.
util.connectDataTo = function(series1, series2) {
  return [series1[series1.length-1]].concat(series2);
}

util.ready = function(domReadyFn) {
  document.addEventListener('DOMContentLoaded', domReadyFn);
}

util.projectionDummyData = function() {

  var data1 = util.generateDummyData();

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

    // .concat(data1.futurePlus)
    // .concat(data1.futureMinus)

  return data1;
}
