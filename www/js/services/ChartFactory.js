angular.module('starter.services')
.factory('ChartFactory', function() {
  return {
    buildChart: function(rateObjArray){
      if (rateObjArray && rateObjArray.length){
        var arrLength = rateObjArray.length;
        var rateArray = new Array(arrLength);
        var dateArray = new Array(arrLength);
        for (var i=0; i < arrLength; i++){
          rateArray[i] = rateObjArray[i].Rate;
          dateArray[i] = rateObjArray[i]._Date;
        }
        var pointR = 3;
        if (arrLength > 100){
          pointR = 0;
        }
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateArray,
                datasets: [{
                    label: 'Rate',
                    data: rateArray,
                    backgroundColor:'rgba(254, 201, 0, 0.3)',
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointRadius: pointR
                }]
            },
            options: {
              title: {
                 display: false,
               },
               legend: {
                 display: false
               },
               animation: {
                 duration: 300
               }
            }
        });
     }
   }
 };
});
