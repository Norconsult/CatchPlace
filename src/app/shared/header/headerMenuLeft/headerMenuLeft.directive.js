angular.module('headerMenuLeft')
    .directive('headerMenuLeft', [
        function() {
            return {
                templateUrl: 'shared/header/headerMenuLeft/headerMenuLeft.html',
                restrict: 'A',
                link: function(scope){
                    //remove if scope function is implemented
                    if (false){
                        console.log(scope);
                    }
                }
            };
        }]);