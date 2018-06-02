import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial);
Vue.use(VueRouter);

import { LinearModel2d } from '../linear_model/Stats.js';
import * as RouteTemplates from './RouteTemplates';
import * as Util from './Util.js';
import Tabs from './Tabs.js';
import StairstepChart from './StairstepChart.js';
import PieChart from './PieChart.js';

Vue.component('home-component', RouteTemplates.home);
Vue.component('about-component', RouteTemplates.about);
Vue.component('contact-component', RouteTemplates.contact);

// 1. Define route components.
const Home = { template: '<home-component></home-component>' };
const About = { template: '<about-component></about-component>' };
const Contact = { template: '<contact-component></contact-component>' };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for `routes: routes`
});

import Main from '../App.vue';

// Array a -> Getter a a Number Number -> Array Number
// Take an array of anything, and a function that gets numbers out of
// the array, and return an array of cumulative values  
export function runningTotal(data, lens) {
  lens = lens || Util.identity;
  let result = data.reduce(function(acc, value) {
    var current = lens(value) + acc.total;
    return {
      data : acc.data.concat([current]),
      total : current
    }
  }, { total : 0, data : [] });
  return result.data;  
}

// { selector : String, data :: Array [year, value] }
export function run(options) {

  let linearmodel = new LinearModel2d(options.data);
  let data = projectData(
    linearmodel,
    cumulativeData(options.data)
  );
  let selector = options.selector;

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
            data: Util.toProjectionFormat(data)
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

      // {
      //   id : "ratios",
      //   label : "Ratios",
      //   callback : function(element) {
      //     element.innerHTML='<canvas id="pie-chart" width="600" height="400"></canvas>';

      //     PieChart({
      //       selector : "#pie-chart",
      //       data: {
      //         "Electric":50,
      //         "Ground Travel":26,
      //         "Natural Gas":19,
      //         "Solid Waste":4,
      //         "Water Related":.3
      //       }
      //     });
      //   }
      // },
      // {
      //   id : "projections",
      //   label : "Projections",
      //   callback : function(element) {
      //     element.innerHTML='<canvas id="stairstep-chart" width="600" height="400"></canvas>';
      //     StairstepChart({
      //       selector : "#stairstep-chart",
      //       data: Util.toProjectionFormat(data)
      //     });
      //   }
      // },

    ]
  })
};

// Built in Document.ready
// function for convenience
export function ready(fn) {
  Util.ready(fn);
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

// Array [year, value] -> Array [year, value]
export function cumulativeData (data) {
  let years = data.map(Util.first);
  let values = data.map(Util.second);
  return Util.zip(years, runningTotal(values));
}; 
  
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
  let firstYear = data[0][0];
  // let linearmodel = new LinearModel2d(data);
    
  for (var year = lastYear + 1; year <= 2030; year++) {
    var projection = linearmodel.project_r_squared(year, year-lastYear+1);
    data.push([year, Math.round(projection[1])]);
  }

  return data;
}

const app = new Vue({
  mounted() {
    run({
      selector: '#stairstep-chart-tabs',
      data: boulderData,
    });
  },
  router,
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
  },
  render: h => h(Main),
  computed: {
    username() {
      // We will see what `params` is shortly
      return this.$route.params.username;
    },
  },
}).$mount('#app');

export default SolarScorecard;
