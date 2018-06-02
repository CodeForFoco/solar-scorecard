import Chart from 'chart.js';
import * as Util from "./Util";
import {cumulativeData, projectData, runningTotal} from "./main";
import {LinearModel2d} from "../linear_model/Stats";

// { data : Array [year, value],
//   selector : SelectorString for Canvas Element,
//   element : CanvasElement }
export default function StairstepChart(config) {

    const boulderDataArray = (function() {
        return [
            [2006, 53],
            [2007, 548],
            [2008, 1399],
            [2009, 1765],
            [2010, 2371],
            [2011, 2072],
            [2012, 1409],
            [2013, 1903],
            [2014, 8791],
            [2015, 1136],
            [2016, 1556],
            [2017, 1812],
            [2018, 2097]
        ];
    }());

    function cumulativeData (data) {
        let years = data.map(Util.first);
        let values = data.map(Util.second);
        return Util.zip(years, runningTotal(values));
    }

    // LinearModel -> Array [year, value] -> {
    //   all : Array { date : Date, value : Number },
    //   past : Array { date : Date, value : Number },
    //   future : Array { date : Date, value : Number },
    //   futureMinus : Array { date : Date, value : Number },
    //   futurePlus : Array { date : Date, value : Number }
    // }
    // Will attempt to from 2016 to 2030.  Future data points are projected based on
    // past data.
    function projectData(linearmodel, origData) {
        // Clone the data so we won't modify the
        // original copy.
        let data = Util.cloneArray(origData)
            .map(Util.cloneArray);

        let lastYear = Util.tail(data)[0];
        // let linearmodel = new LinearModel2d(data);

        for (let year = lastYear + 1; year <= 2030; year++) {
            let projection = linearmodel.project_r_squared(year, year-lastYear+1);
            data.push([year, Math.round(projection[1])]);
        }

        return data;
    }

    // Array a -> Getter a a Number Number -> Array Number
    // Take an array of anything, and a function that gets numbers out of
    // the array, and return an array of cumulative values
     function runningTotal(data, lens) {
        lens = lens || Util.identity;
        let result = data.reduce(function(acc, value) {
            let current = lens(value) + acc.total;
            return {
                data : acc.data.concat([current]),
                total : current
            }
        }, { total : 0, data : [] });
        return result.data;
     }

    let boulderLinearModel = new LinearModel2d(boulderDataArray);
    let boulderData = projectData(
        boulderLinearModel,
        cumulativeData(boulderDataArray)
    );
    let foCoLinearModel = new LinearModel2d(config.data.fortCollins);
    let fcData = projectData(
        foCoLinearModel,
        cumulativeData(config.data.fortCollins)
    );

    let data = {
        boulder: Util.toProjectionFormat(boulderData),
        fortCollins: Util.toProjectionFormat(fcData)
    };

  let selector = config.selector;
  let element = config.element || document.querySelector(selector);
  if (!element) {
    throw new Error('Could not find a canvas element to bind the chart to. Attempted selector was "' + selector + '"')
  }

  let ctx = element.getContext('2d');

  // defining Chart colors
    const fcRealLine = 'hsl(207, 66%, 30%)';
    const fcProjectionLine = "hsl(207, 66%, 50%)";
    const fcBackground = 'hsl(207, 66%, 50%, .2)';
    const fcGoalLine = "hsl(207, 88%, 30%)";

    const boulderRealLine = 'hsl(16, 100%, 74%)';
    const boulderProjectionLine = "hsl(16, 100%, 82%)";
    const boulderBackground = 'hsl(16, 100%, 82%, .2)';

    new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.boulder.all.map(function(obj) {
        return obj.date.getFullYear();
      }),
      datasets: [
        {
          steppedLine: true,
          label: 'Total Boulder',
          data: data.boulder.past.map(function(obj) {
            return {x:obj.date.getFullYear(), y : obj.value};
          }),
          borderColor: boulderRealLine,
          backgroundColor: boulderBackground,
          borderWidth: 2
        },
        {
          steppedLine: true,
          label: 'Projected Boulder',
          data: data.boulder.futurePlus.map(function(obj) {
            return {x:obj.date.getFullYear(), y : obj.value};
          }),
          borderColor: boulderProjectionLine,
          backgroundColor: boulderBackground,
          borderWidth: 2,
            borderDash: [2,2]
        },
        {
            steppedLine: true,
            label: 'Total Fort Collins',
            data: data.fortCollins.past.map(function(obj) {
                return {x:obj.date.getFullYear(), y : obj.value};
            }),
            borderColor: fcRealLine,
            backgroundColor: fcBackground,
            borderWidth: 2
        },
        {
            steppedLine: true,
            label: 'Projected Fort Collins',
            data: data.fortCollins.futurePlus.map(function(obj) {
                return {x:obj.date.getFullYear(), y : obj.value};
            }),
            borderColor: fcProjectionLine,
            backgroundColor: fcBackground,
            borderWidth: 2,
            borderDash: [2,2]
        },
        {
          label: 'Fort Collins Climate Goal',
          data: [{x:2020,y:37348},{x:2030,y:149392}],
          backgroundColor: "transparent",
          borderColor: fcGoalLine,
          borderWidth: 2,
          borderDash: [10,5]
        }
      ]
    },
    responsive: true,
    maintainAspectRatio: true,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          },
          scaleLabel: {
            labelString: "kilowatts (kW)",
            display: true
          }
        }]
      }
    },

  });

}
