angular.module('processPage')
    .directive('processPage', [
        function() {
            return {
                templateUrl: 'shared/processPage/processPage.html',
                restrict: 'A',
                link: function(scope){
                    //remove if scope function is implemented
                    if (false){
                        console.log(scope);
                    }
                }
            };
        }]);