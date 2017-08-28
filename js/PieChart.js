import Chart from 'chart.js';

// { data : Array [{label:value}],
//   selector : SelectorString for Canvas Element,
//   element : CanvasElement }
export default function PieChart(config) {

  let data = config.data;
  let selector = config.selector;
  let element = config.element || document.querySelector(selector);
  if (!element) {
    throw new Error('Could not find a canvas element to bind the chart to. Attempted selector was "' + selector + '"')
  }

  let ctx = element.getContext('2d');
  
  let dataset = [];
  let labels = [];
  for(var i in data) {
    if (data.hasOwnProperty(i)) {
      dataset.push(data[i]),
      labels.push(i);
        
    }    
  }
  var stairChart = new Chart(ctx, {
    type: 'pie',
    data: {
      datasets: [{
        data : dataset,
        backgroundColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ]
      }],
      labels:labels
    },
    options: Chart.defaults.doughnut,
    
    responsive: true,
    maintainAspectRatio: true
  });

}
