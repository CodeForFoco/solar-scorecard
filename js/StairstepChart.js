// { data : Array [year, value],
//   id : String,
//   element : Element }
function StairstepChart(config) {
  var data = config.data;
  var id = config.id;

  var ctx = config.element || document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.all.map(function(obj) {
        return obj.date.getFullYear();
      }),
      datasets: [
        {
          steppedLine: true,
          label: 'Solar Added to System (kW)',
          data: data.past.map(function(obj) {
            return {x:obj.date.getFullYear(), y : obj.value};
          }),
          backgroundColor: "rgba(255, 99, 132, 0.2)"
          ,borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        },
        {
          steppedLine: true,
          label: 'Projected Solor Added to System (kw)',
          data: data.futurePlus.map(function(obj) {
            return {x:obj.date.getFullYear(), y : obj.value};
          }),
          backgroundColor: "rgba(255, 99, 132, 0.2",
          borderColor: [
            'blue'
          ],
          borderWidth: 2
        },
        {
          label: 'Fort Collins Climate Goal (kW Electicity)',
          data: [{x:2020,y:50},{x:2030,y:100}],
          backgroundColor: "transparent"
          ,borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
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
          }
        }]
      }
    }
  });

}
