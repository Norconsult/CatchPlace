angular.module('topscorePage')
    .directive('topscorePage', [
        function() {
            return {
                templateUrl: 'shared/topscorePage/topscorePage.html',
                restrict: 'A',
                link: function(scope){
                    //remove if scope function is implemented
                    if (false){
                        console.log(scope);
                    }
                }
            };
        }]);