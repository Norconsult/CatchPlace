angular.module('headerMenuRight')
    .directive('headerMenuRight', ['processAppFactory','isyTranslateFactory','$translate',
        function(processAppFactory, isyTranslateFactory,$translate) {
            return {
                templateUrl: 'shared/header/headerMenuRight/headerMenuRight.html',
                restrict: 'A',
                link: function(scope){
                    scope.languages = isyTranslateFactory.getAllLanguages();
                    scope.logIn = function(){
                        scope.showAuthorizationPage();
                        // processAppFactory.setAuthorizationPage();
                    };
                    scope.changeLanguage = function(language) {
                        isyTranslateFactory.setCurrentLanguage(language.id);
                        $translate.use(language.id);
                    };

                    scope.loginName = function () {
                        return processAppFactory.getUserName();
                    };

                    scope.showLoginText = function () {
                        return processAppFactory.getUserName() === "";
                    };

                    scope.logOut = function () {
                        processAppFactory.setUserName("");
                        processAppFactory.setUserObjectId("");
                        Backendless.UserService.logout();
                    };

                }
            };
        }]);