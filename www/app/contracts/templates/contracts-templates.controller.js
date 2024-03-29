(function () {
  'use strict';

  angular
    .module('contracts-templates.module')
    .controller('ContractsTplController', ContractsTplController);

  ContractsTplController.$inject = ['$scope', '$state', '$rootScope', '$ionicScrollDelegate', '$ionicModal', '$ionicActionSheet','Toast', 'ContractsTemplatesData', 'templates'];

  /* @ngInject */
  function ContractsTplController($scope, $state, $rootScope, $ionicScrollDelegate, $ionicModal, $ionicActionSheet, Toast, ContractsTemplatesData, templates) {

    // vars
    var vm = this;
     vm.property = 'ContractsTemplatesController';
    vm.templates = templates;
    vm.friendsList = '';
    vm.acceptorLogin = '';
    vm.selectedLogin = '';
    vm.ownerOfContract = false;
    vm.login = '';

    // definitions
    vm.initModal = initModal;
    vm.getTemplate = getTemplate;
    vm.checkFriend = checkFriend;
    vm.selectLogin = selectLogin;
    vm.proposeContract = proposeContract;
    vm.deleteContract = deleteContract;
    vm.refreshTemplates = refreshTemplates;

    // inits
    $ionicScrollDelegate.scrollTop();
    vm.initModal();

    ////////////////
    //

    function getTemplate() {
      console.log('getContract');
      console.log(vm.templateId);
      ContractsTemplatesData.fetchTemplate(vm.templateId)
        .then(function FetchContractSuccess(data) {
          console.log('succes');
          console.log(data);
          vm.currentTemplate = data;
        }, function FetchContractError(error) {
          console.log('errrooorrrsss');
          Toast(error);
        });
    }
    function checkFriend() {
      vm.selectedLogin = '';
      console.log('check Friends');
      ContractsTemplatesData.fetchFriends(vm.acceptorLogin)
        .then(function FetchFriendsSucces(data) {
          if(data.length===0){
            Toast("No friends")
          }
          console.log('fetched');
          console.log(data);
          vm.friendsList = data;
        }, function Error(msg) {
          Toast(msg);
        });

    }

    function selectLogin(login){
      vm.acceptorLogin = login;
      vm.selectedLogin = login;
    }

    function proposeContract() {
      console.log('propose Contract');
      ContractsTemplatesData.propose(vm.currentTemplate.id, vm.selectedLogin)
        .then(function Success() {
          vm.refreshTemplates();
          $state.go('main.contracts');
          vm.closeTemplateModal();
        }, function Error(msg) {
          Toast(msg);
        });
    }

    function deleteContract() {
      console.log('delete Contract');
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Delete',
        titleText: 'Decline offer?',
        cancelText: 'Cancel',
        destructiveButtonClicked: function(index) {
          ContractsTemplatesData.deleteTemplate(vm.currentTemplate.id)
            .then(function Success() {
              vm.refreshTemplates();
              $state.go('main.contracts');
              vm.closeTemplateModal();
            }, function Error(msg) {
              Toast(msg);
            });
            return true;
          }
        });
    }

    function refreshTemplates() {
      ContractsTemplatesData.fetchTemplates()
        .then(function FetchJobOffersSuccess(data) {
          vm.templates = data;
        }, function FetchJobOffersError(error) {
          Toast(error);
        })
        .then(function BroadcastFinish() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }


    function initModal() {
      $ionicModal.fromTemplateUrl(
        'app/contracts/templates/contracts-templates-modal.tpl.html', {
          scope: $scope
        }
      ).then(function (modal) {
        vm.modal = modal;
      });
      vm.openTemplateModal = function (id) {
        console.log('open modal');
        vm.templateId = id;
        vm.getTemplate();
        vm.modal.show();
      };
      vm.closeTemplateModal = function () {
        vm.modal.hide();
      };

      $scope.$on('$destroy', function () {
        vm.modal.remove();
      });
    }
  }

})();
