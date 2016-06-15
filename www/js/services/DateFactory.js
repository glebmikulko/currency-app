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
