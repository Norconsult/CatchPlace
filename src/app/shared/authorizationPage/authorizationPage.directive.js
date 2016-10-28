angular.module('authorizationPage')
    .directive('authorizationPage', ['processAppFactory',
        function(processAppFactory) {
            return {
                templateUrl: 'shared/authorizationPage/authorizationPage.html',
                restrict: 'A',
                link: function(scope){

                    var user;

                    scope.login = function(){
                        console.log("login has been clicked");
                        console.log("username: ", scope.username);
                        console.log("password: ", scope.password);
                        try
                        {
                            user = Backendless.UserService.login( scope.username, scope.password );
                            console.log("User: ", user);
                            processAppFactory.setUserObjectId(user.objectId);
                            processAppFactory.setUserName(user.name);
                            scope.showMainPage();
                        }
                        catch( err ) // see more on error handling
                        {
                            console.log( "error message - " + err.message );
                            console.log( "error code - " + err.statusCode );
                        }
                    };

                    scope.cancel = function() {
                        scope.showMainPage();
                    };

                    scope.createAccount = function () {
                        scope.showCreateAccoutPage();
                    };
                }
            };
        }]);