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
});
