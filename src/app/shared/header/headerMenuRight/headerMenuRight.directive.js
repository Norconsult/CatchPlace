angular.module('headerMenuRight')
    .directive('headerMenuRight', ['processAppFactory','isyTranslateFactory','$translate','$timeout',
        function(processAppFactory, isyTranslateFactory,$translate, $timeout) {
            return {
                templateUrl: 'shared/header/headerMenuRight/headerMenuRight.html',
                restrict: 'A',
                link: function(scope){
                    scope.languages = isyTranslateFactory.getAllLanguages();
                    scope.logIn = function(){
                        scope.showAuthorizationPage();
                        // processAppFactory.setAuthorizationPage();
                    };
                    scope.changeLanguage = function(language) {
                        isyTranslateFactory.setCurrentLanguage(language.id);
                        $translate.use(language.id);
                    };

                    scope.loginName = function () {
                        return processAppFactory.getUserName();
                    };

                    scope.showLoginText = function () {
                        return processAppFactory.getUserName() === "";
                    };

                    scope.logOut = function () {
                        processAppFactory.setUserName("");
                        processAppFactory.setUserObjectId("");
                        Backendless.UserService.logout();
                    };



                    function _guid() {
                        function s4() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                    }


                    scope.addPoint =    function (coor) {
                        var callback = new Backendless.Async(
                            function( result )
                            {
                                alert( "geo point saved " + result.geopoint.objectId );
                            },
                            function(result)
                            {
                                console.log( "error - " + result.message );
                            });


                        var point = {
                            latitude: coor[1],
                            longitude: coor[0],
                            categories: ["catched_places"],
                            metadata: {ownerId:processAppFactory.getUserObjectId(), pointGuid: _guid(), pictureGuid: processAppFactory.getNewFileName()}
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
                            //metadata: {ownerId: processAppFactory.getUserObjectId()},
                            categories: ["catched_places"],
                            includeMetadata:true
                        };
                        //console.log("ownerId: ", processAppFactory.getUserObjectId());
                        Backendless.Geo.find( geoQuery, callback );
                    };

                    document.getElementById('files').addEventListener('change', handleFileSelect, false);

                    document.getElementById('files').onchange = uploadFileFunc;

                    $("#clickInput").click(function () {
                        $("#files").click();
                    });

                    function handleFileSelect(evt)
                    {
                        files = evt.target.files; // FileList object
                    }

                    // scope.getMyLocation = function () {
                    //
                    //     var coor = scope._transformCoordinates(undefined, "EPSG:4326", processAppFactory.getMyLocation());
                    //     console.log("Coor: ", coor);
                    // };

                    function uploadFileFunc () {

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
                            var coor = scope._transformCoordinates(undefined, "EPSG:4326", processAppFactory.getMyLocation());
                            scope.addPoint(coor);
                        },4000);

                    }

                }
            };
        }]);