angular.module('starter.controllers', [])
.controller('ListCtrl', function($scope, Currencies) {
  $scope.list = Currencies.all();
})

.controller('CurrencyCtrl', function($scope, $stateParams, Currencies, HttpService) {
  $scope.currency = Currencies.get($stateParams.currencyId);

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
         console.log(curArray[i]);
              $scope.liveRateByNBRB = curArray[i].Rate;
       }
     }
   });

   HttpService.getRateArray($scope.currency.id, function(result){
     console.log(result);
     $scope.rateArray = result;
   });
});
