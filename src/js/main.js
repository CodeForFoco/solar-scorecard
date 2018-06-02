import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import 'vue-material/dist/theme/default.css';
Vue.use(VueMaterial);

import { LinearModel2d } from '../linear_model/Stats.js';
import Tabs from './Tabs.js';
import * as Util from './Util.js';
import StairstepChart from './StairstepChart.js';
import PieChart from './PieChart.js';

import Main from '../App.vue';

// Array a -> Getter a a Number Number -> Array Number
// Take an array of anything, and a function that gets numbers out of
// the array, and return an array of cumulative values  
export function runningTotal(data, lens) {
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

// { selector : String, data :: Array [year, value] }
export function run(options) {

  let boulderLinearModel = new LinearModel2d(options.data.boulder);
  let boulderData = projectData(
      boulderLinearModel,
    cumulativeData(options.data.boulder)
  );
  let foCoLinearModel = new LinearModel2d(options.data.fortCollins);
  let fcData = projectData(
      foCoLinearModel,
      cumulativeData(options.data.fortCollins)
  );

  let stairstepData = {
    boulder: Util.toProjectionFormat(boulderData),
    fortCollins: Util.toProjectionFormat(fcData)
  };

  Tabs({
    tabs : [
      {
        id: 'projections',
        display: 'block',
        label: 'Projections',
        callback : function(element) {
          element.innerHTML='<canvas id="stairstep-chart" width="600" height="400"></canvas>';
          StairstepChart({
            selector : "#stairstep-chart",
            data: stairstepData
          });
        } 
      }, {
        id: 'ratios',
        display: 'none',
        label: 'Ratios',
        callback : function(element) {
          element.innerHTML='<canvas id="pie-chart" width="600" height="400"></canvas>';

          PieChart({
            selector : "#pie-chart",
            data: {
              "Electric":50,
              "Ground Travel":26,
              "Natural Gas":19,
              "Solid Waste":4,
              "Water Related":.3
            }
          });
        }
      }
    ]
  })
}

export let boulderData = (function() {
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
    [2017, 595],
  ];
}());

let fortCollinsDataProcessor = function(apiRawResponse) {
    const apiResponse = JSON.parse(apiRawResponse);
    let aggregatedByYear = {};
    apiResponse.forEach((r) => {
        let regex = /\d+\/\d+\/(\d+) \d+:\d+:\d+/;
        const regSearchResult = regex.exec(r.date_of_service);
        if (regSearchResult == null) return;
        const year = regSearchResult[1];
        const previousValue = aggregatedByYear[year] ? aggregatedByYear[year]: 0;
        aggregatedByYear[year] = previousValue + parseFloat(r.system_capacity_kw_dc);
    });

    return Object.keys(aggregatedByYear).map(function(key) {
        return [Number(key), Math.round(aggregatedByYear[key])];
    });
};

// Array [year, value] -> Array [year, value]
export function cumulativeData (data) {
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
export function projectData(linearmodel, origData) {
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

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://opencity.fcgov.com/resource/ykei-s9zt.json');
xhr.onload = function() {
    if (xhr.status === 200) {
        new Vue({
            mounted() {
                run({
                    selector: '#stairstep-chart-tabs',
                    data: {
                        boulder: boulderData,
                        fortCollins: fortCollinsDataProcessor(xhr.responseText)
                    },
                });
            },
            render: h => h(Main),
        }).$mount('#app');
    }
    else {
        alert('FoCo API request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();
