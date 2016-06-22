angular.module('starter.services')
.factory('HttpService', function($http, DateFactory) {
  var url = 'http://apilayer.net/api/';
  var accessKey = 'a3d9ac994b72ff6f89ed48dc83b2a813';
  var urlNBRB = 'http://www.nbrb.by/Services/XmlExRates.aspx';
  var urlHistoryNBRB = 'http://www.nbrb.by/Services/XmlExRatesDyn.aspx';
  var historyArray = [];

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
});
