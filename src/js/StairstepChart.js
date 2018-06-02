import Chart from 'chart.js';
import * as Util from "./Util";
import {cumulativeData, projectData} from "./main";
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
