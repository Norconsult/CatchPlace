angular.module('processApp')
    .directive('processApp', [
        function() {
            return {
                templateUrl: 'appBody.html',
                controller: 'processAppController',
                link: function ($scope) {
                    $scope.getPoints();

                    $scope.imageShow = function(){
                        return true;
                    };
                }
            };
        }
    ]);
