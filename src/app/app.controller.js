angular.module('processApp')
    .controller('processAppController', ['$scope',
        function($scope){
            Backendless.initApp( "7DB77AF0-F276-073B-FFC2-0B2AA0A2E900", "E48F463B-8606-F4E3-FFA9-A8756155BC00", "v1" );

            $scope.showMainPage = function(){
                $scope.layout = "mainPage";
            };

            $scope.showAuthorizationPage = function(){
                $scope.layout = "authorizationPage";
            };

            $scope.layout = "mainPage";

        }
    ]);