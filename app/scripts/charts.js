function drawChart() {

  var data = new google.visualization.DataTable();
  var arrayData = [
  ];

  var newArrayData = JSON.parse(window.localStorage.getItem('datas'));
  var orderedData = [];
  if (Array.isArray(newArrayData) && Array.isArray(newArrayData[0])) {
    // Reconvertimos el valor fecha de String a Date...
    // ...y ordenamos por fecha
    for (var i=0; i < newArrayData.length; i++) {
      newArrayData[i][0] = new Date(newArrayData[i][0]);
      if(orderedData.length === 0) {
        orderedData.push(newArrayData[i]);
      } else {
        // Recorremos el array para colocar el nuevo dato
        for (var j=0; j < orderedData.length; j++) {
          if (newArrayData[i][0] < orderedData[j][0]) {
            var od = orderedData.slice();
            var p1array = od.splice(0, j) || [];
            p1array.push(newArrayData[i]);
            var p2array = orderedData.splice(j) || [];
            orderedData = p1array.concat(p2array);
            break;
          }
        }
        if (newArrayData[i][0] >= orderedData[orderedData.length-1][0]) {
          orderedData.push(newArrayData[i]);
        }
      }
    }
    arrayData = orderedData;
  }

  data.addColumn('datetime', 'Y');
  data.addColumn('number', 'Valor');

  data.addRows(arrayData);

  var options = {
    hAxis: {
      title: 'Fecha',
      format: 'dd/MM/yy'
    },
    vAxis: {
      title: 'Valor'
    },
    legend: 'none',
    height: '300',
    title: 'Valores por Fecha'
  };

  var formatter_short = new google.visualization.DateFormat({pattern: 'dd/MM/yyyy'});
  formatter_short.format(data, 0);

  var chart = new google.visualization.LineChart(document.getElementById('chart'));

  chart.draw(data, options);

}

$(document).ready(function() {

  $(window).resize(function() {
    drawChart();
  }).trigger('resize');

  $(window).on("resize orientationchange", function(){
    drawChart();
  });

  google.load('visualization', '1', {packages: ['corechart']});
  google.setOnLoadCallback(drawChart());

});
