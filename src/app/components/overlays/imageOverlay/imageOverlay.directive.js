angular.module('imageOverlay')
    .directive('imageOverlay', [
        function() {
            return {
                templateUrl: 'components/overlays/imageOverlay/imageOverlay.html',
                restrict: 'A',
                link: function(){

                }
            };
        }]);