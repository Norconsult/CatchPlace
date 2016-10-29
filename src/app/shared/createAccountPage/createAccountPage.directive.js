angular.module('createAccountPage')
    .directive('createAccountPage', [
        function() {
            return {
                templateUrl: 'shared/createAccountPage/createAccountPage.html',
                restrict: 'A',
                link: function(scope){

                    function userRegistered(  )
                    {
                        console.log( "user has been registered"  );
                    }

                    function gotError( err ) // see more on error handling
                    {
                        console.log( "error message - " + err.message );
                        console.log( "error code - " + err.statusCode );
                    }

                    scope.registerUser = function () {
                        console.log("Register new user");
                        var user = new Backendless.User();
                        // user.name = scope.username;
                        user.password = scope.password;
                        user.email=scope.email;

                        Backendless.UserService.register( user, new Backendless.Async( userRegistered, gotError ) );
                    };

                    scope.cancel = function() {
                        scope.showMainPage();
                    };
                }
            };
        }]);