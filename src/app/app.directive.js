angular.module('processApp')
    .directive('processApp', [
        function() {
            return {
                templateUrl: 'appBody.html',
                controller: 'processAppController',
                link: function ($scope) {
                    //remove if scope function is implemented
                    $scope.getPoints = function () {
                        var callback = new Backendless.Async(
                            function(result)
                            {
                                console.log("result.data: ", result.data.length);
                                $scope.drawBackendlessPoints(result.data);
                            },
                            function(result)
                            {
                                alert( "error - " + result.message );
                            });

                        var geoQuery =
                        {
                            // metadata: {ownerId: processAppFactory.getUserObjectId()},
                            categories: ["catched_places"],
                            includeMetadata:true
                        };
                        //console.log("ownerId: ", processAppFactory.getUserObjectId());
                        Backendless.Geo.find( geoQuery, callback );
                    };
                    $scope.getPoints();
                }
            };
        }
    ]);
