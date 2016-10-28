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
                            metadata: {ownerId: processAppFactory.getUserObjectId()},
                            categories: ["catched_places"]
                        };
                        //console.log("ownerId: ", processAppFactory.getUserObjectId());
                        Backendless.Geo.find( geoQuery, callback );
                    };

                    document.getElementById('files').addEventListener('change', handleFileSelect, false);

                    function handleFileSelect(evt)
                    {
                        files = evt.target.files; // FileList object
                    }

                    scope.uploadFileFunc = function () {

                        var callback = {};

                        callback.success = function (result) {
                            alert("File successfully uploaded. Path to download: " + result.fileURL);
                        };

                        callback.fault = function (result) {
                            alert("error - " + result.message);
                        };

                        Backendless.Files.upload(files, "my-folder", callback);
                    };

                }
            };
        }]);