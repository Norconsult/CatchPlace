angular.module('processApp')
    .directive('processApp', [
        function() {
            return {
                templateUrl: 'appBody.html',
                controller: 'processAppController',
                link: function (scope) {
                    //remove if scope function is implemented
                    if (false){
                        console.log(scope);
                    }
                }
            };
        }
    ]);
