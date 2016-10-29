angular.module('createAccountPage')
    .directive('createAccountPage', ['processAppFactory','$timeout',
        function(processAppFactory,$timeout) {
            return {
                templateUrl: 'shared/createAccountPage/createAccountPage.html',
                restrict: 'A',
                link: function(scope){

                    function userRegistered(  )
                    {
                        console.log( "user has been registered"  );
                        var user = Backendless.UserService.login( scope.email, scope.password );
                        console.log("User: ", user);
                        processAppFactory.setUserObjectId(user.objectId);
                        processAppFactory.setUserName(user.name);
                        $timeout(function(){
                            scope.showMainPage();
                        },50);

                    }

                    function gotError( err ) // see more on error handling
                    {
                        console.log( "error message - " + err.message );
                        console.log( "error code - " + err.statusCode );
                    }

                    scope.registerUser = function () {
                        console.log("Register new user");
                        var user = new Backendless.User();
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