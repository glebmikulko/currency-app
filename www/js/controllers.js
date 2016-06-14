angular.module('starter.controllers', [])
.controller('ListCtrl', function($scope, Currencies) {
  $scope.list = Currencies.all();
})

.controller('CurrencyCtrl', function($scope, $stateParams, Currencies, HttpService) {
  $scope.currency = Currencies.get($stateParams.currencyId);
  $scope.timeOffset = "year";

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
         $scope.liveRateByNBRB = curArray[i].Rate;
       }
     }
   });

   HttpService.getRateArray($scope.currency.idNBRB, $scope.timeOffset, function(xmlDoc){
     var x2js = new X2JS();
     var data = x2js.xml2json(xmlDoc);
     var rateArray = data.Currency.Record;
     $scope.rateArray = rateArray;
   });

   $scope.convertDateNBRB = HttpService.convertDateNBRB();
});
