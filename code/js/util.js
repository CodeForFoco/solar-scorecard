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
// { all : Array DataPoint, past : Array DataPoint, currentFuture : Array DataPoint }
util.generateDummyData = function generateDummyData() {

  // Date -> Date -> Boolean
  function yearBefore(d1, d2) {
    return d1.getFullYear() <= d2.getFullYear();
  }

  var allYears = [];
  for (var year = 2005; year <= 2030; year++) {
    allYears.push(new Date(year + "/01/01"));
  }

  var data = allYears.map(function(date, index) {
    return {
      date : date,
      megawatts : util.randomIntGen(index * 3, (index * 3)+15)()
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

util.ready = function(domReadyFn) {
  document.addEventListener('DOMContentLoaded', domReadyFn);
}
