angular.module('processApp')
    .controller('processAppController', ['$scope', '$location','processAppService','processAppFactory',
        function($scope, $location, processAppService, processAppFactory){

            $scope.showProcessPage = function(){
                return processAppFactory.showProcessPage();
            };

            $scope.showAuthorizationPage = function(){
                return processAppFactory.showAuthorizationPage();
            };

        }
    ]);