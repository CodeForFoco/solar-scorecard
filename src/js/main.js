import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial);
Vue.use(VueRouter);

import * as RouteTemplates from './RouteTemplates';
import StairstepChart from './StairstepChart.js';
import PieChart from './PieChart.js';

Vue.component('home', RouteTemplates.home);
Vue.component('methodology', RouteTemplates.methodology);
Vue.component('about', RouteTemplates.about);
Vue.component('why-solar', RouteTemplates.whySolar);

// 1. Define route components.
const Home = { template: '<home></home>' };
const Methodology = { template: '<methodology></methodology>' };
const About = { template: '<about></about>' };
const WhySolar = { template: '<why-solar></why-solar>' };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
const routes = [
  { path: '/', component: Home },
  { path: '/why-solar', component: WhySolar },
  { path: '/methodology', component: Methodology },
  { path: '/about', component: About },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes, // short for `routes: routes`
});

import Main from '../App.vue';

Vue.component('solar-scorecard-stairstep', {
  mounted: function() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://opencity.fcgov.com/resource/ykei-s9zt.json');
    // This is so Socrata and the City knows who we are and our app
    //     it can often prevent API throttling
    xhr.setRequestHeader('X-App-Token', 'uGISPdpNnBfwN4kmj9goaZBNM');
    xhr.onload = function() {
      if (xhr.status === 200) {
        let xhrDataContainer = {
          data: {
            fortCollins: [],
          },
          selector: '#stairstep-chart-tabs',
        };
        xhrDataContainer.data.fortCollins = xhr.responseText;
        StairstepChart({
          selector: '#stairstep-chart',
          data: xhrDataContainer.data,
        });
      } else {
        alert('FoCo API request failed.  Returned status of ' + xhr.status);
      }
    };
    xhr.send();
  },
  template: '<canvas id="stairstep-chart" width="600" height="400"></canvas>',
});

Vue.component('solar-scorecard-ratios', {
  mounted: function() {
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
  },
  template: '<canvas id="pie-chart" width="600" height="200"></canvas>',
});

new Vue({
  router,
  methods: {
    goBack() {
      window.history.length > 1 ?
        this.$router.go(-1) :
        this.$router.push('/');
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
