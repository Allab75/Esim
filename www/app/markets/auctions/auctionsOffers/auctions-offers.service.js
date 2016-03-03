(function () {
  'use strict';

  angular
    .module('auctions-offers.module')
    .factory('AuctionsOffersData', AuctionsOffersData);

  AuctionsOffersData.$inject = ['$http', '$q', '$log', '$ionicLoading', '$rootScope', 'Toast'];

  /* @ngInject */
  function AuctionsOffersData($http, $q, $log, $ionicLoading, $rootScope, Toast) {

    // return functions
    var exports = {
      fetchMyAuctions: fetchMyAuctions,
      createNewAuctionOffer: createNewAuctionOffer,
      removeAuctionOffer: removeAuctionOffer
    };

    return exports;

    ////////////////

    function fetchMyAuctions(page, status) {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      console.log('fetchMyAuctions');
      console.log('page '+page+' status '+status);
      $http.get($rootScope.server.address + '/ownedAuctions?page=' + page + '&status=' + status)
        //serwer zwraca dane w druga strone
        .success(function Success(results) {
          deferred.resolve(results);
        })
        .error(function Error(msg) {
          //console.log('smothing wrong' + msg);
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }

    function createNewAuctionOffer(item, price) {
      // var deferred = $q.defer();
      // $ionicLoading.show({
      //   template: 'Loading...'
      // });
      // $http.post($rootScope.server.address + '/productMarket/postOffer', {
      //     resource: resource,
      //     quality: quality,
      //     amount: amount,
      //     countryId: countryId,
      //     price: price
      //   })
      //   .success(function (data) {
      //     if (data) {
      //       deferred.resolve(data);
      //       Toast(data);
      //       return;
      //     }
      //     deferred.resolve("OK");
      //   })
      //   .error(function (msg) {
      //     $log.error(msg);
      //     deferred.reject(msg);
      //   })
      //   .finally($ionicLoading.hide);
      // return deferred.promise;
    }

    function removeAuctionOffer(auctionId) {
      var deferred = $q.defer();
      $ionicLoading.show({
        template: 'Loading...'
      });
      console.log('usuwanie oferty');
      $http.post($rootScope.server.address + '/cancelAuction?auctionId=' + auctionId)
      // $http.get($rootScope.server.address + '/productMarket/removeOffer?offerId='+id)
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
          $log.error(msg);
          deferred.reject(msg);
        })
        .finally($ionicLoading.hide);
      return deferred.promise;
    }
  }

})();
