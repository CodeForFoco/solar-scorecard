/*
Config Object
{ id : String,
  tabs : Array {
    id : String,
    label : String
  }
}
*/
function Tabs(config) {
  var btnTemplate = document.getElementById('template--btn').innerHTML,
    chartTemplate = document.getElementById('template--chart').innerHTML,
    btnsRendered = Mustache.render(btnTemplate, config),
    chartsRendered = Mustache.render(chartTemplate, config);

  document.getElementById('stairstep-chart-tabs').innerHTML = btnsRendered;
  document.getElementById('charts').innerHTML = chartsRendered;

  makeTabs();

  // Array Tabs -> Array AElements
  function makeTabs() {
    var chartToggleElems = document.querySelectorAll('.solarchart-tab.button'),
      anchor;

    for (var i = 0, max = chartToggleElems.length; i < max; i += 1) {
      anchor = chartToggleElems[i];

      anchor.addEventListener('click', showHideChart);
    }
  }

  function showHideChart(event) {
    var chartId = event.srcElement.dataset.chartId,
      allChartElems = document.querySelectorAll('.solarchart-tab-content'),
      chartElem, display = '';

    for (var i = 0; i < allChartElems.length; i++) {
      chartElem = allChartElems[i];

      if (chartElem.dataset.chartId !== chartId) {
        display = 'none';
      } else {        
        display = 'block';
      }

      chartElem.style.display = display;
    }

    StairstepChart({
      id : chartId,
      data: demodata
    });
  }

}
