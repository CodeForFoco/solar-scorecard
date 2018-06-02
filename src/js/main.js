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

const fcApiResp = '[{"date_of_service":"6/1/1987 0:00:00","system_address":"2000 EAST HORSETOOTH RD","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"12/15/1999 0:00:00","system_address":"4418 GOSHAWK","system_capacity_kw_dc":"1.00"}\n' +
',{"date_of_service":"9/10/2004 0:00:00","system_address":"5400 ZIEGLER ROAD","system_capacity_kw_dc":"1.80"}\n' +
',{"date_of_service":"9/10/2004 0:00:00","system_address":"5400 ZIEGLER ROAD","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"6/16/2005 0:00:00","system_address":"4225 TABLE MOUNTAIN","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"8/31/2005 0:00:00","system_address":"208 FISHBACK","system_capacity_kw_dc":"2.50"}\n' +
',{"date_of_service":"10/14/2005 0:00:00","system_address":"1427 WEST MOUNTAIN","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"10/14/2005 0:00:00","system_address":"318 WHEDBEE","system_capacity_kw_dc":"1.80"}\n' +
',{"date_of_service":"4/18/2006 0:00:00","system_address":"1327 WEST MAGNOLIA","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"6/26/2006 0:00:00","system_address":"807 SHORE PINE COURT *","system_capacity_kw_dc":"3.80"}\n' +
',{"date_of_service":"9/13/2006 0:00:00","system_address":"139 EAST HARVARD","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"10/25/2006 0:00:00","system_address":"4700 SOUTH COLLEGE AVE","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"11/7/2006 0:00:00","system_address":"3415 HEARTHFIRE DRIVE","system_capacity_kw_dc":"1.80"}\n' +
',{"date_of_service":"3/30/2007 0:00:00","system_address":"3442 SUN DISK COURT","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"5/31/2007 0:00:00","system_address":"2275 BELLWETHER LANE","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"6/1/2007 0:00:00","system_address":"3221 EASTBROOK AVE","system_capacity_kw_dc":"2.00"}\n' +
',{"date_of_service":"5/20/2008 0:00:00","system_address":"130 PALMER DR.","system_capacity_kw_dc":"4.75"}\n' +
',{"date_of_service":"5/28/2008 0:00:00","system_address":"148 REMINGTON","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"6/23/2008 0:00:00","system_address":"215 PASCAL","system_capacity_kw_dc":"2.00"}\n' +
',{"date_of_service":"11/11/2008 0:00:00","system_address":"4151 CENTER GATE COURT","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"11/18/2008 0:00:00","system_address":"1903 MESA VIEW LN.","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"11/29/2008 0:00:00","system_address":"3346 EGRET CT.","system_capacity_kw_dc":"2.10"}\n' +
',{"date_of_service":"1/5/2009 0:00:00","system_address":"1815 LAPORTE AVE.","system_capacity_kw_dc":"2.50"}\n' +
',{"date_of_service":"1/28/2009 0:00:00","system_address":"1125 W. OAK ST.","system_capacity_kw_dc":"2.10"}\n' +
',{"date_of_service":"1/28/2009 0:00:00","system_address":"806 W. MAGNOLIA","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"1/28/2009 0:00:00","system_address":"924 SYCAMORE ST.","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"2/6/2009 0:00:00","system_address":"805 BIRKY PLACE","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"2/11/2009 0:00:00","system_address":"2333 TARRAGON LANE","system_capacity_kw_dc":"7.40"}\n' +
',{"date_of_service":"2/11/2009 0:00:00","system_address":"2813 DIXON CREEK LN.","system_capacity_kw_dc":"2.00"}\n' +
',{"date_of_service":"3/31/2009 0:00:00","system_address":"625 HINSDALE DRIVE","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"4/6/2009 0:00:00","system_address":"4850 INNOVATION DRIVE","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"4/29/2009 0:00:00","system_address":"2749 COAL BANK DRIVE","system_capacity_kw_dc":"2.40"}\n' +
',{"date_of_service":"5/15/2009 0:00:00","system_address":"1506 BRENTFORD LANE","system_capacity_kw_dc":"3.70"}\n' +
',{"date_of_service":"5/15/2009 0:00:00","system_address":"2615 LUTHER LANE","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"5/15/2009 0:00:00","system_address":"2931 GARRETT DR","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"6/5/2009 0:00:00","system_address":"1257 BELLEVIEW","system_capacity_kw_dc":"1.60"}\n' +
',{"date_of_service":"6/15/2009 0:00:00","system_address":"257 PASCAL ST.","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"6/17/2009 0:00:00","system_address":"1800 W. MULBERRY","system_capacity_kw_dc":"7.40"}\n' +
',{"date_of_service":"6/22/2009 0:00:00","system_address":"315 WAYNE ST.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"6/23/2009 0:00:00","system_address":"CSU ENGR. BLDG","system_capacity_kw_dc":"18.90"}\n' +
',{"date_of_service":"9/1/2009 0:00:00","system_address":"CSU ACADEMIC VILLAGE","system_capacity_kw_dc":"12.60"}\n' +
',{"date_of_service":"11/30/2009 0:00:00","system_address":"NBB PACKAGING HALL","system_capacity_kw_dc":"180.00"}\n' +
',{"date_of_service":"12/22/2009 0:00:00","system_address":"2631 STANFORD","system_capacity_kw_dc":"12.70"}\n' +
',{"date_of_service":"1/4/2010 0:00:00","system_address":"2100 E. PROSPECT","system_capacity_kw_dc":"2.45"}\n' +
',{"date_of_service":"4/20/2010 0:00:00","system_address":"215 N. MASON","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"6/15/2010 0:00:00","system_address":"412 GARFIELD ST","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"6/15/2010 0:00:00","system_address":"701 EASTDALE DRIVE","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"7/1/2010 0:00:00","system_address":"6109 ESTUARY CT.","system_capacity_kw_dc":"7.70"}\n' +
',{"date_of_service":"7/9/2010 0:00:00","system_address":"123 N. MACK ST.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"7/12/2010 0:00:00","system_address":"331 E. SATURN","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"7/12/2010 0:00:00","system_address":"404 PARK ST.","system_capacity_kw_dc":"2.40"}\n' +
',{"date_of_service":"7/19/2010 0:00:00","system_address":"1901 WALLENBERG DR","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"7/19/2010 0:00:00","system_address":"4312 MILL CREEK CT.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"7/29/2010 0:00:00","system_address":"207 N. GRANT","system_capacity_kw_dc":"1.60"}\n' +
',{"date_of_service":"8/2/2010 0:00:00","system_address":"1801 JAMISON CT.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"8/2/2010 0:00:00","system_address":"3201 ALUMBAUGH CT.","system_capacity_kw_dc":"9.20"}\n' +
',{"date_of_service":"8/6/2010 0:00:00","system_address":"5238 KEYSTONE CREEK CT.","system_capacity_kw_dc":"4.10"}\n' +
',{"date_of_service":"8/10/2010 0:00:00","system_address":"2267 CLYDESDALE DR.","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"8/20/2010 0:00:00","system_address":"1008 SUNSET","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"8/20/2010 0:00:00","system_address":"331 SMITH ST.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"8/20/2010 0:00:00","system_address":"718 BLUE TEAL DRIVE","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"9/1/2010 0:00:00","system_address":"2642 MIDPOINT DRIVE","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"9/8/2010 0:00:00","system_address":"1012 SUNSET","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"9/8/2010 0:00:00","system_address":"2214 COCKLEBUR LN","system_capacity_kw_dc":"2.15"}\n' +
',{"date_of_service":"9/8/2010 0:00:00","system_address":"4838 PRAIRIE VISTA DRIVE","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"9/14/2010 0:00:00","system_address":"1400 BEECH CT.","system_capacity_kw_dc":"2.20"}\n' +
',{"date_of_service":"9/22/2010 0:00:00","system_address":"3321 SNOWBRUSH CT.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"9/22/2010 0:00:00","system_address":"3516 SILVER TRAILS","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"9/22/2010 0:00:00","system_address":"5814 FOSSIL CREEK PKWY","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"10/19/2010 0:00:00","system_address":"1503 SEA WOLF CT.","system_capacity_kw_dc":"3.68"}\n' +
',{"date_of_service":"10/20/2010 0:00:00","system_address":"642 YARROW CIRCLE","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"11/8/2010 0:00:00","system_address":"6037 AUBURN DRIVE","system_capacity_kw_dc":"2.90"}\n' +
',{"date_of_service":"11/15/2010 0:00:00","system_address":"260 EAST MOUNTAIN AVE.","system_capacity_kw_dc":"20.40"}\n' +
',{"date_of_service":"11/19/2010 0:00:00","system_address":"2506 SHAVANO CT.","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"11/19/2010 0:00:00","system_address":"2821 GARRETT DR","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"11/19/2010 0:00:00","system_address":"2932 DES MOINES DR","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"12/10/2010 0:00:00","system_address":"1901 E. PROSPECT","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"1/3/2011 0:00:00","system_address":"NORTHSIDE AZTLAN CENTER","system_capacity_kw_dc":"50.00"}\n' +
',{"date_of_service":"1/6/2011 0:00:00","system_address":"2620 E. PROSPECT RD.","system_capacity_kw_dc":"10.30"}\n' +
',{"date_of_service":"1/21/2011 0:00:00","system_address":"320 EAST VINE DRIVE","system_capacity_kw_dc":"44.00"}\n' +
',{"date_of_service":"1/25/2011 0:00:00","system_address":"908 PEAR ST.","system_capacity_kw_dc":"2.30"}\n' +
',{"date_of_service":"2/10/2011 0:00:00","system_address":"212 W. MULBERRY STREET","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"3/29/2011 0:00:00","system_address":"124 FISHBACK","system_capacity_kw_dc":"2.30"}\n' +
',{"date_of_service":"3/30/2011 0:00:00","system_address":"1900 WALLENBERG DRIVE","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"3/30/2011 0:00:00","system_address":"3563 BEAR RIVER CT.","system_capacity_kw_dc":"3.40"}\n' +
',{"date_of_service":"3/30/2011 0:00:00","system_address":"632 AGAPE WAY","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"4/22/2011 0:00:00","system_address":"1921 WALLENBERG DR.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"5/5/2011 0:00:00","system_address":"2712 BLACKSTONE DR.","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"5/25/2011 0:00:00","system_address":"1004 COMMANCHE DR.","system_capacity_kw_dc":"3.50"}\n' +
',{"date_of_service":"5/29/2011 0:00:00","system_address":"900 WHALERS WAY","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"6/1/2011 0:00:00","system_address":"1256 TWINFLOWER PL.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"6/1/2011 0:00:00","system_address":"330 SMITH STREET","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"6/22/2011 0:00:00","system_address":"123 S. SHERWOOD ST.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"6/22/2011 0:00:00","system_address":"1231 LIVE OAK CT.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"7/1/2011 0:00:00","system_address":"165 COLBOARD DRIVE","system_capacity_kw_dc":"10.10"}\n' +
',{"date_of_service":"7/1/2011 0:00:00","system_address":"4720 PRAIRIE VISTA","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"7/13/2011 0:00:00","system_address":"1980 WELCH ST. UNIT 31","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"7/13/2011 0:00:00","system_address":"3308 GRAND CANYON ST","system_capacity_kw_dc":"3.80"}\n' +
',{"date_of_service":"7/13/2011 0:00:00","system_address":"519 NORTH GRANT AVE.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"7/13/2011 0:00:00","system_address":"6111 S. TIMBERLINE RD.","system_capacity_kw_dc":"6.10"}\n' +
',{"date_of_service":"7/15/2011 0:00:00","system_address":"1409 SHEEP CREEK CT.","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"7/15/2011 0:00:00","system_address":"3345 W. PROSPECT","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"7/15/2011 0:00:00","system_address":"6586 ROOKERY RD.","system_capacity_kw_dc":"5.60"}\n' +
',{"date_of_service":"8/15/2011 0:00:00","system_address":"5846 S. COLLEGE AVE.","system_capacity_kw_dc":"10.10"}\n' +
',{"date_of_service":"8/30/2011 0:00:00","system_address":"3742 BENTHAVEN ST","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"9/1/2011 0:00:00","system_address":"1900 SHEELY DRIVE","system_capacity_kw_dc":"3.50"}\n' +
',{"date_of_service":"9/7/2011 0:00:00","system_address":"807 ROCHELLE CIRCLE","system_capacity_kw_dc":"3.15"}\n' +
',{"date_of_service":"9/23/2011 0:00:00","system_address":"1614 OAKRIDGE DRIVE","system_capacity_kw_dc":"10.10"}\n' +
',{"date_of_service":"9/23/2011 0:00:00","system_address":"613 FLAGLER RD.","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"9/26/2011 0:00:00","system_address":"4225 FALL RIVER DR.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"10/7/2011 0:00:00","system_address":"2005 FORD LANE","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"10/7/2011 0:00:00","system_address":"3020 PHOENIX DR","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"10/7/2011 0:00:00","system_address":"6119 PARAGON","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"10/20/2011 0:00:00","system_address":"408 MASON CT","system_capacity_kw_dc":"27.10"}\n' +
',{"date_of_service":"10/20/2011 0:00:00","system_address":"408 MASON CT.","system_capacity_kw_dc":"8.60"}\n' +
',{"date_of_service":"11/3/2011 0:00:00","system_address":"209 S. MELDRUM","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"11/22/2011 0:00:00","system_address":"5239 FOX HILLS DR","system_capacity_kw_dc":"8.60"}\n' +
',{"date_of_service":"11/30/2011 0:00:00","system_address":"150 N. FREY AVENUE","system_capacity_kw_dc":"1.90"}\n' +
',{"date_of_service":"11/30/2011 0:00:00","system_address":"3027 EAST HARMONY ROAD","system_capacity_kw_dc":"10.10"}\n' +
',{"date_of_service":"11/30/2011 0:00:00","system_address":"3555 STANFORD ROAD","system_capacity_kw_dc":"10.10"}\n' +
',{"date_of_service":"12/28/2011 0:00:00","system_address":"4927 CARAVELLE DR.","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"3/12/2012 0:00:00","system_address":"2640 EAST HARMONY ROAD","system_capacity_kw_dc":"8.60"}\n' +
',{"date_of_service":"4/9/2012 0:00:00","system_address":"1008 SUNSET AVENUE","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"4/9/2012 0:00:00","system_address":"5235 APPLE DRIVE","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"4/9/2012 0:00:00","system_address":"5328 PARADISE LN.","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"4/24/2012 0:00:00","system_address":"2421 ROCK CREEK DRIVE","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"4/25/2012 0:00:00","system_address":"415 MASON CT. UNIT 7A","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"5/14/2012 0:00:00","system_address":"816 PETERSON STREEET","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"5/21/2012 0:00:00","system_address":"2911 MOORE LANE","system_capacity_kw_dc":"8.30"}\n' +
',{"date_of_service":"5/24/2012 0:00:00","system_address":"2813 CHERRYSTONE PLACE","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"6/20/2012 0:00:00","system_address":"3339 W PROSPECT RD","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"6/27/2012 0:00:00","system_address":"4918 HINSDALE DR","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"7/12/2012 0:00:00","system_address":"1506 RED SKY CT.","system_capacity_kw_dc":"12.20"}\n' +
',{"date_of_service":"7/17/2012 0:00:00","system_address":"1901 LONGWORTH RD","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"8/7/2012 0:00:00","system_address":"615 AGATE CT","system_capacity_kw_dc":"4.30"}\n' +
',{"date_of_service":"8/8/2012 0:00:00","system_address":"1901 LONGWORTH RD","system_capacity_kw_dc":"7.80"}\n' +
',{"date_of_service":"8/13/2012 0:00:00","system_address":"319 N WHITCOMB ST","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"8/22/2012 0:00:00","system_address":"144 N. FREY AVENUE","system_capacity_kw_dc":"2.20"}\n' +
',{"date_of_service":"8/22/2012 0:00:00","system_address":"2637 MOORE LANE","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"8/22/2012 0:00:00","system_address":"5802 FOSSIL CREEK PARKWAY","system_capacity_kw_dc":"4.30"}\n' +
',{"date_of_service":"9/13/2012 0:00:00","system_address":"1312 SPRINGFIELD DR.","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"9/13/2012 0:00:00","system_address":"1906 BEAR CT.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"9/13/2012 0:00:00","system_address":"1936 JAMISON DRIVE","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"9/13/2012 0:00:00","system_address":"2203 BALDWIN ST.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"9/13/2012 0:00:00","system_address":"6319 CATTAIL COURT","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"9/13/2012 0:00:00","system_address":"728 ROCKY RD.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"9/17/2012 0:00:00","system_address":"1201 HAWKEYE CT.","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"9/18/2012 0:00:00","system_address":"2854 BLUE LEAF DRIVE","system_capacity_kw_dc":"9.80"}\n' +
',{"date_of_service":"9/18/2012 0:00:00","system_address":"2936 EINDBOROUGH DRIVE","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"9/18/2012 0:00:00","system_address":"950 SOUTHRIDGE #42","system_capacity_kw_dc":"4.10"}\n' +
',{"date_of_service":"10/1/2012 0:00:00","system_address":"1521 WASP COURT","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"10/1/2012 0:00:00","system_address":"900 GROUSE CIRCLE","system_capacity_kw_dc":"5.30"}\n' +
',{"date_of_service":"10/5/2012 0:00:00","system_address":"230 CIRCLE DR.","system_capacity_kw_dc":"9.36"}\n' +
',{"date_of_service":"10/19/2012 0:00:00","system_address":"1100 WHITE OAK COURT","system_capacity_kw_dc":"6.20"}\n' +
',{"date_of_service":"10/19/2012 0:00:00","system_address":"1308 BENNETT RD","system_capacity_kw_dc":"5.39"}\n' +
',{"date_of_service":"10/19/2012 0:00:00","system_address":"2807 MCKEAG DR.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"10/22/2012 0:00:00","system_address":"2224 CEDARWOOD DR.","system_capacity_kw_dc":"5.28"}\n' +
',{"date_of_service":"10/24/2012 0:00:00","system_address":"1929 W PLUM ST","system_capacity_kw_dc":"3.76"}\n' +
',{"date_of_service":"10/25/2012 0:00:00","system_address":"1745 HOFFMAN MILL RD","system_capacity_kw_dc":"9.80"}\n' +
',{"date_of_service":"10/25/2012 0:00:00","system_address":"1954 ANGELO DRIVE","system_capacity_kw_dc":"15.80"}\n' +
',{"date_of_service":"10/31/2012 0:00:00","system_address":"2207 CRESTSTONE CT.","system_capacity_kw_dc":"2.90"}\n' +
',{"date_of_service":"11/7/2012 0:00:00","system_address":"2736 DIXON CREEK LANE","system_capacity_kw_dc":"7.90"}\n' +
',{"date_of_service":"11/9/2012 0:00:00","system_address":"375 PASCAL ST.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"11/13/2012 0:00:00","system_address":"2437 COCHETOPA COURT","system_capacity_kw_dc":"2.90"}\n' +
',{"date_of_service":"11/20/2012 0:00:00","system_address":"2509 PHANTOM CREEK CT.","system_capacity_kw_dc":"8.20"}\n' +
',{"date_of_service":"12/3/2012 0:00:00","system_address":"425 N WHITCOMB ST.","system_capacity_kw_dc":"2.64"}\n' +
',{"date_of_service":"12/13/2012 0:00:00","system_address":"221 JEFFERSON ST.","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"12/18/2012 0:00:00","system_address":"4801 LANGDALE CT","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"12/19/2012 0:00:00","system_address":"1200 N COLLEGE AVE","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"12/19/2012 0:00:00","system_address":"1200 N COLLEGE AVE C/D","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"12/19/2012 0:00:00","system_address":"1200 N COLLEGE AVE E","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"12/19/2012 0:00:00","system_address":"901 FOSSIL CREEK PKWY","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"1/7/2013 0:00:00","system_address":"5914 HUNTINGTON HILLS DR","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"1/8/2013 0:00:00","system_address":"3415 POND VIEW CT","system_capacity_kw_dc":"4.30"}\n' +
',{"date_of_service":"1/17/2013 0:00:00","system_address":"1505 KIRKWOOD DR","system_capacity_kw_dc":"5.60"}\n' +
',{"date_of_service":"1/22/2013 0:00:00","system_address":"619 CASTLE RIDGE COURT","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"1/22/2013 0:00:00","system_address":"942 DRIFTWOOD DR.","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"1/24/2013 0:00:00","system_address":"1108 N. TIMBERLINE","system_capacity_kw_dc":"3.50"}\n' +
',{"date_of_service":"1/31/2013 0:00:00","system_address":"2839 DES MOINES DR.","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"2/12/2013 0:00:00","system_address":"913 KIMBALL RD","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"2/14/2013 0:00:00","system_address":"221 EDWARDS ST.","system_capacity_kw_dc":"3.40"}\n' +
',{"date_of_service":"2/19/2013 0:00:00","system_address":"3408 BUNTWING LANE","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"3/22/2013 0:00:00","system_address":"1016 S TAFT HILL RD","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"3/25/2013 0:00:00","system_address":"2832 AUTUMN HARVEST WAY","system_capacity_kw_dc":"5.10"}\n' +
',{"date_of_service":"3/25/2013 0:00:00","system_address":"3000 PHOENIX DR.","system_capacity_kw_dc":"2.90"}\n' +
',{"date_of_service":"3/28/2013 0:00:00","system_address":"1715 HOLLY WAY","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"3/28/2013 0:00:00","system_address":"2731 VIRGINIA DALE DR.","system_capacity_kw_dc":"5.30"}\n' +
',{"date_of_service":"3/29/2013 0:00:00","system_address":"2800 VIRGINA DALE DR.","system_capacity_kw_dc":"9.40"}\n' +
',{"date_of_service":"3/29/2013 0:00:00","system_address":"724 LOCUST GROVE DR.","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"4/1/2013 0:00:00","system_address":"423 N LOOMIS AVE.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"4/3/2013 0:00:00","system_address":"412 LILAC LANE.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"4/3/2013 0:00:00","system_address":"4207 WESTSHORE WAY","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"4/10/2013 0:00:00","system_address":"211 NORTH SHERWOOD ST","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"4/10/2013 0:00:00","system_address":"2607 YORKSHIRE ST.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"4/26/2013 0:00:00","system_address":"1630 W STUART ST.","system_capacity_kw_dc":"3.10"}\n' +
',{"date_of_service":"5/2/2013 0:00:00","system_address":"2006 DERBY CT.","system_capacity_kw_dc":"6.90"}\n' +
',{"date_of_service":"5/2/2013 0:00:00","system_address":"725 BONITA AVE.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"5/13/2013 0:00:00","system_address":"4022 ROCK CREEK DR.","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"5/15/2013 0:00:00","system_address":"2930 SKIMMERHORN ST.","system_capacity_kw_dc":"5.60"}\n' +
',{"date_of_service":"5/16/2013 0:00:00","system_address":"2916 TULANE DR.","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"5/17/2013 0:00:00","system_address":"2404 ROSEWOOD LANE","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"5/21/2013 0:00:00","system_address":"1949 DORSET DR.","system_capacity_kw_dc":"4.90"}\n' +
',{"date_of_service":"5/29/2013 0:00:00","system_address":"2403 PIERCE CT.","system_capacity_kw_dc":"7.60"}\n' +
',{"date_of_service":"5/29/2013 0:00:00","system_address":"3300 CARLTON AVE.","system_capacity_kw_dc":"3.70"}\n' +
',{"date_of_service":"5/29/2013 0:00:00","system_address":"838 JUNIPER LANE","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"6/3/2013 0:00:00","system_address":"5800 PLATEAU CT","system_capacity_kw_dc":"9.80"}\n' +
',{"date_of_service":"6/3/2013 0:00:00","system_address":"720 ROMA VALLEY DR.","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"6/5/2013 0:00:00","system_address":"1104 ELLIS ST.","system_capacity_kw_dc":"5.60"}\n' +
',{"date_of_service":"6/6/2013 0:00:00","system_address":"1325 GREEN ST.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"6/11/2013 0:00:00","system_address":"1213 TEAKWOOD DR.","system_capacity_kw_dc":"4.40"}\n' +
',{"date_of_service":"6/11/2013 0:00:00","system_address":"932 THORNHILL PL.","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"6/18/2013 0:00:00","system_address":"3017 PARKVIEW CT.","system_capacity_kw_dc":"8.60"}\n' +
',{"date_of_service":"6/18/2013 0:00:00","system_address":"3408 W PROSPECT RD","system_capacity_kw_dc":"2.50"}\n' +
',{"date_of_service":"6/20/2013 0:00:00","system_address":"2712 GARDEN DR.","system_capacity_kw_dc":"4.90"}\n' +
',{"date_of_service":"6/26/2013 0:00:00","system_address":"1912 BROOKWOOD DR.","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"6/26/2013 0:00:00","system_address":"2008 1/2 TURNBERRY RD.","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"6/26/2013 0:00:00","system_address":"2008 TURNBERRY RD.","system_capacity_kw_dc":"8.80"}\n' +
',{"date_of_service":"7/2/2013 0:00:00","system_address":"1814 WALLENBERG DR.","system_capacity_kw_dc":"9.60"}\n' +
',{"date_of_service":"7/3/2013 0:00:00","system_address":"2815 DES MOINES DR.","system_capacity_kw_dc":"4.90"}\n' +
',{"date_of_service":"7/3/2013 0:00:00","system_address":"3651 KECHTER RD","system_capacity_kw_dc":"2.10"}\n' +
',{"date_of_service":"7/8/2013 0:00:00","system_address":"1419 ASH DRIVE","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"7/8/2013 0:00:00","system_address":"2938 RUFF WAY","system_capacity_kw_dc":"5.10"}\n' +
',{"date_of_service":"8/9/2013 0:00:00","system_address":"569 SAN JUAN DR.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"8/15/2013 0:00:00","system_address":"508 JANSEN DR.","system_capacity_kw_dc":"9.80"}\n' +
',{"date_of_service":"9/26/2013 0:00:00","system_address":"2951 SPRING HARVEST LN","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"10/1/2013 0:00:00","system_address":"LITTLE BEAR PK BLDG","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"10/28/2013 0:00:00","system_address":"1907 BEAR CT","system_capacity_kw_dc":"10.80"}\n' +
',{"date_of_service":"12/2/2013 0:00:00","system_address":"4612 S. MASON ST.","system_capacity_kw_dc":"10.50"}\n' +
',{"date_of_service":"12/3/2013 0:00:00","system_address":"215 JEFFERSON ST.","system_capacity_kw_dc":"4.30"}\n' +
',{"date_of_service":"1/14/2014 0:00:00","system_address":"2601 S. LEMAY","system_capacity_kw_dc":"95.70"}\n' +
',{"date_of_service":"1/29/2014 0:00:00","system_address":"430 N. COLLEGE","system_capacity_kw_dc":"20.00"}\n' +
',{"date_of_service":"2/7/2014 0:00:00","system_address":"6833 HANCOCK DR","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"2/12/2014 0:00:00","system_address":"1212 MORGAN ST","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"2/12/2014 0:00:00","system_address":"2013 BENNINGTON CIR","system_capacity_kw_dc":"8.80"}\n' +
',{"date_of_service":"2/12/2014 0:00:00","system_address":"3130 PLACER ST.","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"1124 WHITE OAK CT","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"2138 GOLDEN EAGLE DR","system_capacity_kw_dc":"11.30"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"2150 COCKLEBUR LN","system_capacity_kw_dc":"6.90"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"2203 COCKLEBUR","system_capacity_kw_dc":"4.60"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"2419 HOLLINGBOURNE DR","system_capacity_kw_dc":"3.80"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"2825 TEAL EYE CT","system_capacity_kw_dc":"10.30"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"3227 BURNING BUSH CT","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"2/19/2014 0:00:00","system_address":"5327 FOSSIL RIDGE DR","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"1406 FREEDOM LN","system_capacity_kw_dc":"7.40"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"1508 BANYON DR.","system_capacity_kw_dc":"8.10"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"2230 SILVER OAKS DR","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"387 CAJETAN ST","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"4824 REGENCY DR.","system_capacity_kw_dc":"9.80"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"524 LOCUST GROVE DR","system_capacity_kw_dc":"6.90"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"5768 ROUND ROCK COURT","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"812 SANDY COVE LN","system_capacity_kw_dc":"6.90"}\n' +
',{"date_of_service":"2/27/2014 0:00:00","system_address":"825 FOSSIL CREEK PKWY","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"3/8/2014 0:00:00","system_address":"2303 TARRAGON LN","system_capacity_kw_dc":"3.50"}\n' +
',{"date_of_service":"3/8/2014 0:00:00","system_address":"2424 AMHERST ST.","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"3/8/2014 0:00:00","system_address":"2637 ADOBE DR","system_capacity_kw_dc":"12.50"}\n' +
',{"date_of_service":"3/8/2014 0:00:00","system_address":"2642 MICHENER DR","system_capacity_kw_dc":"3.40"}\n' +
',{"date_of_service":"3/8/2014 0:00:00","system_address":"3743 CARRINGTON RD.","system_capacity_kw_dc":"9.80"}\n' +
',{"date_of_service":"3/8/2014 0:00:00","system_address":"415 RIDDLE DR","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"3/9/2014 0:00:00","system_address":"3418 GLASGOW CT","system_capacity_kw_dc":"8.20"}\n' +
',{"date_of_service":"3/17/2014 0:00:00","system_address":"2203 MARSHFIELD LN","system_capacity_kw_dc":"2.00"}\n' +
',{"date_of_service":"3/17/2014 0:00:00","system_address":"2309 TARRAGON LN","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"3/17/2014 0:00:00","system_address":"2721 ARANCIA DR","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"3/26/2014 0:00:00","system_address":"2648 DUMIRE CT","system_capacity_kw_dc":"7.75"}\n' +
',{"date_of_service":"3/26/2014 0:00:00","system_address":"3709 SHALLOW POND DRIVE","system_capacity_kw_dc":"11.10"}\n' +
',{"date_of_service":"3/26/2014 0:00:00","system_address":"7300 SILVER MOON LANE","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2209 COCKLEBUR LN","system_capacity_kw_dc":"8.80"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2215 SUNBURY LN","system_capacity_kw_dc":"4.75"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2218 WEST MULBERRY ST","system_capacity_kw_dc":"4.60"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2221 COCKLEBUR LN","system_capacity_kw_dc":"4.90"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2262 BELLWETHER LN","system_capacity_kw_dc":"3.40"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2308 TARRAGON LN","system_capacity_kw_dc":"4.90"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"239 N MCKINLEY AVE","system_capacity_kw_dc":"4.76"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"2518 MYRTLE CT","system_capacity_kw_dc":"2.90"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"3210 MOORE LN","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"3524 WINSLOW DR","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"5225 CASTLE RIDGE PL","system_capacity_kw_dc":"16.20"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"545 CORIANDER LN","system_capacity_kw_dc":"5.70"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"5608 KADENWOOD DR","system_capacity_kw_dc":"1.75"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"6115 KESWICK CT","system_capacity_kw_dc":"8.80"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"7415 STONINGTON CT","system_capacity_kw_dc":"8.25"}\n' +
',{"date_of_service":"4/8/2014 0:00:00","system_address":"909 SOUTHRIDGE GREENS BLVD.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"4/9/2014 0:00:00","system_address":"2314 TARRAGON LN","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"1026 PINNACLE PL","system_capacity_kw_dc":"8.08"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"2302 NANCY GRAY AVE.","system_capacity_kw_dc":"4.25"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"2821 BRUSH CREEK DR","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"3009 PARKVIEW CT","system_capacity_kw_dc":"9.00"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"325 LEEWARD CT","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"3626 CASSIOPEIA LN","system_capacity_kw_dc":"7.85"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"830 BITTERBRUSH LN","system_capacity_kw_dc":"3.80"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"901 GROUSE CIR","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"4/19/2014 0:00:00","system_address":"914 THORNHILL PL","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"4/20/2014 0:00:00","system_address":"832 PONDEROSA DR","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"4/23/2014 0:00:00","system_address":"6537 SOUTHRIDGE GREENS BOULEVARD","system_capacity_kw_dc":"3.92"}\n' +
',{"date_of_service":"4/24/2014 0:00:00","system_address":"1745 HOFFMAN MILL ROAD","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"4/29/2014 0:00:00","system_address":"1737 WATERFORD LANE","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"4/30/2014 0:00:00","system_address":"2326 TARRAGON LN","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"5/3/2014 0:00:00","system_address":"1307 STONEHENGE DR","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"5/3/2014 0:00:00","system_address":"2615 MARSHFIELD","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"5/3/2014 0:00:00","system_address":"2815 STONEHAVEN DR","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"5/3/2014 0:00:00","system_address":"306 STARLING","system_capacity_kw_dc":"2.25"}\n' +
',{"date_of_service":"5/3/2014 0:00:00","system_address":"412 E MULBERRY ST","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"5/19/2014 0:00:00","system_address":"222 PARK ST","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"5/21/2014 0:00:00","system_address":"2215 ANDREWS ST","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"5/21/2014 0:00:00","system_address":"3004 PARKVIEW CT","system_capacity_kw_dc":"7.40"}\n' +
',{"date_of_service":"5/21/2014 0:00:00","system_address":"307 WEST ST","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"5/21/2014 0:00:00","system_address":"5213 MINERS CREEK","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"5/21/2014 0:00:00","system_address":"5330 FOSSIL RIDGE","system_capacity_kw_dc":"7.30"}\n' +
',{"date_of_service":"5/21/2014 0:00:00","system_address":"5645 KADENWOOD","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"5/27/2014 0:00:00","system_address":"2718 BEAVER CT","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"5/30/2014 0:00:00","system_address":"1220 PARKWOOD DR","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"5/30/2014 0:00:00","system_address":"821 LANGDALE DR","system_capacity_kw_dc":"15.00"}\n' +
',{"date_of_service":"6/9/2014 0:00:00","system_address":"715 HEATHER GLEN LN","system_capacity_kw_dc":"7.40"}\n' +
',{"date_of_service":"6/27/2014 0:00:00","system_address":"2531 HOLLINGBOURNE DRIVE","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"6/30/2014 0:00:00","system_address":"165 COLBOARD DR.","system_capacity_kw_dc":"80.00"}\n' +
',{"date_of_service":"7/10/2014 0:00:00","system_address":"1200 RAINTREE DR","system_capacity_kw_dc":"25.00"}\n' +
',{"date_of_service":"7/21/2014 0:00:00","system_address":"1306 COULTER ST","system_capacity_kw_dc":"8.25"}\n' +
',{"date_of_service":"7/21/2014 0:00:00","system_address":"899 RIVERSIDE","system_capacity_kw_dc":"10.80"}\n' +
',{"date_of_service":"8/4/2014 0:00:00","system_address":"1320 MORGAN ST","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"8/11/2014 0:00:00","system_address":"2151 COCKLEBUR LN","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"9/3/2014 0:00:00","system_address":"1994 KINNISON DR (AKA 3028 TAFT HILL RD)","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"9/8/2014 0:00:00","system_address":"918 BREAKWATER","system_capacity_kw_dc":"16.60"}\n' +
',{"date_of_service":"9/29/2014 0:00:00","system_address":"124 PRINCETON ROAD","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"9/29/2014 0:00:00","system_address":"6106 NORMANDY CT","system_capacity_kw_dc":"9.60"}\n' +
',{"date_of_service":"10/20/2014 0:00:00","system_address":"3213 NELSON LANE","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"11/17/2014 0:00:00","system_address":"CSU CAMPUS","system_capacity_kw_dc":"99.90"}\n' +
',{"date_of_service":"11/24/2014 0:00:00","system_address":"1306 MONTEREY DR","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"12/5/2014 0:00:00","system_address":"2321 STRAWFORK","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"106 FOSSIL COURT WEST","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"126 GRAPE ST","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"1518 WILDWOOD COURT","system_capacity_kw_dc":"6.48"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"2618 BROWNSTONE","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"3002 BLUE LEAF COURT","system_capacity_kw_dc":"3.78"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"3112 EAGLE DRIVE","system_capacity_kw_dc":"3.75"}\n' +
',{"date_of_service":"12/19/2014 0:00:00","system_address":"832 RIDGE RUNNER DRIVE","system_capacity_kw_dc":"3.78"}\n' +
',{"date_of_service":"12/23/2014 0:00:00","system_address":"369 OSIANDER ST","system_capacity_kw_dc":"6.10"}\n' +
',{"date_of_service":"12/31/2014 0:00:00","system_address":"2532 SUNBURY LANE","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"1/22/2015 0:00:00","system_address":"251 URBAN PRAIRIE","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"1/22/2015 0:00:00","system_address":"255 URBAN PRAIRIE","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"1/22/2015 0:00:00","system_address":"4215 CREEKSIDE COURT","system_capacity_kw_dc":"9.81"}\n' +
',{"date_of_service":"1/26/2015 0:00:00","system_address":"NBB PACKAGING HALL","system_capacity_kw_dc":"96.00"}\n' +
',{"date_of_service":"1/28/2015 0:00:00","system_address":"2356 STRAWFORK DRIVE","system_capacity_kw_dc":"5.36"}\n' +
',{"date_of_service":"2/11/2015 0:00:00","system_address":"913 FOSSIL CREEK PARKWAY","system_capacity_kw_dc":"8.60"}\n' +
',{"date_of_service":"3/12/2015 0:00:00","system_address":"5328 FOSSIL RIDGE DR.","system_capacity_kw_dc":"7.10"}\n' +
',{"date_of_service":"3/17/2015 0:00:00","system_address":"2150 NANCY GRAY AVE.","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"3/17/2015 0:00:00","system_address":"2503 MAPLE HILL DR.","system_capacity_kw_dc":"6.10"}\n' +
',{"date_of_service":"3/31/2015 0:00:00","system_address":"1927 BOWSPRIT DR.","system_capacity_kw_dc":"9.16"}\n' +
',{"date_of_service":"3/31/2015 0:00:00","system_address":"2456 MARSHFIELD LN.","system_capacity_kw_dc":"2.50"}\n' +
',{"date_of_service":"3/31/2015 0:00:00","system_address":"525 FOX GLOVE CT","system_capacity_kw_dc":"3.27"}\n' +
',{"date_of_service":"3/31/2015 0:00:00","system_address":"951 MERIDIAN (CSU)","system_capacity_kw_dc":"530.00"}\n' +
',{"date_of_service":"4/1/2015 0:00:00","system_address":"1658 SPROCKET DRIVE","system_capacity_kw_dc":"2.50"}\n' +
',{"date_of_service":"4/1/2015 0:00:00","system_address":"2145 COCKLEBUR LN","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"4/2/2015 0:00:00","system_address":"4701 TECHNOLOGY PRKWY","system_capacity_kw_dc":"963.00"}\n' +
',{"date_of_service":"4/3/2015 0:00:00","system_address":"1401 HEPPLEWHITE CT","system_capacity_kw_dc":"4.60"}\n' +
',{"date_of_service":"4/8/2015 0:00:00","system_address":"221 N. WHITCOMB ST.","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"4/11/2015 0:00:00","system_address":"2922 ZENDT DR","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"4/14/2015 0:00:00","system_address":"140 N BRYAN AVE.","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"4/14/2015 0:00:00","system_address":"2214 MATHEWS","system_capacity_kw_dc":"4.84"}\n' +
',{"date_of_service":"4/14/2015 0:00:00","system_address":"2332 SWEETWATER CREEK DR.","system_capacity_kw_dc":"5.23"}\n' +
',{"date_of_service":"4/14/2015 0:00:00","system_address":"5329 FOSSIL RIDGE DR.","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"4/14/2015 0:00:00","system_address":"619 RAMAH DR.","system_capacity_kw_dc":"6.10"}\n' +
',{"date_of_service":"4/21/2015 0:00:00","system_address":"1301 RIVERSIDE AVE.","system_capacity_kw_dc":"15.10"}\n' +
',{"date_of_service":"4/21/2015 0:00:00","system_address":"1419 SANFORD DR.","system_capacity_kw_dc":"6.72"}\n' +
',{"date_of_service":"4/21/2015 0:00:00","system_address":"2302 TARRAGON LN.","system_capacity_kw_dc":"3.25"}\n' +
',{"date_of_service":"4/21/2015 0:00:00","system_address":"2507 HAMPSHIRE RD","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"4/21/2015 0:00:00","system_address":"701 W. LAUREL ST","system_capacity_kw_dc":"139.00"}\n' +
',{"date_of_service":"4/22/2015 0:00:00","system_address":"2709 WILLIAM NEAL PKWY","system_capacity_kw_dc":"5.75"}\n' +
',{"date_of_service":"4/22/2015 0:00:00","system_address":"5932 FOSSIL CREEK PKWY","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"4/30/2015 0:00:00","system_address":"2517 MATHEWS STREET","system_capacity_kw_dc":"3.40"}\n' +
',{"date_of_service":"4/30/2015 0:00:00","system_address":"2702 STONEHAVEN DR","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"4/30/2015 0:00:00","system_address":"323 E PLUM ST","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"4/30/2015 0:00:00","system_address":"3400 WINSLOW DR","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"4/30/2015 0:00:00","system_address":"5319 ELDERBERRY CT","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"4/30/2015 0:00:00","system_address":"5932 SNOWY PLOVER CT","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"5/7/2015 0:00:00","system_address":"1202 SAWTOOTH OAK CT","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"5/7/2015 0:00:00","system_address":"3156 LOWER LOOP DR","system_capacity_kw_dc":"1.60"}\n' +
',{"date_of_service":"5/14/2015 0:00:00","system_address":"2606 COVINGTON CT.","system_capacity_kw_dc":"6.72"}\n' +
',{"date_of_service":"5/20/2015 0:00:00","system_address":"243 N COLLEGE AVE.","system_capacity_kw_dc":"10.00"}\n' +
',{"date_of_service":"5/28/2015 0:00:00","system_address":"2321 CHANDLER ST","system_capacity_kw_dc":"4.75"}\n' +
',{"date_of_service":"5/28/2015 0:00:00","system_address":"314 PAVILION LANE","system_capacity_kw_dc":"75.00"}\n' +
',{"date_of_service":"5/28/2015 0:00:00","system_address":"4808 PRAIRIE RIDGE DR","system_capacity_kw_dc":"6.86"}\n' +
',{"date_of_service":"5/28/2015 0:00:00","system_address":"913 GROUSE CIR","system_capacity_kw_dc":"4.25"}\n' +
',{"date_of_service":"6/8/2015 0:00:00","system_address":"300 W. DRAKE ROAD","system_capacity_kw_dc":"232.00"}\n' +
',{"date_of_service":"6/16/2015 0:00:00","system_address":"1019 SYCAMORE ST.","system_capacity_kw_dc":"2.52"}\n' +
',{"date_of_service":"6/16/2015 0:00:00","system_address":"2218 CHAROLAIS DR.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"6/16/2015 0:00:00","system_address":"2320 TARRAGON LN","system_capacity_kw_dc":"6.25"}\n' +
',{"date_of_service":"6/16/2015 0:00:00","system_address":"2327 TARRAGON LN.","system_capacity_kw_dc":"4.59"}\n' +
',{"date_of_service":"6/16/2015 0:00:00","system_address":"2914 BROOKWOOD PLACE","system_capacity_kw_dc":"10.50"}\n' +
',{"date_of_service":"6/16/2015 0:00:00","system_address":"3743 STRATFORD CT","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"6/17/2015 0:00:00","system_address":"2532 MARSHFIELD LN","system_capacity_kw_dc":"2.50"}\n' +
',{"date_of_service":"6/18/2015 0:00:00","system_address":"1236 CANVASBACK CT","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"6/18/2015 0:00:00","system_address":"2813 CRYSTAL CT","system_capacity_kw_dc":"7.14"}\n' +
',{"date_of_service":"6/18/2015 0:00:00","system_address":"521 SAN JUAN DR","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"6/19/2015 0:00:00","system_address":"1312 MONTEREY DR","system_capacity_kw_dc":"4.33"}\n' +
',{"date_of_service":"6/19/2015 0:00:00","system_address":"1400 REMINGTON","system_capacity_kw_dc":"99.00"}\n' +
',{"date_of_service":"6/19/2015 0:00:00","system_address":"1676 FREEWHEEL DR.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"6/19/2015 0:00:00","system_address":"900 W. PITKIN","system_capacity_kw_dc":"93.00"}\n' +
',{"date_of_service":"6/29/2015 0:00:00","system_address":"1041 WOODWARD WAY","system_capacity_kw_dc":"125.00"}\n' +
',{"date_of_service":"7/2/2015 0:00:00","system_address":"3327 LONG CREEK DR","system_capacity_kw_dc":"8.50"}\n' +
',{"date_of_service":"7/2/2015 0:00:00","system_address":"5638 CARDINAL FLOWER CT","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"7/2/2015 0:00:00","system_address":"5644 CARDINAL FLOWER CT","system_capacity_kw_dc":"8.10"}\n' +
',{"date_of_service":"7/2/2015 0:00:00","system_address":"6422 ROOKERY RD","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"7/10/2015 0:00:00","system_address":"1745 HOFFMAN MILL ROAD","system_capacity_kw_dc":"10.80"}\n' +
',{"date_of_service":"7/13/2015 0:00:00","system_address":"910 E MULBERRY","system_capacity_kw_dc":"620.00"}\n' +
',{"date_of_service":"7/14/2015 0:00:00","system_address":"3426 BALE DR","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"7/17/2015 0:00:00","system_address":"2607 BROWNSTONE CT","system_capacity_kw_dc":"2.75"}\n' +
',{"date_of_service":"7/20/2015 0:00:00","system_address":"162 FREY AVE.","system_capacity_kw_dc":"3.75"}\n' +
',{"date_of_service":"8/7/2015 0:00:00","system_address":"2220 COCKLEBUR LANE","system_capacity_kw_dc":"4.25"}\n' +
',{"date_of_service":"8/7/2015 0:00:00","system_address":"2359 PALOMINO DR","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"8/7/2015 0:00:00","system_address":"5080 FOSSIL BLVD","system_capacity_kw_dc":"60.00"}\n' +
',{"date_of_service":"8/18/2015 0:00:00","system_address":"1420 RIVERSIDE","system_capacity_kw_dc":"76.00"}\n' +
',{"date_of_service":"8/18/2015 0:00:00","system_address":"2371 PALOMINO DR","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"8/18/2015 0:00:00","system_address":"3183 TWIN HERON","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"8/18/2015 0:00:00","system_address":"918 HUNTINGTON HILLS DR","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"8/21/2015 0:00:00","system_address":"4473 STARFLOWER DR","system_capacity_kw_dc":"5.50"}\n' +
',{"date_of_service":"8/21/2015 0:00:00","system_address":"620 PEYTON DRIVE","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"8/28/2015 0:00:00","system_address":"2736 BLUEGRASS DR","system_capacity_kw_dc":"4.24"}\n' +
',{"date_of_service":"8/28/2015 0:00:00","system_address":"5607 PLEASANT HILL LANE","system_capacity_kw_dc":"4.88"}\n' +
',{"date_of_service":"9/4/2015 0:00:00","system_address":"2400 FARGHEE COURT","system_capacity_kw_dc":"4.86"}\n' +
',{"date_of_service":"9/8/2015 0:00:00","system_address":"3338 W ELIZABETH ST","system_capacity_kw_dc":"3.70"}\n' +
',{"date_of_service":"9/9/2015 0:00:00","system_address":"245A URBAN PRAIRIE STREET","system_capacity_kw_dc":"8.25"}\n' +
',{"date_of_service":"9/14/2015 0:00:00","system_address":"323 E MAGNOLIA ST","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"9/18/2015 0:00:00","system_address":"1608 FANTAIL COURT","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"9/18/2015 0:00:00","system_address":"2248 SILVER TRAILS DR","system_capacity_kw_dc":"3.97"}\n' +
',{"date_of_service":"9/25/2015 0:00:00","system_address":"1901 BEAR COURT","system_capacity_kw_dc":"2.91"}\n' +
',{"date_of_service":"9/25/2015 0:00:00","system_address":"2474 MARSHFIELD LANE","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"9/25/2015 0:00:00","system_address":"3833 WILD ELM WAY","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"10/12/2015 0:00:00","system_address":"401 CHUKAR CT","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"10/12/2015 0:00:00","system_address":"4118 MANHATTAN AVE","system_capacity_kw_dc":"3.71"}\n' +
',{"date_of_service":"10/16/2015 0:00:00","system_address":"1618 SCARBOROUGH DR.","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"10/16/2015 0:00:00","system_address":"1820 SOMERVILLE DR.","system_capacity_kw_dc":"3.71"}\n' +
',{"date_of_service":"10/16/2015 0:00:00","system_address":"2122 LAPORTE AVE","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"10/16/2015 0:00:00","system_address":"2503 ROCK CREEK DRIVE","system_capacity_kw_dc":"4.00"}\n' +
',{"date_of_service":"10/16/2015 0:00:00","system_address":"5812 PLATEAU COURT","system_capacity_kw_dc":"9.20"}\n' +
',{"date_of_service":"10/23/2015 0:00:00","system_address":"1618 REDBERRY CT.","system_capacity_kw_dc":"5.57"}\n' +
',{"date_of_service":"10/28/2015 0:00:00","system_address":"710 MATHEWS STREET","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"1001 W MOUNTAIN AVE","system_capacity_kw_dc":"6.62"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"112 COLUMBIA RD.","system_capacity_kw_dc":"6.09"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"3103 MUSKRAT CREEK DR.","system_capacity_kw_dc":"7.20"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"3814 WILD ELM WAY","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"3844 ECLIPSE LANE","system_capacity_kw_dc":"5.83"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"5620 CARDINAL FLOWER CT","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"11/2/2015 0:00:00","system_address":"6733 BRITTANY DR.","system_capacity_kw_dc":"4.77"}\n' +
',{"date_of_service":"11/3/2015 0:00:00","system_address":"1215 FORRESTAL DRIVE","system_capacity_kw_dc":"8.12"}\n' +
',{"date_of_service":"11/3/2015 0:00:00","system_address":"1908 WINTERBERRY WAY","system_capacity_kw_dc":"2.91"}\n' +
',{"date_of_service":"11/3/2015 0:00:00","system_address":"2413 HOLLINGBOURNE DR.","system_capacity_kw_dc":"7.16"}\n' +
',{"date_of_service":"11/6/2015 0:00:00","system_address":"4607 CREST RD.","system_capacity_kw_dc":"5.00"}\n' +
',{"date_of_service":"11/19/2015 0:00:00","system_address":"320 N TAFT (SP3)","system_capacity_kw_dc":"971.00"}\n' +
',{"date_of_service":"11/20/2015 0:00:00","system_address":"4850 INNOVATION DR","system_capacity_kw_dc":"50.00"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"1606 SILVERGATE RD","system_capacity_kw_dc":"3.44"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"1630 TANGLEWOOD DR.","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"2532 CREEKWOOD DR.","system_capacity_kw_dc":"3.97"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"2700 WHITWORTH DR.","system_capacity_kw_dc":"7.02"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"2819 BLACKSTONE DR.","system_capacity_kw_dc":"2.65"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"307 LEEWARD CT.","system_capacity_kw_dc":"8.00"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"319 N. PEARL STREET","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"3812 ENSENADA CT.","system_capacity_kw_dc":"3.71"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"4216 SUNCREST CT","system_capacity_kw_dc":"5.10"}\n' +
',{"date_of_service":"12/3/2015 0:00:00","system_address":"5708 FALLING WATER DRIVE","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"12/9/2015 0:00:00","system_address":"1802 THYME CT","system_capacity_kw_dc":"10.30"}\n' +
',{"date_of_service":"12/9/2015 0:00:00","system_address":"1907 CANOPY CT.","system_capacity_kw_dc":"6.03"}\n' +
',{"date_of_service":"12/9/2015 0:00:00","system_address":"2219 SMALLWOOD DR","system_capacity_kw_dc":"5.02"}\n' +
',{"date_of_service":"12/9/2015 0:00:00","system_address":"3203 HONEYSUCKLE CT.","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"12/9/2015 0:00:00","system_address":"3521 ROCKY STREAM DR","system_capacity_kw_dc":"9.81"}\n' +
',{"date_of_service":"12/10/2015 0:00:00","system_address":"1207 WOODED CREEK CT","system_capacity_kw_dc":"5.25"}\n' +
',{"date_of_service":"12/10/2015 0:00:00","system_address":"1331 HEARTHFIRE COURT","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"12/10/2015 0:00:00","system_address":"2219 CEDARWOOD DRIVE","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"12/21/2015 0:00:00","system_address":"239A URBAN PRAIRIE STREET","system_capacity_kw_dc":"8.32"}\n' +
',{"date_of_service":"1/7/2016 0:00:00","system_address":"221A URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"1/12/2016 0:00:00","system_address":"2830 MICHENER DR.","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"1/13/2016 0:00:00","system_address":"4100 SUNCREST DR.","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"2/9/2016 0:00:00","system_address":"2332 S COLLEGE AVE.","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"2/9/2016 0:00:00","system_address":"304 N. ROOSEVELT","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"1021 LINDEN GATE CT","system_capacity_kw_dc":"6.05"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"1512 KIRKWOOD DR.","system_capacity_kw_dc":"9.10"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"1515 PURPLE SAGE CT.","system_capacity_kw_dc":"6.09"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"1516 TEAKWOOD COURT","system_capacity_kw_dc":"6.89"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"2100 EASTWOOD DR.","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"3932 WILD ELM WAY","system_capacity_kw_dc":"4.77"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"4020 BRACADALE PL.","system_capacity_kw_dc":"2.08"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"4124 BEAVER CREEK DRIVE","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"5621 CARDINAL FLOWER CT","system_capacity_kw_dc":"7.20"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"613 MEADOW RUN","system_capacity_kw_dc":"6.36"}\n' +
',{"date_of_service":"2/24/2016 0:00:00","system_address":"1524 HASTINGS DR.","system_capacity_kw_dc":"13.00"}\n' +
',{"date_of_service":"2/24/2016 0:00:00","system_address":"1706 RUTLEDGE CT.","system_capacity_kw_dc":"4.24"}\n' +
',{"date_of_service":"2/24/2016 0:00:00","system_address":"2269 W BELLWETHER LANE","system_capacity_kw_dc":"4.25"}\n' +
',{"date_of_service":"3/3/2016 0:00:00","system_address":"203A URBAN PRAIRIE STREET","system_capacity_kw_dc":"8.32"}\n' +
',{"date_of_service":"3/8/2016 0:00:00","system_address":"1663 SPROCKET DR","system_capacity_kw_dc":"2.29"}\n' +
',{"date_of_service":"3/8/2016 0:00:00","system_address":"2437 WYANDOTTE DR.","system_capacity_kw_dc":"4.94"}\n' +
',{"date_of_service":"3/8/2016 0:00:00","system_address":"519 DENNISON AVE","system_capacity_kw_dc":"5.13"}\n' +
',{"date_of_service":"3/9/2016 0:00:00","system_address":"1728 WEST PROSPECT","system_capacity_kw_dc":"11.66"}\n' +
',{"date_of_service":"3/9/2016 0:00:00","system_address":"2167 ROMNEY AVE","system_capacity_kw_dc":"4.59"}\n' +
',{"date_of_service":"3/28/2016 0:00:00","system_address":"221 E. LINCOLN AVE.","system_capacity_kw_dc":"10.50"}\n' +
',{"date_of_service":"3/28/2016 0:00:00","system_address":"321 UNIT 1 URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"3/28/2016 0:00:00","system_address":"321 UNIT 2 URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"3/28/2016 0:00:00","system_address":"321 UNIT 3 URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"3/28/2016 0:00:00","system_address":"321 UNIT 4 URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"3/28/2016 0:00:00","system_address":"321 UNIT 5 URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"1302 SUNFLOWER DRIVE","system_capacity_kw_dc":"3.12"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"2006 SHEFFIELD CT","system_capacity_kw_dc":"4.60"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"2202 NANCY GRAY AVE.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"2736 MAROON COURT","system_capacity_kw_dc":"5.36"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"3333 W PROSPECT RD","system_capacity_kw_dc":"5.72"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"501 SAINT MICHAELS DRIVE","system_capacity_kw_dc":"3.92"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"5609 CARDINAL FLOWER COURT","system_capacity_kw_dc":"8.19"}\n' +
',{"date_of_service":"3/29/2016 0:00:00","system_address":"801 WARREN LANDING","system_capacity_kw_dc":"3.11"}\n' +
',{"date_of_service":"4/5/2016 0:00:00","system_address":"1324 STONEHENGE DRIVE","system_capacity_kw_dc":"7.87"}\n' +
',{"date_of_service":"4/6/2016 0:00:00","system_address":"1631 TRAILWOOD DR.","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"4/6/2016 0:00:00","system_address":"2015 NIAGARA CT. UNIT 53","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"4/6/2016 0:00:00","system_address":"2708 WALKALOOSA WAY","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"4/6/2016 0:00:00","system_address":"3348 SANTA FE COURT","system_capacity_kw_dc":"3.51"}\n' +
',{"date_of_service":"4/6/2016 0:00:00","system_address":"3733 ECLIPSE LN","system_capacity_kw_dc":"8.48"}\n' +
',{"date_of_service":"4/7/2016 0:00:00","system_address":"2383 PALOMINO DR.","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"4/8/2016 0:00:00","system_address":"2445 PALOMINO DR.","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"4/8/2016 0:00:00","system_address":"2602 WALKLAOOSA WAY","system_capacity_kw_dc":"1.50"}\n' +
',{"date_of_service":"4/22/2016 0:00:00","system_address":"1657 SPROCKET DRIVE","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"4/22/2016 0:00:00","system_address":"2903 BRUMBAUGH DRIVE","system_capacity_kw_dc":"4.25"}\n' +
',{"date_of_service":"4/22/2016 0:00:00","system_address":"3219 FERNWOOD LN","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"4/22/2016 0:00:00","system_address":"919 KINGSTON DR.","system_capacity_kw_dc":"5.83"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"1460 HUMMEL LN","system_capacity_kw_dc":"6.44"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"3171 SAGEWATER COURT","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"3336 GUNNISON DRIVE","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"519 CHARRINGTON COURT","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"6581 ROOKERY RD.","system_capacity_kw_dc":"6.90"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"6927 EGYPTIAN DR","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"703 DEARBORN STREET","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"5/4/2016 0:00:00","system_address":"713 PARLIAMENT CT.","system_capacity_kw_dc":"5.70"}\n' +
',{"date_of_service":"5/10/2016 0:00:00","system_address":"225 N MCKINLEY AVE","system_capacity_kw_dc":"3.12"}\n' +
',{"date_of_service":"5/10/2016 0:00:00","system_address":"2314 BELLWETHER LN","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"5/10/2016 0:00:00","system_address":"3221 BURNING BUSH CT","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"5/12/2016 0:00:00","system_address":"3275 GLACIER CREEK DRIVE","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"5/20/2016 0:00:00","system_address":"1721 PRAIRIE HILL DR","system_capacity_kw_dc":"7.02"}\n' +
',{"date_of_service":"5/20/2016 0:00:00","system_address":"1912 LARKSPUR DR","system_capacity_kw_dc":"5.72"}\n' +
',{"date_of_service":"5/20/2016 0:00:00","system_address":"4330 MILL CREEK COURT","system_capacity_kw_dc":"2.08"}\n' +
',{"date_of_service":"5/20/2016 0:00:00","system_address":"637 N BRIARWOOD RD","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"5/23/2016 0:00:00","system_address":"1406 GLEN HAVEN DRIVE","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"5/25/2016 0:00:00","system_address":"1420 PURPLE SAGE CT","system_capacity_kw_dc":"6.24"}\n' +
',{"date_of_service":"5/25/2016 0:00:00","system_address":"5706 WHITE WILLOW DRIVE","system_capacity_kw_dc":"5.04"}\n' +
',{"date_of_service":"6/3/2016 0:00:00","system_address":"2742 BLUEGRASS DR","system_capacity_kw_dc":"4.16"}\n' +
',{"date_of_service":"6/7/2016 0:00:00","system_address":"1305 GREEN STREET","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"6/7/2016 0:00:00","system_address":"2733 WILLIAM NEAL PARKWAY","system_capacity_kw_dc":"5.67"}\n' +
',{"date_of_service":"6/7/2016 0:00:00","system_address":"3913 SUNSTONE COURT","system_capacity_kw_dc":"6.93"}\n' +
',{"date_of_service":"6/8/2016 0:00:00","system_address":"1825 CRESTMORE PLACE","system_capacity_kw_dc":"2.86"}\n' +
',{"date_of_service":"6/8/2016 0:00:00","system_address":"1916 OAKWOOD DR.","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"6/9/2016 0:00:00","system_address":"1602 W. CHARLESTON WAY","system_capacity_kw_dc":"7.02"}\n' +
',{"date_of_service":"6/9/2016 0:00:00","system_address":"3378 LIVERPOOL STREET","system_capacity_kw_dc":"2.16"}\n' +
',{"date_of_service":"6/10/2016 0:00:00","system_address":"215A URBAN PRAIRIE STREET","system_capacity_kw_dc":"8.32"}\n' +
',{"date_of_service":"6/10/2016 0:00:00","system_address":"227A URBAN PRAIRIE STREET","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"6/13/2016 0:00:00","system_address":"1921 SEQUOIA ST","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"6/15/2016 0:00:00","system_address":"3719 CARIBOU DR","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"6/15/2016 0:00:00","system_address":"4419 HOLLYHOCK STREET","system_capacity_kw_dc":"2.29"}\n' +
',{"date_of_service":"6/17/2016 0:00:00","system_address":"2906 QUERIDA STREET","system_capacity_kw_dc":"4.16"}\n' +
',{"date_of_service":"6/21/2016 0:00:00","system_address":"832 WOOD STREET","system_capacity_kw_dc":"9.10"}\n' +
',{"date_of_service":"6/24/2016 0:00:00","system_address":"3321 FIORE COURT","system_capacity_kw_dc":"8.50"}\n' +
',{"date_of_service":"6/29/2016 0:00:00","system_address":"2939 SPRING HARVEST LANE","system_capacity_kw_dc":"9.62"}\n' +
',{"date_of_service":"6/29/2016 0:00:00","system_address":"717 SCENIC DRIVE","system_capacity_kw_dc":"7.87"}\n' +
',{"date_of_service":"6/30/2016 0:00:00","system_address":"1921 PRAIRIE HILL DR.","system_capacity_kw_dc":"4.94"}\n' +
',{"date_of_service":"6/30/2016 0:00:00","system_address":"2002 SCARECROW","system_capacity_kw_dc":"5.94"}\n' +
',{"date_of_service":"7/7/2016 0:00:00","system_address":"1336 STONEHENGE DR","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"7/7/2016 0:00:00","system_address":"1706 BRIARGATE CT.","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"7/7/2016 0:00:00","system_address":"404 PARK ST.","system_capacity_kw_dc":"2.28"}\n' +
',{"date_of_service":"7/8/2016 0:00:00","system_address":"2227 CLIPPER WAY","system_capacity_kw_dc":"7.80"}\n' +
',{"date_of_service":"7/12/2016 0:00:00","system_address":"2933 SUNSTONE DR.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"7/12/2016 0:00:00","system_address":"4248 STONEYCREEK DR.","system_capacity_kw_dc":"6.24"}\n' +
',{"date_of_service":"7/13/2016 0:00:00","system_address":"2649 CHARLESTON WAY","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"7/13/2016 0:00:00","system_address":"3921 RANNOCH ST.","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"7/14/2016 0:00:00","system_address":"4203 LOOKOUT LANE","system_capacity_kw_dc":"5.72"}\n' +
',{"date_of_service":"7/19/2016 0:00:00","system_address":"200 1ST STREET","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"7/19/2016 0:00:00","system_address":"2800 CRYSTAL COURT","system_capacity_kw_dc":"10.40"}\n' +
',{"date_of_service":"7/19/2016 0:00:00","system_address":"2830 BLUEGRASS DR.","system_capacity_kw_dc":"3.15"}\n' +
',{"date_of_service":"7/19/2016 0:00:00","system_address":"3109 MUSKRAT CREEK","system_capacity_kw_dc":"3.18"}\n' +
',{"date_of_service":"7/19/2016 0:00:00","system_address":"406 DUNNE DRIVE","system_capacity_kw_dc":"4.77"}\n' +
',{"date_of_service":"7/20/2016 0:00:00","system_address":"1652 SPROCKET DR.","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"7/21/2016 0:00:00","system_address":"1619 BIRMINGHAM DR","system_capacity_kw_dc":"4.68"}\n' +
',{"date_of_service":"7/21/2016 0:00:00","system_address":"3914 GRAND CANYON ST","system_capacity_kw_dc":"8.06"}\n' +
',{"date_of_service":"7/21/2016 0:00:00","system_address":"514 MUSKEGON CT","system_capacity_kw_dc":"6.24"}\n' +
',{"date_of_service":"7/25/2016 0:00:00","system_address":"1916 SEQUOIA ST","system_capacity_kw_dc":"4.09"}\n' +
',{"date_of_service":"7/25/2016 0:00:00","system_address":"5208 PARKWAY CIRCLE E","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"7/26/2016 0:00:00","system_address":"1000 E PITKIN STREET","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"7/29/2016 0:00:00","system_address":"6580 ROOKERY RD.","system_capacity_kw_dc":"8.82"}\n' +
',{"date_of_service":"8/1/2016 0:00:00","system_address":"612 ZUNI CIRCLE","system_capacity_kw_dc":"8.32"}\n' +
',{"date_of_service":"8/3/2016 0:00:00","system_address":"1504 LYNNWOOD DR.","system_capacity_kw_dc":"2.24"}\n' +
',{"date_of_service":"8/3/2016 0:00:00","system_address":"221 E LINCOLN AVE","system_capacity_kw_dc":"10.50"}\n' +
',{"date_of_service":"8/3/2016 0:00:00","system_address":"2213 CEDARWOOD DRIVE","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"8/3/2016 0:00:00","system_address":"2342 CEDARWOOD DRIVE","system_capacity_kw_dc":"2.86"}\n' +
',{"date_of_service":"8/3/2016 0:00:00","system_address":"3200 EAGLE DRIVE","system_capacity_kw_dc":"4.16"}\n' +
',{"date_of_service":"8/3/2016 0:00:00","system_address":"419 FRANKLIN STREET","system_capacity_kw_dc":"4.05"}\n' +
',{"date_of_service":"8/4/2016 0:00:00","system_address":"1308 ALFORD STREET","system_capacity_kw_dc":"10.66"}\n' +
',{"date_of_service":"8/4/2016 0:00:00","system_address":"3321 W ELIZABETH ST","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"8/4/2016 0:00:00","system_address":"5419 HILLDALE COURT","system_capacity_kw_dc":"8.32"}\n' +
',{"date_of_service":"8/5/2016 0:00:00","system_address":"1613 COLLINDALE DR.","system_capacity_kw_dc":"4.94"}\n' +
',{"date_of_service":"8/9/2016 0:00:00","system_address":"754 ROCHELLE CIRCLE","system_capacity_kw_dc":"8.06"}\n' +
',{"date_of_service":"8/11/2016 0:00:00","system_address":"325 SOUTH PEARL ST","system_capacity_kw_dc":"7.56"}\n' +
',{"date_of_service":"8/11/2016 0:00:00","system_address":"4027 OAK SHADOW WAY","system_capacity_kw_dc":"10.08"}\n' +
',{"date_of_service":"8/11/2016 0:00:00","system_address":"4554 SEAWAY CIRCLE","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"8/15/2016 0:00:00","system_address":"3509 SUNFLOWER DRIVE","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"8/23/2016 0:00:00","system_address":"1406 INDIAN PAINTBRUSH CT","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"8/25/2016 0:00:00","system_address":"1044 BERWICK COURT","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"8/26/2016 0:00:00","system_address":"1030 STRACHAN DRIVE","system_capacity_kw_dc":"8.32"}\n' +
',{"date_of_service":"8/26/2016 0:00:00","system_address":"209A URBAN PRAIRIE STREET","system_capacity_kw_dc":"8.48"}\n' +
',{"date_of_service":"8/26/2016 0:00:00","system_address":"2306 ANTELOPE ROAD","system_capacity_kw_dc":"4.24"}\n' +
',{"date_of_service":"8/26/2016 0:00:00","system_address":"3826 KEPLER DRIVE","system_capacity_kw_dc":"7.87"}\n' +
',{"date_of_service":"8/29/2016 0:00:00","system_address":"3201 NORWOOD COURT","system_capacity_kw_dc":"5.04"}\n' +
',{"date_of_service":"8/31/2016 0:00:00","system_address":"515 N. WHITCOMB ST.","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"9/1/2016 0:00:00","system_address":"3303 LIPPIZAN CT.","system_capacity_kw_dc":"4.16"}\n' +
',{"date_of_service":"9/1/2016 0:00:00","system_address":"706 MCGRAW DRIVE","system_capacity_kw_dc":"4.41"}\n' +
',{"date_of_service":"9/1/2016 0:00:00","system_address":"737 DENNISON AVENUE","system_capacity_kw_dc":"2.34"}\n' +
',{"date_of_service":"9/2/2016 0:00:00","system_address":"1604 LAYLAND CT.","system_capacity_kw_dc":"7.54"}\n' +
',{"date_of_service":"9/2/2016 0:00:00","system_address":"2750 DENVER DRIVE","system_capacity_kw_dc":"7.56"}\n' +
',{"date_of_service":"9/7/2016 0:00:00","system_address":"2200 BROOKWOOD DR.","system_capacity_kw_dc":"4.72"}\n' +
',{"date_of_service":"9/15/2016 0:00:00","system_address":"3203 LEDGESTONE COURT","system_capacity_kw_dc":"8.48"}\n' +
',{"date_of_service":"9/16/2016 0:00:00","system_address":"4467 STARFLOWER DRIVE","system_capacity_kw_dc":"4.09"}\n' +
',{"date_of_service":"9/19/2016 0:00:00","system_address":"2631 SHADOW COURT","system_capacity_kw_dc":"6.24"}\n' +
',{"date_of_service":"9/29/2016 0:00:00","system_address":"5862 NORTHERN LIGHTS DR","system_capacity_kw_dc":"9.86"}\n' +
',{"date_of_service":"10/4/2016 0:00:00","system_address":"3540 SILVER TRAIL DR.","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"10/5/2016 0:00:00","system_address":"320 MILKY WAY DR.","system_capacity_kw_dc":"3.92"}\n' +
',{"date_of_service":"10/10/2016 0:00:00","system_address":"301 E. STUART ST.","system_capacity_kw_dc":"53.50"}\n' +
',{"date_of_service":"10/17/2016 0:00:00","system_address":"955 SHIRE COURT","system_capacity_kw_dc":"6.75"}\n' +
',{"date_of_service":"10/18/2016 0:00:00","system_address":"3318 SANTA FE COURT","system_capacity_kw_dc":"5.80"}\n' +
',{"date_of_service":"10/19/2016 0:00:00","system_address":"2313 MARSHWOOD","system_capacity_kw_dc":"5.30"}\n' +
',{"date_of_service":"10/20/2016 0:00:00","system_address":"1674 FOSSIL CREEK PKWY","system_capacity_kw_dc":"4.68"}\n' +
',{"date_of_service":"10/20/2016 0:00:00","system_address":"425 LARKBUNTING DR.","system_capacity_kw_dc":"2.34"}\n' +
',{"date_of_service":"10/20/2016 0:00:00","system_address":"4418 HARPOON COURT","system_capacity_kw_dc":"8.06"}\n' +
',{"date_of_service":"10/20/2016 0:00:00","system_address":"4827 PRAIRIE VISTA DR.","system_capacity_kw_dc":"8.58"}\n' +
',{"date_of_service":"10/20/2016 0:00:00","system_address":"5751 NORTHERN LIGHTS DR.","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"10/21/2016 0:00:00","system_address":"1337 STONEHENGE DR","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"10/24/2016 0:00:00","system_address":"2057 YEARLING DR.","system_capacity_kw_dc":"8.19"}\n' +
',{"date_of_service":"10/28/2016 0:00:00","system_address":"222 LAPORTE AVE.","system_capacity_kw_dc":"103.85"}\n' +
',{"date_of_service":"10/28/2016 0:00:00","system_address":"2718 TRENTON WAY","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"10/28/2016 0:00:00","system_address":"3531 TRADITION DR.","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"10/28/2016 0:00:00","system_address":"5615 BIG CANYON DRIVE","system_capacity_kw_dc":"8.99"}\n' +
',{"date_of_service":"10/31/2016 0:00:00","system_address":"1414 CRANBERRY CT","system_capacity_kw_dc":"5.98"}\n' +
',{"date_of_service":"11/1/2016 0:00:00","system_address":"204 MAE STREET","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"11/1/2016 0:00:00","system_address":"3501 PATTERSON CT.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"11/2/2016 0:00:00","system_address":"2514 CLARION LN","system_capacity_kw_dc":"4.16"}\n' +
',{"date_of_service":"11/4/2016 0:00:00","system_address":"1209 ROBERTSON STREET","system_capacity_kw_dc":"4.32"}\n' +
',{"date_of_service":"11/4/2016 0:00:00","system_address":"731 WOODLAND WAY","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"11/4/2016 0:00:00","system_address":"904 SNOWY PLAIN RD","system_capacity_kw_dc":"4.05"}\n' +
',{"date_of_service":"11/16/2016 0:00:00","system_address":"913 SHORE PINE CT.","system_capacity_kw_dc":"7.24"}\n' +
',{"date_of_service":"11/18/2016 0:00:00","system_address":"3413 AVON CT.","system_capacity_kw_dc":"2.83"}\n' +
',{"date_of_service":"11/18/2016 0:00:00","system_address":"755 SITKA ST.","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"11/21/2016 0:00:00","system_address":"1245 BELLEVIEW DRIVE","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"11/21/2016 0:00:00","system_address":"2931 VIRGINA DALE DRIVE","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"11/21/2016 0:00:00","system_address":"3109 COCKNEY STREET","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"11/22/2016 0:00:00","system_address":"815 PETERSON STREET","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"11/23/2016 0:00:00","system_address":"1808 GREENGATE DR.","system_capacity_kw_dc":"2.86"}\n' +
',{"date_of_service":"11/23/2016 0:00:00","system_address":"4613 WESTBURY DRIVE","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"11/29/2016 0:00:00","system_address":"2903 BASSICK ST.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"1664 SPROCKET DR","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"2824 TRENTON WAY","system_capacity_kw_dc":"4.68"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"3218 FERNWOOD LN","system_capacity_kw_dc":"9.88"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"3226 W. PROSPECT RD.","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"3403 W. ELIZABETH ST.","system_capacity_kw_dc":"6.44"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"4021 WILD ELM WAY","system_capacity_kw_dc":"5.98"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"4313 PEARLGATE CT","system_capacity_kw_dc":"8.84"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"6221 CARMICHAEL ST.","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"712 CHEROKEE DR","system_capacity_kw_dc":"11.38"}\n' +
',{"date_of_service":"12/2/2016 0:00:00","system_address":"902 E STUART ST.","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"12/5/2016 0:00:00","system_address":"4121 STONERIDGE CT.","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"12/9/2016 0:00:00","system_address":"1326 WOODS LANDING DR.","system_capacity_kw_dc":"15.08"}\n' +
',{"date_of_service":"12/9/2016 0:00:00","system_address":"2613 BROOKWOOD DR","system_capacity_kw_dc":"6.76"}\n' +
',{"date_of_service":"12/9/2016 0:00:00","system_address":"2919 VIRGINIA DALE DR.","system_capacity_kw_dc":"7.02"}\n' +
',{"date_of_service":"12/13/2016 0:00:00","system_address":"2862 PLEASANT VALLEY RD","system_capacity_kw_dc":"6.09"}\n' +
',{"date_of_service":"12/14/2016 0:00:00","system_address":"3225 KILLDEER DR.","system_capacity_kw_dc":"3.24"}\n' +
',{"date_of_service":"12/16/2016 0:00:00","system_address":"2220 HAYMAKER LN.","system_capacity_kw_dc":"5.98"}\n' +
',{"date_of_service":"12/16/2016 0:00:00","system_address":"2238 BALLARD LN.","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"12/16/2016 0:00:00","system_address":"2612 NEWGATE CT.","system_capacity_kw_dc":"4.68"}\n' +
',{"date_of_service":"12/16/2016 0:00:00","system_address":"430 HEMLOCK ST","system_capacity_kw_dc":"10.66"}\n' +
',{"date_of_service":"12/16/2016 0:00:00","system_address":"507 HOLYOKE CT.","system_capacity_kw_dc":"8.96"}\n' +
',{"date_of_service":"12/20/2016 0:00:00","system_address":"309 URBAN PRAIRIE ST. UNIT 4","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"12/20/2016 0:00:00","system_address":"309 URBAN PRAIRIE ST. UNIT 5","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"12/21/2016 0:00:00","system_address":"1438 FORRESTAL DRIVE","system_capacity_kw_dc":"6.36"}\n' +
',{"date_of_service":"12/21/2016 0:00:00","system_address":"2254 SMALLWOOD DRIVE","system_capacity_kw_dc":"5.30"}\n' +
',{"date_of_service":"12/21/2016 0:00:00","system_address":"518 NORTH WHITCOMB ST.","system_capacity_kw_dc":"5.98"}\n' +
',{"date_of_service":"12/23/2016 0:00:00","system_address":"309 URBAN PRAIRIE ST. UNIT 1","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"12/23/2016 0:00:00","system_address":"309 URBAN PRAIRIE ST. UNIT 2","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"12/23/2016 0:00:00","system_address":"309 URBAN PRAIRIE ST. UNIT 3","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"12/30/2016 0:00:00","system_address":"1538 FORRESTAL DR.","system_capacity_kw_dc":"8.40"}\n' +
',{"date_of_service":"12/30/2016 0:00:00","system_address":"2719 CANTERBURY DR.","system_capacity_kw_dc":"8.17"}\n' +
',{"date_of_service":"12/30/2016 0:00:00","system_address":"3207 NESBIT CT","system_capacity_kw_dc":"7.19"}\n' +
',{"date_of_service":"12/30/2016 0:00:00","system_address":"3703 FULL MOON DRIVE","system_capacity_kw_dc":"7.02"}\n' +
',{"date_of_service":"12/30/2016 0:00:00","system_address":"4232 WESTSHORE WAY","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"12/30/2016 0:00:00","system_address":"5232 FOX HILLS DRIVE","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"1/6/2017 0:00:00","system_address":"1132 LAKECREST CT.","system_capacity_kw_dc":"4.41"}\n' +
',{"date_of_service":"1/10/2017 0:00:00","system_address":"2121 BROOKWOOD DRIVE","system_capacity_kw_dc":"5.88"}\n' +
',{"date_of_service":"1/12/2017 0:00:00","system_address":"3924 BENTHAVEN ST.","system_capacity_kw_dc":"5.70"}\n' +
',{"date_of_service":"1/12/2017 0:00:00","system_address":"856 RIDGE RUNNER DRIVE","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"1/13/2017 0:00:00","system_address":"1130 STRATBOROUGH LANE","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"1/13/2017 0:00:00","system_address":"2528 STANFORD RD","system_capacity_kw_dc":"9.15"}\n' +
',{"date_of_service":"1/13/2017 0:00:00","system_address":"321 GREEN LEAF ST.","system_capacity_kw_dc":"9.28"}\n' +
',{"date_of_service":"1/13/2017 0:00:00","system_address":"900 BENSON LANE","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"1/19/2017 0:00:00","system_address":"1101 LORY ST","system_capacity_kw_dc":"5.04"}\n' +
',{"date_of_service":"1/19/2017 0:00:00","system_address":"3487 WARREN FARM DR","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"1/23/2017 0:00:00","system_address":"386 CAJETAN ST.","system_capacity_kw_dc":"3.80"}\n' +
',{"date_of_service":"1/25/2017 0:00:00","system_address":"233A URBAN PRAIRIE STREET","system_capacity_kw_dc":"8.48"}\n' +
',{"date_of_service":"1/25/2017 0:00:00","system_address":"2525 LYNNHAVEN LANE","system_capacity_kw_dc":"8.12"}\n' +
',{"date_of_service":"1/26/2017 0:00:00","system_address":"2456 BAR HARBOR DRIVE","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"1/26/2017 0:00:00","system_address":"2706 BROOKWOOD CT","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"1/26/2017 0:00:00","system_address":"2743 BLUEGRASS DR","system_capacity_kw_dc":"2.60"}\n' +
',{"date_of_service":"1/31/2017 0:00:00","system_address":"1002 AKIN AVE","system_capacity_kw_dc":"4.94"}\n' +
',{"date_of_service":"2/7/2017 0:00:00","system_address":"1707 SPROCKET DR.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"2/7/2017 0:00:00","system_address":"1814 DEEP WOODS LN.","system_capacity_kw_dc":"7.80"}\n' +
',{"date_of_service":"2/7/2017 0:00:00","system_address":"2121 YEARLING AVE","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"2/7/2017 0:00:00","system_address":"4333 MESAVIEW LANE","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"2/10/2017 0:00:00","system_address":"1206 MARIPOSA CT.","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"2/13/2017 0:00:00","system_address":"3000 SAN LUIS CT.","system_capacity_kw_dc":"7.20"}\n' +
',{"date_of_service":"2/13/2017 0:00:00","system_address":"715 ELM ST.","system_capacity_kw_dc":"5.35"}\n' +
',{"date_of_service":"2/14/2017 0:00:00","system_address":"1501 BIRMINGHAM DR.","system_capacity_kw_dc":"4.94"}\n' +
',{"date_of_service":"2/15/2017 0:00:00","system_address":"2013 OVERLOOK DR.","system_capacity_kw_dc":"6.20"}\n' +
',{"date_of_service":"2/15/2017 0:00:00","system_address":"2221 PURDUE ROAD","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"2/15/2017 0:00:00","system_address":"2624 PAMPAS DR.","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"2/15/2017 0:00:00","system_address":"3756 WATERGLEN PL.","system_capacity_kw_dc":"3.46"}\n' +
',{"date_of_service":"2/21/2017 0:00:00","system_address":"1306 SILK OAK DRIVE","system_capacity_kw_dc":"3.38"}\n' +
',{"date_of_service":"2/22/2017 0:00:00","system_address":"2709 INDIAN PEAKS PLACE","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"2/27/2017 0:00:00","system_address":"5726 BIG CANYON DR.","system_capacity_kw_dc":"6.93"}\n' +
',{"date_of_service":"3/1/2017 0:00:00","system_address":"214 EGYPTIAN CT.","system_capacity_kw_dc":"10.92"}\n' +
',{"date_of_service":"3/1/2017 0:00:00","system_address":"2502 THOREAU DR.","system_capacity_kw_dc":"2.83"}\n' +
',{"date_of_service":"3/1/2017 0:00:00","system_address":"518 N. LOOMIS","system_capacity_kw_dc":"63.60"}\n' +
',{"date_of_service":"3/7/2017 0:00:00","system_address":"2303 SUNBURY LN.","system_capacity_kw_dc":"7.28"}\n' +
',{"date_of_service":"3/7/2017 0:00:00","system_address":"2608 MILTON LANE","system_capacity_kw_dc":"5.46"}\n' +
',{"date_of_service":"3/8/2017 0:00:00","system_address":"2301 PLAINS CT.","system_capacity_kw_dc":"5.67"}\n' +
',{"date_of_service":"3/8/2017 0:00:00","system_address":"2641 KILLDEER DR.","system_capacity_kw_dc":"6.24"}\n' +
',{"date_of_service":"3/8/2017 0:00:00","system_address":"2909 SUNSTONE DR.","system_capacity_kw_dc":"4.35"}\n' +
',{"date_of_service":"3/21/2017 0:00:00","system_address":"1017 W. MAGNOLIA ST.","system_capacity_kw_dc":"4.68"}\n' +
',{"date_of_service":"3/21/2017 0:00:00","system_address":"1726 FALCON RIDGE DR.","system_capacity_kw_dc":"7.24"}\n' +
',{"date_of_service":"3/21/2017 0:00:00","system_address":"2967 ADOBE DR.","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"3/21/2017 0:00:00","system_address":"3027 VIRGINIA DALE DR.","system_capacity_kw_dc":"3.12"}\n' +
',{"date_of_service":"3/21/2017 0:00:00","system_address":"741 PARKVIEW DR.","system_capacity_kw_dc":"5.67"}\n' +
',{"date_of_service":"3/22/2017 0:00:00","system_address":"2007 UNION DR.","system_capacity_kw_dc":"11.48"}\n' +
',{"date_of_service":"3/22/2017 0:00:00","system_address":"2420 COPPER CREST LN.","system_capacity_kw_dc":"5.55"}\n' +
',{"date_of_service":"3/22/2017 0:00:00","system_address":"2601 BROWNSTONE CT.","system_capacity_kw_dc":"13.52"}\n' +
',{"date_of_service":"3/23/2017 0:00:00","system_address":"2219 WAKEFIELD DRIVE","system_capacity_kw_dc":"4.09"}\n' +
',{"date_of_service":"3/23/2017 0:00:00","system_address":"2313 CEDARWOOD DR.","system_capacity_kw_dc":"2.08"}\n' +
',{"date_of_service":"3/23/2017 0:00:00","system_address":"2519 SHAVANO COURT","system_capacity_kw_dc":"7.84"}\n' +
',{"date_of_service":"3/23/2017 0:00:00","system_address":"701 FRONTIER CT.","system_capacity_kw_dc":"13.54"}\n' +
',{"date_of_service":"3/23/2017 0:00:00","system_address":"7151 EDEN RIDGE LANE","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"3/24/2017 0:00:00","system_address":"2156 YEARLING DR.","system_capacity_kw_dc":"8.70"}\n' +
',{"date_of_service":"3/24/2017 0:00:00","system_address":"2307 PLAINS CT.","system_capacity_kw_dc":"5.67"}\n' +
',{"date_of_service":"3/27/2017 0:00:00","system_address":"1706 CONSTITUTION COURT","system_capacity_kw_dc":"7.68"}\n' +
',{"date_of_service":"3/28/2017 0:00:00","system_address":"3925 BENTHAVEN ST.","system_capacity_kw_dc":"4.41"}\n' +
',{"date_of_service":"3/29/2017 0:00:00","system_address":"320 URBAN PRAIRIE","system_capacity_kw_dc":"8.48"}\n' +
',{"date_of_service":"3/30/2017 0:00:00","system_address":"2627 COUNTY FAIR LANE","system_capacity_kw_dc":"7.95"}\n' +
',{"date_of_service":"4/5/2017 0:00:00","system_address":"1648 STREAMSIDE DR.","system_capacity_kw_dc":"11.48"}\n' +
',{"date_of_service":"4/6/2017 0:00:00","system_address":"1339 BANYAN DRIVE","system_capacity_kw_dc":"5.31"}\n' +
',{"date_of_service":"4/7/2017 0:00:00","system_address":"4437 STARFLOWER DR.","system_capacity_kw_dc":"2.36"}\n' +
',{"date_of_service":"4/10/2017 0:00:00","system_address":"7362 BRITTANY DR.","system_capacity_kw_dc":"6.44"}\n' +
',{"date_of_service":"4/11/2017 0:00:00","system_address":"2400 COVENTRY COURT","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"4/12/2017 0:00:00","system_address":"2257 CLEARFIELD WAY","system_capacity_kw_dc":"3.24"}\n' +
',{"date_of_service":"4/12/2017 0:00:00","system_address":"3021 OLD DOMINION CT.","system_capacity_kw_dc":"10.91"}\n' +
',{"date_of_service":"4/12/2017 0:00:00","system_address":"418 CORMORANT COURT","system_capacity_kw_dc":"9.60"}\n' +
',{"date_of_service":"4/12/2017 0:00:00","system_address":"701 WESTSHORE CT.","system_capacity_kw_dc":"6.93"}\n' +
',{"date_of_service":"4/19/2017 0:00:00","system_address":"2226 SHERWOOD FOREST COURT","system_capacity_kw_dc":"3.36"}\n' +
',{"date_of_service":"4/19/2017 0:00:00","system_address":"2602 CLARION LANE","system_capacity_kw_dc":"6.44"}\n' +
',{"date_of_service":"4/19/2017 0:00:00","system_address":"2930 WORTHINGTON AVE","system_capacity_kw_dc":"9.14"}\n' +
',{"date_of_service":"4/19/2017 0:00:00","system_address":"3414 GOLDEN CURRANT BLVD.","system_capacity_kw_dc":"7.56"}\n' +
',{"date_of_service":"4/19/2017 0:00:00","system_address":"4201 DURANGO PLACE","system_capacity_kw_dc":"5.32"}\n' +
',{"date_of_service":"4/20/2017 0:00:00","system_address":"1209 TEAKWOOD DR.","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"4/20/2017 0:00:00","system_address":"1400 PTARMIGAN CT","system_capacity_kw_dc":"3.84"}\n' +
',{"date_of_service":"4/20/2017 0:00:00","system_address":"2205 PRIMROSE DR.","system_capacity_kw_dc":"4.42"}\n' +
',{"date_of_service":"4/20/2017 0:00:00","system_address":"2220 FORECASTLE DR.","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"4/24/2017 0:00:00","system_address":"1612 SMITH PL.","system_capacity_kw_dc":"6.78"}\n' +
',{"date_of_service":"4/24/2017 0:00:00","system_address":"827 LANGDALE DRIVE","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"4/25/2017 0:00:00","system_address":"3244 GREEN LAKE DRIVE","system_capacity_kw_dc":"8.96"}\n' +
',{"date_of_service":"4/25/2017 0:00:00","system_address":"3858 CENTURY DRIVE","system_capacity_kw_dc":"2.95"}\n' +
',{"date_of_service":"4/27/2017 0:00:00","system_address":"1700 SCARBOROUGH DRIVE","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"4/27/2017 0:00:00","system_address":"2055 TUNIS CIRCLE","system_capacity_kw_dc":"5.04"}\n' +
',{"date_of_service":"4/28/2017 0:00:00","system_address":"1718 MATHEWS ST.","system_capacity_kw_dc":"3.15"}\n' +
',{"date_of_service":"5/3/2017 0:00:00","system_address":"2921 MOUNT ROYAL COURT","system_capacity_kw_dc":"3.83"}\n' +
',{"date_of_service":"5/3/2017 0:00:00","system_address":"832 CAMPFIRE DRIVE","system_capacity_kw_dc":"5.31"}\n' +
',{"date_of_service":"5/5/2017 0:00:00","system_address":"2939 BROOKWOOD PLACE","system_capacity_kw_dc":"8.40"}\n' +
',{"date_of_service":"5/5/2017 0:00:00","system_address":"4045 OAK SHADOW WAY","system_capacity_kw_dc":"4.41"}\n' +
',{"date_of_service":"5/5/2017 0:00:00","system_address":"4331 MILL CREEK COURT","system_capacity_kw_dc":"3.84"}\n' +
',{"date_of_service":"5/11/2017 0:00:00","system_address":"2020 BLUE YONDER WAY","system_capacity_kw_dc":"7.56"}\n' +
',{"date_of_service":"5/11/2017 0:00:00","system_address":"2309 STRAWFORK DRIVE","system_capacity_kw_dc":"7.24"}\n' +
',{"date_of_service":"5/11/2017 0:00:00","system_address":"2514 MARSHFIELD LANE","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"5/11/2017 0:00:00","system_address":"6300 CATTAIL COURT","system_capacity_kw_dc":"9.57"}\n' +
',{"date_of_service":"5/17/2017 0:00:00","system_address":"1734 W. MOUNTAIN AVE.","system_capacity_kw_dc":"2.83"}\n' +
',{"date_of_service":"5/17/2017 0:00:00","system_address":"2200 YORKSHIRE ST.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"5/17/2017 0:00:00","system_address":"2320 MARSHFIELD LANE","system_capacity_kw_dc":"7.37"}\n' +
',{"date_of_service":"5/17/2017 0:00:00","system_address":"2430 KODIAK ROAD","system_capacity_kw_dc":"3.92"}\n' +
',{"date_of_service":"5/17/2017 0:00:00","system_address":"2714 STONEHAVEN DRIVE","system_capacity_kw_dc":"8.85"}\n' +
',{"date_of_service":"5/22/2017 0:00:00","system_address":"3600 WESCOTT CT.","system_capacity_kw_dc":"4.41"}\n' +
',{"date_of_service":"5/22/2017 0:00:00","system_address":"707 CORONADO AVENUE","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"5/22/2017 0:00:00","system_address":"7306 STREAMSIDE DRIVE","system_capacity_kw_dc":"4.72"}\n' +
',{"date_of_service":"5/23/2017 0:00:00","system_address":"1014 CAMPFIRE DRIVE","system_capacity_kw_dc":"5.88"}\n' +
',{"date_of_service":"5/23/2017 0:00:00","system_address":"25 S TAFT HILL RD.","system_capacity_kw_dc":"2.95"}\n' +
',{"date_of_service":"5/24/2017 0:00:00","system_address":"225 TRALEE CT.","system_capacity_kw_dc":"9.20"}\n' +
',{"date_of_service":"5/24/2017 0:00:00","system_address":"2608 ASHLAND LN.","system_capacity_kw_dc":"6.93"}\n' +
',{"date_of_service":"5/26/2017 0:00:00","system_address":"2119 AYRSHIRE DRIVE","system_capacity_kw_dc":"5.10"}\n' +
',{"date_of_service":"5/26/2017 0:00:00","system_address":"2132 KERRY HILL DRIVE","system_capacity_kw_dc":"7.28"}\n' +
',{"date_of_service":"5/26/2017 0:00:00","system_address":"2537 ORCHARD PL.","system_capacity_kw_dc":"13.50"}\n' +
',{"date_of_service":"5/26/2017 0:00:00","system_address":"2614 MARSHFIELD LANE","system_capacity_kw_dc":"2.80"}\n' +
',{"date_of_service":"5/26/2017 0:00:00","system_address":"806 FOXTAIL STREET","system_capacity_kw_dc":"2.70"}\n' +
',{"date_of_service":"6/1/2017 0:00:00","system_address":"2809 BRETON WAY","system_capacity_kw_dc":"3.71"}\n' +
',{"date_of_service":"6/1/2017 0:00:00","system_address":"7438 STONINGTON COURT","system_capacity_kw_dc":"13.86"}\n' +
',{"date_of_service":"6/5/2017 0:00:00","system_address":"1221 VINSON ST.","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"6/5/2017 0:00:00","system_address":"231 N. LOOMIS AVE.","system_capacity_kw_dc":"3.20"}\n' +
',{"date_of_service":"6/7/2017 0:00:00","system_address":"3202 ANIKA DR.","system_capacity_kw_dc":"12.32"}\n' +
',{"date_of_service":"6/7/2017 0:00:00","system_address":"6409 GARRISON CT.","system_capacity_kw_dc":"7.28"}\n' +
',{"date_of_service":"6/7/2017 0:00:00","system_address":"700 CORONADO AVE.","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"6/9/2017 0:00:00","system_address":"4803 CARAVELLE DR.","system_capacity_kw_dc":"7.25"}\n' +
',{"date_of_service":"6/12/2017 0:00:00","system_address":"3509 SHALLOW POND DR.","system_capacity_kw_dc":"7.20"}\n' +
',{"date_of_service":"6/14/2017 0:00:00","system_address":"1664 FREEWHEEL DRIVE","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"6/14/2017 0:00:00","system_address":"2830 VIRGINIA DALE DR.","system_capacity_kw_dc":"4.62"}\n' +
',{"date_of_service":"6/15/2017 0:00:00","system_address":"1937 LARKSPUR DRIVE","system_capacity_kw_dc":"5.04"}\n' +
',{"date_of_service":"6/15/2017 0:00:00","system_address":"1941 LARKSPUR DRIVE","system_capacity_kw_dc":"5.04"}\n' +
',{"date_of_service":"6/16/2017 0:00:00","system_address":"2312 WAPITI RD.","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"6/16/2017 0:00:00","system_address":"421 STONEY BROOK ROAD","system_capacity_kw_dc":"8.40"}\n' +
',{"date_of_service":"6/16/2017 0:00:00","system_address":"5238 FOX HILLS DRIVE","system_capacity_kw_dc":"8.40"}\n' +
',{"date_of_service":"6/28/2017 0:00:00","system_address":"2785 EXMOOR LANE","system_capacity_kw_dc":"4.24"}\n' +
',{"date_of_service":"6/28/2017 0:00:00","system_address":"4436 VISTA DRIVE","system_capacity_kw_dc":"8.12"}\n' +
',{"date_of_service":"6/28/2017 0:00:00","system_address":"4509 HIBISCUS STREET","system_capacity_kw_dc":"10.03"}\n' +
',{"date_of_service":"6/28/2017 0:00:00","system_address":"4954 DAKOTA DRIVE","system_capacity_kw_dc":"8.40"}\n' +
',{"date_of_service":"6/30/2017 0:00:00","system_address":"2203 BALDWIN ST.","system_capacity_kw_dc":"5.01"}\n' +
',{"date_of_service":"6/30/2017 0:00:00","system_address":"3336 KITTERY CT.","system_capacity_kw_dc":"5.32"}\n' +
',{"date_of_service":"6/30/2017 0:00:00","system_address":"4709 CHIPPENDALE DR.","system_capacity_kw_dc":"9.86"}\n' +
',{"date_of_service":"7/5/2017 0:00:00","system_address":"2138 BALLARD LN.","system_capacity_kw_dc":"2.40"}\n' +
',{"date_of_service":"7/7/2017 0:00:00","system_address":"3730 BROMLEY DR.","system_capacity_kw_dc":"6.82"}\n' +
',{"date_of_service":"7/10/2017 0:00:00","system_address":"1412 W OAK STREET","system_capacity_kw_dc":"5.86"}\n' +
',{"date_of_service":"7/10/2017 0:00:00","system_address":"1648 DOGWOOD COURT","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"7/11/2017 0:00:00","system_address":"2303 STRAWFORK DR.","system_capacity_kw_dc":"5.01"}\n' +
',{"date_of_service":"7/11/2017 0:00:00","system_address":"3243 KINGFISHER CT.","system_capacity_kw_dc":"7.26"}\n' +
',{"date_of_service":"7/13/2017 0:00:00","system_address":"1045 DRIFTWOOD DR.","system_capacity_kw_dc":"2.83"}\n' +
',{"date_of_service":"7/13/2017 0:00:00","system_address":"3027 BRYCE DR.","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"7/13/2017 0:00:00","system_address":"315 GREEN LEAF ST.","system_capacity_kw_dc":"8.54"}\n' +
',{"date_of_service":"7/13/2017 0:00:00","system_address":"3274 GREEN LAKE DR.","system_capacity_kw_dc":"3.08"}\n' +
',{"date_of_service":"7/19/2017 0:00:00","system_address":"2225 SHEFFIELD DR.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"7/19/2017 0:00:00","system_address":"2709 TREASURE COVE","system_capacity_kw_dc":"3.64"}\n' +
',{"date_of_service":"7/20/2017 0:00:00","system_address":"1202 BATELEUR LN.","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"7/20/2017 0:00:00","system_address":"314 URBAN PRAIRIE ST.","system_capacity_kw_dc":"9.15"}\n' +
',{"date_of_service":"7/26/2017 0:00:00","system_address":"3206 RED MOUNTAIN DR","system_capacity_kw_dc":"6.20"}\n' +
',{"date_of_service":"7/28/2017 0:00:00","system_address":"2537 RIDGE CREEK RD.","system_capacity_kw_dc":"5.94"}\n' +
',{"date_of_service":"7/31/2017 0:00:00","system_address":"1808 GLOBE CT.","system_capacity_kw_dc":"7.08"}\n' +
',{"date_of_service":"7/31/2017 0:00:00","system_address":"2618 PAMPAS DR.","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"8/1/2017 0:00:00","system_address":"2419 PINE NEEDLE COURT","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"8/2/2017 0:00:00","system_address":"6726 SNOWDON DR.","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"8/4/2017 0:00:00","system_address":"1133 SAINT CROIX PL.","system_capacity_kw_dc":"8.10"}\n' +
',{"date_of_service":"8/4/2017 0:00:00","system_address":"1336 REDWOOD ST.","system_capacity_kw_dc":"4.68"}\n' +
',{"date_of_service":"8/9/2017 0:00:00","system_address":"814 COURTENAY CIRCLE","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"8/18/2017 0:00:00","system_address":"6915 HANCOCK DR.","system_capacity_kw_dc":"3.08"}\n' +
',{"date_of_service":"8/18/2017 0:00:00","system_address":"915 W MAGNOLIA STREET","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"8/21/2017 0:00:00","system_address":"2208 SANDBUR DR.","system_capacity_kw_dc":"5.52"}\n' +
',{"date_of_service":"8/24/2017 0:00:00","system_address":"3245 SAGEWATER CT.","system_capacity_kw_dc":"6.90"}\n' +
',{"date_of_service":"8/28/2017 0:00:00","system_address":"2244 HAYMAKER LANE","system_capacity_kw_dc":"4.27"}\n' +
',{"date_of_service":"8/28/2017 0:00:00","system_address":"2256 LAGER STREET","system_capacity_kw_dc":"3.99"}\n' +
',{"date_of_service":"8/28/2017 0:00:00","system_address":"527 MUSKEGON COURT","system_capacity_kw_dc":"4.56"}\n' +
',{"date_of_service":"8/28/2017 0:00:00","system_address":"725 WAGONWHEEL DR.","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"8/29/2017 0:00:00","system_address":"323 NEWAYGO COURT","system_capacity_kw_dc":"6.84"}\n' +
',{"date_of_service":"8/31/2017 0:00:00","system_address":"2438 STRAWFORK DRIVE","system_capacity_kw_dc":"6.27"}\n' +
',{"date_of_service":"9/1/2017 0:00:00","system_address":"1057 DRIFTWOOD DRIVE","system_capacity_kw_dc":"7.20"}\n' +
',{"date_of_service":"9/1/2017 0:00:00","system_address":"1515 TANG COURT","system_capacity_kw_dc":"3.71"}\n' +
',{"date_of_service":"9/8/2017 0:00:00","system_address":"2836 EDINBURGH COURT","system_capacity_kw_dc":"6.44"}\n' +
',{"date_of_service":"9/8/2017 0:00:00","system_address":"623 MONTE VISTA AVENUE","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"9/12/2017 0:00:00","system_address":"1937 JAMISON DRIVE","system_capacity_kw_dc":"9.86"}\n' +
',{"date_of_service":"9/12/2017 0:00:00","system_address":"438 HOUGHTON COURT","system_capacity_kw_dc":"5.42"}\n' +
',{"date_of_service":"9/14/2017 0:00:00","system_address":"2239 WESTCHASE RD.","system_capacity_kw_dc":"5.98"}\n' +
',{"date_of_service":"9/15/2017 0:00:00","system_address":"5627 COPPERVEIN ST.","system_capacity_kw_dc":"7.20"}\n' +
',{"date_of_service":"9/18/2017 0:00:00","system_address":"2220 SHERWOOD FOREST CT.","system_capacity_kw_dc":"4.35"}\n' +
',{"date_of_service":"9/18/2017 0:00:00","system_address":"2518 PINECONE CIRCLE","system_capacity_kw_dc":"8.96"}\n' +
',{"date_of_service":"9/18/2017 0:00:00","system_address":"2536 MYRTLE CT.","system_capacity_kw_dc":"6.49"}\n' +
',{"date_of_service":"9/19/2017 0:00:00","system_address":"2103 BLUE YONDER WAY","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"9/19/2017 0:00:00","system_address":"2714 HOLLY STREET","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"9/19/2017 0:00:00","system_address":"5715 COPPERVEIN STREET","system_capacity_kw_dc":"10.80"}\n' +
',{"date_of_service":"9/19/2017 0:00:00","system_address":"7109 WOODROW DRIVE","system_capacity_kw_dc":"9.90"}\n' +
',{"date_of_service":"9/20/2017 0:00:00","system_address":"2132 SAISON ST.","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"9/20/2017 0:00:00","system_address":"220 CAJETAN STREET","system_capacity_kw_dc":"3.60"}\n' +
',{"date_of_service":"9/22/2017 0:00:00","system_address":"1056 BRIARWOOD ROAD","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"9/25/2017 0:00:00","system_address":"1412 CENTENNIAL RD","system_capacity_kw_dc":"10.07"}\n' +
',{"date_of_service":"9/26/2017 0:00:00","system_address":"515 MUSKEGON COURT","system_capacity_kw_dc":"4.85"}\n' +
',{"date_of_service":"9/26/2017 0:00:00","system_address":"518 HOLYOKE COURT","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"9/26/2017 0:00:00","system_address":"619 STOVER ST.","system_capacity_kw_dc":"2.40"}\n' +
',{"date_of_service":"10/5/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 3","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"10/6/2017 0:00:00","system_address":"4225 KINGSBURY DR.","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"10/6/2017 0:00:00","system_address":"501 E LAUREL ST.","system_capacity_kw_dc":"3.57"}\n' +
',{"date_of_service":"10/10/2017 0:00:00","system_address":"1331 PATTERSON PLACE","system_capacity_kw_dc":"3.08"}\n' +
',{"date_of_service":"10/10/2017 0:00:00","system_address":"3503 MUSKRAT CREEK DR.","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"10/10/2017 0:00:00","system_address":"4130 SNOW RIDGE CIRCLE","system_capacity_kw_dc":"5.79"}\n' +
',{"date_of_service":"10/11/2017 0:00:00","system_address":"6309 MORNING LIGHT PLACE","system_capacity_kw_dc":"11.89"}\n' +
',{"date_of_service":"10/13/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 10","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"10/13/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 11","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"10/13/2017 0:00:00","system_address":"4231 STARFLOWER DRIVE","system_capacity_kw_dc":"5.32"}\n' +
',{"date_of_service":"10/17/2017 0:00:00","system_address":"2791 EXMOOR LN.","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"10/18/2017 0:00:00","system_address":"2214 SUMMERPARK LN.","system_capacity_kw_dc":"5.20"}\n' +
',{"date_of_service":"10/18/2017 0:00:00","system_address":"3042 INDIGO CIRCLE NORTH","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"10/19/2017 0:00:00","system_address":"1707 SAGEWOOD DR.","system_capacity_kw_dc":"6.00"}\n' +
',{"date_of_service":"10/20/2017 0:00:00","system_address":"2208 LAPORTE AVE.","system_capacity_kw_dc":"2.32"}\n' +
',{"date_of_service":"10/20/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 12","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"10/23/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 8","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"10/23/2017 0:00:00","system_address":"3201 BOONE STREET","system_capacity_kw_dc":"3.92"}\n' +
',{"date_of_service":"10/24/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 1","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"10/24/2017 0:00:00","system_address":"6208 WESTCHASE RD.","system_capacity_kw_dc":"10.72"}\n' +
',{"date_of_service":"10/25/2017 0:00:00","system_address":"165 CHESTNUT ST.","system_capacity_kw_dc":"92.34"}\n' +
',{"date_of_service":"10/25/2017 0:00:00","system_address":"2638 KIT FOX COURT","system_capacity_kw_dc":"8.64"}\n' +
',{"date_of_service":"10/27/2017 0:00:00","system_address":"117 COLUMBIA ROAD","system_capacity_kw_dc":"6.10"}\n' +
',{"date_of_service":"10/27/2017 0:00:00","system_address":"1306 CLEMENTINE COURT","system_capacity_kw_dc":"2.40"}\n' +
',{"date_of_service":"10/27/2017 0:00:00","system_address":"1725 SAGEWOOD DRIVE","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"11/1/2017 0:00:00","system_address":"1305 LORY STREET","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"11/6/2017 0:00:00","system_address":"2913 MIDDLESBOROUGH CT.","system_capacity_kw_dc":"8.26"}\n' +
',{"date_of_service":"11/9/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 5","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"11/9/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 9","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"11/13/2017 0:00:00","system_address":"2407 LEGHORN DRIVE","system_capacity_kw_dc":"3.90"}\n' +
',{"date_of_service":"11/15/2017 0:00:00","system_address":"6208 TREESTEAD COURT","system_capacity_kw_dc":"8.70"}\n' +
',{"date_of_service":"11/16/2017 0:00:00","system_address":"2301 SHEFFIELD DR.","system_capacity_kw_dc":"3.08"}\n' +
',{"date_of_service":"11/20/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 2","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"11/20/2017 0:00:00","system_address":"225 GREEN LEAF ST. UNIT 4","system_capacity_kw_dc":"6.40"}\n' +
',{"date_of_service":"11/20/2017 0:00:00","system_address":"2551 SUNBURY LANE","system_capacity_kw_dc":"11.40"}\n' +
',{"date_of_service":"11/20/2017 0:00:00","system_address":"3250 HONEYSUCKLE CT.","system_capacity_kw_dc":"7.67"}\n' +
',{"date_of_service":"11/21/2017 0:00:00","system_address":"2226 FORECASTLE DR.","system_capacity_kw_dc":"5.90"}\n' +
',{"date_of_service":"11/22/2017 0:00:00","system_address":"2420 PALOMINO DRIVE","system_capacity_kw_dc":"7.45"}\n' +
',{"date_of_service":"11/27/2017 0:00:00","system_address":"347 TORONTO ST.","system_capacity_kw_dc":"4.88"}\n' +
',{"date_of_service":"11/27/2017 0:00:00","system_address":"5627 BIG CANYON DRIVE","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"11/29/2017 0:00:00","system_address":"3937 HARBOR WALK LANE","system_capacity_kw_dc":"17.08"}\n' +
',{"date_of_service":"11/30/2017 0:00:00","system_address":"545 WALHALLA COURT","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"11/30/2017 0:00:00","system_address":"623 E PLUM ST.","system_capacity_kw_dc":"4.20"}\n' +
',{"date_of_service":"12/4/2017 0:00:00","system_address":"2463 IOWA DRIVE","system_capacity_kw_dc":"7.00"}\n' +
',{"date_of_service":"12/7/2017 0:00:00","system_address":"1714 DEEP WOODS LANE","system_capacity_kw_dc":"4.55"}\n' +
',{"date_of_service":"12/7/2017 0:00:00","system_address":"2826 COUNTY FAIR LANE","system_capacity_kw_dc":"6.03"}\n' +
',{"date_of_service":"12/7/2017 0:00:00","system_address":"4044 WILD ELM WAY","system_capacity_kw_dc":"7.50"}\n' +
',{"date_of_service":"12/7/2017 0:00:00","system_address":"4212 STARFLOWER DRIVE","system_capacity_kw_dc":"9.10"}\n' +
',{"date_of_service":"12/7/2017 0:00:00","system_address":"5858 HUNTINGTON HILLS DRIVE","system_capacity_kw_dc":"8.70"}\n' +
',{"date_of_service":"12/8/2017 0:00:00","system_address":"1639 HAYWOOD PL.","system_capacity_kw_dc":"7.47"}\n' +
',{"date_of_service":"12/8/2017 0:00:00","system_address":"730 GALLUP ROAD","system_capacity_kw_dc":"2.74"}\n' +
',{"date_of_service":"12/8/2017 0:00:00","system_address":"900 OXFORD LN.","system_capacity_kw_dc":"5.70"}\n' +
',{"date_of_service":"12/12/2017 0:00:00","system_address":"3544 WARREN FARM CT.","system_capacity_kw_dc":"4.40"}\n' +
',{"date_of_service":"12/14/2017 0:00:00","system_address":"2601 W. MULBERRY ST.","system_capacity_kw_dc":"3.00"}\n' +
',{"date_of_service":"12/14/2017 0:00:00","system_address":"3406 STOVER STREET","system_capacity_kw_dc":"9.90"}\n' +
',{"date_of_service":"12/18/2017 0:00:00","system_address":"1400 TICONDEROGA DRIVE","system_capacity_kw_dc":"6.60"}\n' +
',{"date_of_service":"12/19/2017 0:00:00","system_address":"2160 BLACKBIRD DRIVE","system_capacity_kw_dc":"4.50"}\n' +
',{"date_of_service":"12/20/2017 0:00:00","system_address":"2314 COPPER MILL LANE","system_capacity_kw_dc":"9.15"}\n' +
',{"date_of_service":"12/20/2017 0:00:00","system_address":"2709 AUTUMN HARVEST WAY","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"12/21/2017 0:00:00","system_address":"703 HARTS GARDENS LN.","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"12/27/2017 0:00:00","system_address":"2544 BALLARD LANE","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"12/27/2017 0:00:00","system_address":"3738 COSMOS LANE","system_capacity_kw_dc":"3.25"}\n' +
',{"date_of_service":"12/28/2017 0:00:00","system_address":"3284 SILVERTHORNE DR.","system_capacity_kw_dc":"7.80"}\n' +
',{"date_of_service":"1/2/2018 0:00:00","system_address":"2645 MILTON LANE","system_capacity_kw_dc":"3.30"}\n' +
',{"date_of_service":"1/2/2018 0:00:00","system_address":"7445 STONINGTON COURT","system_capacity_kw_dc":"5.40"}\n' +
',{"date_of_service":"1/3/2018 0:00:00","system_address":"826 RIDGE RUNNER DR","system_capacity_kw_dc":"3.14"}\n' +
',{"date_of_service":"1/4/2018 0:00:00","system_address":"1807 W. VINE DRIVE","system_capacity_kw_dc":"7.93"}\n' +
',{"date_of_service":"1/4/2018 0:00:00","system_address":"3015 PERCHERON DR.","system_capacity_kw_dc":"3.70"}\n' +
',{"date_of_service":"1/4/2018 0:00:00","system_address":"3203 ANIKA DRIVE","system_capacity_kw_dc":"4.56"}\n' +
',{"date_of_service":"1/8/2018 0:00:00","system_address":"1550 REEVES DRIVE","system_capacity_kw_dc":"9.38"}\n' +
',{"date_of_service":"1/8/2018 0:00:00","system_address":"2818 MCKEAG DRIVE","system_capacity_kw_dc":"7.01"}\n' +
',{"date_of_service":"1/9/2018 0:00:00","system_address":"1418 RED OAK COURT","system_capacity_kw_dc":"6.78"}\n' +
',{"date_of_service":"1/10/2018 0:00:00","system_address":"1412 TICONDEROGA DR.","system_capacity_kw_dc":"5.70"}\n' +
',{"date_of_service":"1/11/2018 0:00:00","system_address":"1218 HAWKEYE COURT","system_capacity_kw_dc":"9.45"}\n' +
',{"date_of_service":"1/11/2018 0:00:00","system_address":"2507 PEAR COURT","system_capacity_kw_dc":"6.10"}\n' +
',{"date_of_service":"1/12/2018 0:00:00","system_address":"2212 SUNLEAF CT.","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"1/12/2018 0:00:00","system_address":"3819 DAHLIA COURT","system_capacity_kw_dc":"3.25"}\n' +
',{"date_of_service":"1/12/2018 0:00:00","system_address":"701 KIMBALL ROAD","system_capacity_kw_dc":"3.25"}\n' +
',{"date_of_service":"8/25/2017 0:00:00","system_address":"3202 REEDGRASS CT.","system_capacity_kw_dc":"2.40"}\n' +
',{"date_of_service":"9/19/2014 0:00:00","system_address":"3802 WILD ELM WAY","system_capacity_kw_dc":"4.70"}\n' +
',{"date_of_service":"Date of Service","system_address":"System Address","system_capacity_kw_dc":"System Capacity kW-DC"}\n' +
',{"date_of_service":"7/31/2017 0:00:00","system_address":"2721 HOLLY ST.","system_capacity_kw_dc":"3.54"}\n' +
',{"date_of_service":"5/13/2016 0:00:00","system_address":"1801 RUTLEDGE CT","system_capacity_kw_dc":"7.02"}\n' +
',{"date_of_service":"2/23/2016 0:00:00","system_address":"518 FOX GLOVE CT","system_capacity_kw_dc":"5.56"}\n' +
',{"date_of_service":"9/21/2011 0:00:00","system_address":"1609 EAST HARMONY ROAD","system_capacity_kw_dc":"14.85"}\n' +
',{"date_of_service":"10/23/2012 0:00:00","system_address":"3148 BIRMINGHAM DR.,","system_capacity_kw_dc":"4.80"}\n' +
',{"date_of_service":"5/10/2013 0:00:00","system_address":"3406 RED MOUNTAIN DRIVE","system_capacity_kw_dc":"6.50"}\n' +
',{"date_of_service":"6/28/2017 0:00:00","system_address":"1608 INDEPENDENCE CT.","system_capacity_kw_dc":"2.76"}\n' +
',{"date_of_service":"5/21/2010 0:00:00","system_address":"CSU 325 W. LAKE ST. PARKING","system_capacity_kw_dc":"125.00"}\n' +
',{"date_of_service":"3/7/2017 0:00:00","system_address":"5926 HUNTINGTON HILLS DR.","system_capacity_kw_dc":"5.67"}\n' +
',{"date_of_service":"7/14/2015 0:00:00","system_address":"761 CHEROKEE DRIVE","system_capacity_kw_dc":"4.48"}\n' +
',{"date_of_service":"1/12/2018 0:00:00","system_address":"3179 WORTHINGTON AVE.","system_capacity_kw_dc":"6.30"}\n' +
',{"date_of_service":"6/10/2010 0:00:00","system_address":"200 W OAK ST.","system_capacity_kw_dc":"27.00"}\n' +
',{"date_of_service":"1/11/2010 0:00:00","system_address":"800 E. LINCOLN","system_capacity_kw_dc":"77.00"}\n' +
',{"date_of_service":"12/19/2017 0:00:00","system_address":"812 BUCKEYE ST.","system_capacity_kw_dc":"10.40"}\n' +
',{"date_of_service":"2/27/2017 0:00:00","system_address":"954 FOXTAIL STREET","system_capacity_kw_dc":"3.90"}]\n'

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'myservice/username?id=some-unique-id');
// xhr.onload = function() {
//     if (xhr.status === 200) {
//         alert('User\'s name is ' + xhr.responseText);
//     }
//     else {
//         alert('Request failed.  Returned status of ' + xhr.status);
//     }
// };
// xhr.send();

export let fortCollinsData = (function() {
    const apiResponse = JSON.parse(fcApiResp);
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
}());

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
      data: {
        boulder: boulderData,
        fortCollins: fortCollinsData
      },
    });
  },
  render: h => h(Main),
}).$mount('#app');

export default SolarScorecard;
