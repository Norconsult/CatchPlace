angular.module('buttonsOverlay')
    .directive('buttonsOverlay', [
        function() {
            return {
                templateUrl: 'components/overlays/buttonsOverlay/buttonsOverlay.html',
                restrict: 'A',
                link: function(){

                }
            };
        }]);