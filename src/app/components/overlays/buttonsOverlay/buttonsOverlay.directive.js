angular.module('buttonsOverlay')
    .directive('buttonsOverlay', ['processAppFactory','$timeout',
        function(processAppFactory, $timeout) {
            return {
                templateUrl: 'components/overlays/buttonsOverlay/buttonsOverlay.html',
                restrict: 'A',
                link: function(scope){

                    function _guid() {
                        function s4() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                    }
                    

                    scope.addPoint =    function () {
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
                            metadata: {ownerId:processAppFactory.getUserObjectId(), pointGuid: _guid(), pictureGuid: "123"}
                        };

                        Backendless.Geo.addPoint( point, callback );
                    };

                    scope.getPoints = function () {
                        var callback = new Backendless.Async(
                            function(result)
                            {
                                console.log("result.data: ", result.data.length);
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

                        // var callback =
                            // function()
                            // {
                            //     Backendless.Files.renameFile( "/my-folder/"+processAppFactory.getOldFileName(), processAppFactory.getNewFileName() );
                            // };
                        var callback = {};

                        callback.success = function(result)
                        {
                            alert( "File successfully uploaded. Path to download: " + result.fileURL );
                        };

                        callback.fault = function(result)
                        {
                            alert( "error - " + result.message );
                        };

                        var fileSplitName = files[0].name.split(".");

                        processAppFactory.generatePictureGuid();

                        // console.log("Test: ", processAppFactory.getPictureGuid() + "." + fileSplitName[fileSplitName.length -1]);

                        processAppFactory.setOldFileName(files[0].name);
                        processAppFactory.setNewFileName(processAppFactory.getPictureGuid() + "." + fileSplitName[fileSplitName.length -1]);

                        Backendless.Files.upload(files, "my-folder", callback);

                        $timeout(function() {
                            Backendless.Files.renameFile( "/my-folder/"+processAppFactory.getOldFileName(), processAppFactory.getNewFileName() );
                        },2000);

                    };

                }
            };
        }]);