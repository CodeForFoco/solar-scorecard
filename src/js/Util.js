import { LinearModel2d } from '../linear_model/Stats.js';

// Returns whatever is passed into it
export function identity(a) {
  return a;
}

// Array a -> a
export function first(a) {
  return a[0];
}

// Array a -> a
export function second(a) {
  return a[1];
}

// Array a -> Array a
export function cloneArray(a) {
  return a.concat();
}

// Array a -> a
export function tail(a) {
  return a.slice(-1)[0];
}

// Array a -> Array a -> Array (Array a)
export function zip(arr1, arr2) {
  let shorter = arr1.length <= arr2.length ? arr1 : arr2;

  return shorter.reduce(function(acc, _, index) {
    acc.push([arr1[index], arr2[index]]);

    return acc;
  }, []);
}

// Convert and array of [year,value] into
// and object seperating the values into past and future,
// where the current year is considered the future.
// Array [year, value] -> { past : Array DataPoint, future : Array DataPoint }
export function toYearlyFormat(origData) {
  let data = origData.map(function(val) {
    return {
      date: new Date('' + val[0] + '/01/01'),
      value: val[1],
    };
  });

  // Date -> Date -> Boolean
  function yearBefore(d1, d2) {
    return d1.getFullYear() < d2.getFullYear();
  }

  let pastData = data.filter(function(d) {
    return yearBefore(d.date, new Date());
  });

  let futureData = data.filter(function(d) {
    return (
      !yearBefore(d.date, new Date()) ||
      d.date.getFullYear() == new Date().getFullYear()
    );
  });

  return {
    past: pastData,
    future: futureData,
  };
}

// Connect one series of data with another,
// by putting the last data point of the first
// as the first data point of the second.
export function connectDataTo(series1, series2) {
  return [series1[series1.length - 1]].concat(series2);
}

// Array [year, value] -> {
//   all : Array { date : Date, value : Number },
//   past : Array { date : Date, value : Number },
//   future : Array { date : Date, value : Number },
//   futureMinus : Array { date : Date, value : Number },
//   futurePlus : Array { date : Date, value : Number }
// }
export function toProjectionFormat(data) {
  let yearlyData = toYearlyFormat(data);

  let linearmodel = new LinearModel2d(
    yearlyData.past.map(function(point) {
      return [point.date.getFullYear(), point.value];
    })
  );

  yearlyData.futurePlus = connectDataTo(
    yearlyData.past,
    yearlyData.future.map(function(point) {
      let year = point.date.getFullYear();
      let proj = linearmodel.project_r_squared(year, year - 2017 + 1);

      return {
        date: point.date,
        value: Math.round(proj[1]),
      };
    })
  );

  yearlyData.futureMinus = connectDataTo(
    yearlyData.past,
    yearlyData.future.map(function(point) {
      let year = point.date.getFullYear();
      let proj = linearmodel.project_r_squared(year, year - 2017 + 1);

      return {
        date: point.date,
        value: Math.round(proj[2]),
      };
    })
  );

  yearlyData.all = yearlyData.past.concat(yearlyData.future);

  return yearlyData;
}
