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

Vue.component('home', RouteTemplates.home);
Vue.component('get-involved', RouteTemplates.getInvolved);
Vue.component('about', RouteTemplates.about);
Vue.component('contact', RouteTemplates.contact);

// 1. Define route components.
const Home = { template: '<home></home>' };
const GetInvolved = { template: '<get-involved></get-involved>' };
const About = { template: '<about></about>' };
const Contact = { template: '<contact></contact>' };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
const routes = [
  { path: '/', component: Home },
  { path: '/get-involved', component: GetInvolved },
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

// { selector : String, data :: Array [year, value] }
export function run(options) {
  Tabs({
    tabs: [
      {
        id: 'projections',
        display: 'block',
        label: 'Projections',
        callback: function(element) {
          element.innerHTML =
            '<canvas id="stairstep-chart" width="600" height="400"></canvas>';
          StairstepChart({
            selector : "#stairstep-chart",
            data: options.data
          });
        },
      },
      {
        id: 'ratios',
        display: 'none',
        label: 'Ratios',
        callback: function(element) {
          element.innerHTML =
            '<canvas id="pie-chart" width="600" height="400"></canvas>';

          PieChart({
            selector: '#pie-chart',
            data: {
              Electric: 50,
              'Ground Travel': 26,
              'Natural Gas': 19,
              'Solid Waste': 4,
              'Water Related': 0.3,
            },
          });
        }
      }
    ]
  })
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
                        fortCollins: xhr.responseText
                    },
                });
            },
            router,
            methods: {
              goBack() {
                window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
              },
            },
            computed: {
              username() {
                // We will see what `params` is shortly
                return this.$route.params.username;
              },
            },
            render: h => h(Main),
        }).$mount('#app');
    }
    else {
        alert('FoCo API request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();
