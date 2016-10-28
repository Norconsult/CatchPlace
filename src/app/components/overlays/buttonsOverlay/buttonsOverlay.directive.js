angular.module('buttonsOverlay')
    .directive('buttonsOverlay', ['processAppFactory',
        function(processAppFactory) {
            return {
                templateUrl: 'components/overlays/buttonsOverlay/buttonsOverlay.html',
                restrict: 'A',
                link: function(scope){




                    scope.addPoint = function () {
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
                            metadata: {ownerId:processAppFactory.getUserObjectId()}
                        };

                        Backendless.Geo.addPoint( point, callback );
                    };

                    scope.getPoints = function () {
                        var callback = new Backendless.Async(
                            function(result)
                            {
                                scope.drawBackendlessPoints(result.data);
                            },
                            function(result)
                            {
                                alert( "error - " + result.message );
                            });

                        var geoQuery =
                        {
                            categories: ["catched_places"]
                        };
                        //console.log("ownerId: ", processAppFactory.getUserObjectId());
                        Backendless.Geo.find( geoQuery, callback );
                    };

                }
            };
        }]);