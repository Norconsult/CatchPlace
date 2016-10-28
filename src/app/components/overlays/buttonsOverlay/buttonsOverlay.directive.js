angular.module('buttonsOverlay')
    .directive('buttonsOverlay', [
        function() {
            return {
                templateUrl: 'components/overlays/buttonsOverlay/buttonsOverlay.html',
                restrict: 'A',
                link: function(scope){

                    var callback = new Backendless.Async(
                        function( result )
                        {
                            alert( "geo point saved " + result.geopoint.objectId );
                        },
                        function(result)
                        {
                            alert( "error - " + result.message );
                        });

                    var point = {
                        latitude: 66,
                        longitude: 14,
                        categories: ["catched_places"],
                        metadata: {"ownerId":"XXXX-XXXX-XXXX-XXXX"}
                    };


                    scope.addPoint = function () {
                        Backendless.Geo.addPoint( point, callback );
                    };

                }
            };
        }]);