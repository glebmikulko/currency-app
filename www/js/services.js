angular.module('starter.services', [])

.factory('Currencies', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
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

.factory('HttpService', function($http, dateFactory) {
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
      var finishDate = dateFactory.getTodayDate("mm/dd/yyyy");
      var startDate = dateFactory.getHistoryDate(timeOffset, "mm/dd/yyyy");
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

.factory('dateFactory', function(){
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
