import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import 'vue-material/dist/theme/default.css';
Vue.use(VueMaterial);

import Tabs from './Tabs.js';
import StairstepChart from './StairstepChart.js';
import PieChart from './PieChart.js';

import Main from '../App.vue';

// { selector : String, data :: Array [year, value] }
export function run(options) {
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
            data: options.data
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

let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://opencity.fcgov.com/resource/ykei-s9zt.json');
xhr.onload = function() {
    if (xhr.status === 200) {
        new Vue({
            mounted() {
                run({
                    selector: '#stairstep-chart-tabs',
                    data: {
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
