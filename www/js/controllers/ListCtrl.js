angular.module('starter.controllers')
.controller('ListCtrl', function($scope, CurrencyFactory) {
  $scope.list = CurrencyFactory.all();
});
