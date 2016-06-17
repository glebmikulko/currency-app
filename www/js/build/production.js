angular.module('starter.controllers')
.controller('CurrencyCtrl', function($scope, $stateParams, CurrencyFactory, HttpService, DateFactory, ChartFactory) {
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
      ChartFactory.buildChart(rateArray);
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
     ChartFactory.buildChart(rateArray);
   });

   $scope.convertDateNBRB = DateFactory.convertDateNBRB();
});

angular.module('starter.controllers')
.controller('ListCtrl', function($scope, CurrencyFactory) {
  $scope.list = CurrencyFactory.all();
})

angular.module('starter.controllers', []);

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
  }
})

angular.module('starter.services')
.factory('CurrencyFactory', function() {
  var list = [
    {id: "USD", country: "USA", description: "United States Dollar", idNBRB: 145},
    {id: "EUR", country: "Europe", description: "Euro", idNBRB: 19},
    {id: "RUB", country: "Russia", description: "Russian Ruble", idNBRB: 190},
    {id: "UAH", country: "Ukraine", description: "Ukrainian Hryvnia", idNBRB: 224},
    {id: "CNY", country: "Japan", description: "Japanese Yen", idNBRB: 254}
  ];

  return {
    all: function() {
      return list;
    },
    get: function(currencyId) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === currencyId) {
          return list[i];
        }
      }
      return null;
    }
  };
})

angular.module('starter.services')
.factory('DateFactory', function(){
  var dateToFormat = function(date, format){
    if (format === "mm/dd/yyyy"){
      var dd = date.getDate();
      var mm = date.getMonth()+1; //January is 0!

      var yyyy = date.getFullYear();
      if(dd<10){
          dd='0'+dd
      }
      if(mm<10){
          mm='0'+mm
      }
      var date = mm+'/'+dd+'/'+yyyy;
      return date;
    }
  };
  return {
    convertDateNBRB: function(){
      return function(stringDate){
        var parts = stringDate.split("/");
        return parts[1] + '.' + parts[0] + '.' + parts[2];
      }
    },
    dateToFormat: dateToFormat,
    getTodayDate: function(format){
      var today = new Date();
      return dateToFormat(today, format);
    },
    getHistoryDate: function(timeOffset, format){
      if (format === 'mm/dd/yyyy'){
        var startDate = new Date();
        switch (timeOffset) {
          case "week":
            startDate.setDate(startDate.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case "year":
            startDate.setYear(startDate.getFullYear() - 1);
            break;
        }
        return dateToFormat(startDate, format);
      }
    }
  }
})

angular.module('starter.services')
.factory('HttpService', function($http, DateFactory) {
  var url = 'http://apilayer.net/api/';
  var accessKey = 'a3d9ac994b72ff6f89ed48dc83b2a813';
  var urlNBRB = 'http://www.nbrb.by/Services/XmlExRates.aspx';
  var urlHistoryNBRB = 'http://www.nbrb.by/Services/XmlExRatesDyn.aspx';
  var historyArray = new Array();

  return {
    getLiveRate: function(currencyId){
      return $http.get(url + "live?access_key=" + accessKey + "&currencies=BYR," + currencyId)
        .then(function(response) {
          var liveRateObj = response.data.quotes;
          var liveRateInUSD = liveRateObj["USD" + currencyId];
          var factor = liveRateObj.USDBYR;
          var liveRate = Math.floor(factor / liveRateInUSD);
          return liveRate;
      });
    },
    getRateArray: function(currencyIdNRBR, timeOffset, callback){
      var finishDate = DateFactory.getTodayDate("mm/dd/yyyy");
      var startDate = DateFactory.getHistoryDate(timeOffset, "mm/dd/yyyy");
      $.ajax({
         type: "GET",
         url: urlHistoryNBRB + "?curId=" + currencyIdNRBR + "&fromDate=" + startDate + "&toDate=" + finishDate,
         dataType: "xml",
         success: callback
     });
    },
    getLiveRateByNBRB: function(currencyId){
      return $.ajax({
       type: "GET",
       url: urlNBRB,
       dataType: "xml"
     });
   }
  };
})

angular.module('starter.services', [])

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
 $stateProvider
   .state('list', {
     url: "/list",
     templateUrl: "templates/list.html",
     controller: 'ListCtrl'
   })

   .state('currency', {
     url: "/list/:currencyId",
     templateUrl: "templates/currency.html",
     controller: 'CurrencyCtrl'
   });
 // If none of the above states are matched, use this as the fallback:
 $urlRouterProvider.otherwise('list');
});
