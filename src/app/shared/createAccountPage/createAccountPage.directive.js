angular.module('createAccountPage')
    .directive('createAccountPage', [
        function() {
            return {
                templateUrl: 'shared/createAccountPage/createAccountPage.html',
                restrict: 'A',
                link: function(scope){

                    scope.registerUser = function () {
                        console.log("Register new user");
                    };

                    scope.cancel = function() {
                        scope.showMainPage();
                    };
                }
            };
        }]);