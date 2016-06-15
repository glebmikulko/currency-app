angular.module('starter.controllers')
.controller('CurrencyCtrl', function($scope, $stateParams, CurrencyFactory, HttpService, DateFactory) {
  $scope.currency = CurrencyFactory.get($stateParams.currencyId);
  $scope.timeOffset = "week";

  $scope.changeTimeOffset = function(offset){
    $scope.timeOffset = offset;
    // console.log($scope.rateArray);
    HttpService.getRateArray($scope.currency.idNBRB, $scope.timeOffset, function(xmlDoc){
      var x2js = new X2JS();
      var data = x2js.xml2json(xmlDoc);
      var rateArray = data.Currency.Record;
      $scope.rateArray = rateArray;
      $scope.$apply();
    });
  }

  HttpService.getLiveRate($scope.currency.id)
  .then(function(liveRate) {
     $scope.liveRate = liveRate;
   });

   HttpService.getLiveRateByNBRB().done(function(xmlDoc){
     var x2js = new X2JS();
     var dataArray = x2js.asArray(xmlDoc);
     var jsonObj = x2js.xml2json(dataArray[0]);
     var curArray = jsonObj.DailyExRates.Currency;
     for (var i = 0; i < curArray.length; i++) {
       if (curArray[i].CharCode === $scope.currency.id) {
         $scope.liveRateByNBRB = Math.floor(curArray[i].Rate);
       }
     }
   });

   HttpService.getRateArray($scope.currency.idNBRB, $scope.timeOffset, function(xmlDoc){
     var x2js = new X2JS();
     var data = x2js.xml2json(xmlDoc);
     var rateArray = data.Currency.Record;
     $scope.rateArray = rateArray;
   });

   $scope.convertDateNBRB = DateFactory.convertDateNBRB();

   $scope.buildChart = function(rateObjArray){
     if (rateObjArray && rateObjArray.length){
       var arrLength = rateObjArray.length;
       console.log(arrLength);
       var rateArray = new Array(arrLength);
       var dateArray = new Array(arrLength);
       for (var i=0; i < arrLength; i++){
         rateArray[i] = rateObjArray[i].Rate;
         dateArray[i] = rateObjArray[i]._Date;
       }
      //  console.log(rateArray);
      //  console.log(dateArray);
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
                display: true,
                text: 'Custom Chart Title',
                fontSize: 18,
                fontFamily: "'Helvetica Neue'"
              },
              legend: {
                  display: false
              },
              animation: {
                duration: 300
              }
              // line: {
              //   tension: 0.2
              // }
           }
       });
   }
  }
});
