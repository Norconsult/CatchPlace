angular.module('authorizationPage')
    .directive('authorizationPage', ['processAppFactory',
        function(processAppFactory) {
            return {
                templateUrl: 'shared/authorizationPage/authorizationPage.html',
                restrict: 'A',
                link: function(scope){

                    scope.login = function(){
                        console.log("login has been clicked");
                    };

                    scope.cancel = function() {
                        processAppFactory.setProcessPage();
                    };
                }
            };
        }]);