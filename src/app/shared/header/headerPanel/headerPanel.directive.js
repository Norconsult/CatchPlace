angular.module('headerPanel')
    .directive('headerPanel', ['processAppFactory',
        function(processAppFactory) {
            return {
                templateUrl: 'shared/header/headerPanel/headerPanel.html',
                restrict: 'A',
                link: function(scope){
                    scope.setProcessPage = function(){
                        processAppFactory.setProcessPage();
                    };
                }
            };
        }]);