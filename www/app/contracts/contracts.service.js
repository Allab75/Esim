(function () {
  'use strict';

  angular
    .module('contracts.module')
    .factory('ContractsData', ContractsData);

  ContractsData.$inject = ['$http', '$q', '$log', '$ionicLoading', '$rootScope', 'Toast'];

  /* @ngInject */
  function ContractsData($http, $q, $log, $ionicLoading, $rootScope, Toast) {

    // ereturn functions
    var exports = {
      fetchPendingContracts: fetchPendingContracts,
      fetchOfferedContracts: fetchOfferedContracts,
      fetchContract: fetchContract,
      accept: accept,
      decline: decline,
      cancel: cancel
    };

    return exports;

    ////////////////

    function fetchPendingContracts() {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.get($rootScope.server.address + '/contracts/pending')
        .success(function Success(results) {
          deferred.resolve(results);
        })
        .error(function Error(msg) {
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }

    function fetchOfferedContracts() {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.get($rootScope.server.address + '/contracts/offered')
        .success(function Success(results) {
          deferred.resolve(results);
        })
        .error(function Error(msg) {
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }

    function fetchContract(id) {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.get($rootScope.server.address + '/contract/get/'+id)
        .success(function Success(results) {
          console.log('konkretny kontrakt');
          console.log(results);
          deferred.resolve(results);
        })
        .error(function Error(msg) {
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }

    function accept(contractId) {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.post($rootScope.server.address + '/contract/accept/'+ contractId)
        .success(function (data) {
          if (data) {
            deferred.resolve(data);
            Toast(data);
            return;
          }
          deferred.resolve("OK");
          Toast("Deal!");
        })
        .error(function (msg) {
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }

    function decline(contractId) {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.post($rootScope.server.address + '/contract/decline/'+contractId)
        .success(function (data) {
          if (data) {
            deferred.resolve(data);
            Toast(data);
            console.log('succes');
            return;
          }
          deferred.resolve("OK");
        })
        .error(function (msg) {
          console.log('error');
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }

    function cancel(contractId) {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      $http.post($rootScope.server.address + '/contract/cancel/'+contractId)
        .success(function (data) {
          if (data) {
            deferred.resolve(data);
            Toast(data);
            console.log('succes');
            return;
          }
          deferred.resolve("OK");
        })
        .error(function (msg) {
          console.log('error');
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }
  }

})();
