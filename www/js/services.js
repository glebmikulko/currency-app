angular.module('starter.services', [])

.factory('Currencies', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var list = [
    {id: "USD", country: "USA", description: "United States Dollar" },
    {id: "EUR", country: "Europe", description: "Euro"},
    {id: "RUB", country: "Russia", description: "Russian Ruble"},
    {id: "UAH", country: "Ukraine", description: "Ukrainian Hryvnia"},
    {id: "CNY", country: "Japan", description: "Japanese Yen"}
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

.factory('HttpService', function($http) {
  var url = 'http://apilayer.net/api/';
  var accessKey = 'a3d9ac994b72ff6f89ed48dc83b2a813';
  var urlNBRB = 'http://www.nbrb.by/Services/XmlExRates.aspx';
  var historyArray = new Array();
  var getTodayDate = function(format){
    if (format === "mm/dd/yyyy"){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!

      var yyyy = today.getFullYear();
      if(dd<10){
          dd='0'+dd
      }
      if(mm<10){
          mm='0'+mm
      }
      var today = mm+'/'+dd+'/'+yyyy;
      return today;
    }
  }

  // var getHistoryDate = function(offset){
  //
  // }

  return {
    getLiveRate: function(currencyId){
      // console.log($http.get(url + "live?access_key=" + accessKey + "&currencies=BYR," + currencyId));
      return $http.get(url + "live?access_key=" + accessKey + "&currencies=BYR," + currencyId)
        .then(function(response) {
          var liveRateObj = response.data.quotes;
          var liveRateInUSD = liveRateObj["USD" + currencyId];
          var factor = liveRateObj.USDBYR;
          var liveRate = Math.floor(factor / liveRateInUSD);
          return liveRate;
      });
    },
    getRateArray: function(currencyIdNRBR, callback, timeFrame){
      var finishDate = getTodayDate("mm/dd/yyyy");
      console.log(finishDate);
      $.ajax({
         type: "GET",
         url: urlNBRB,
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
});
