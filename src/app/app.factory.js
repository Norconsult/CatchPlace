angular.module('processApp')
    .factory('processAppFactory', [
        function(){


            var userObjectId = "";
            var userName = "";

            return {
                setUserObjectId: function (value) {
                    userObjectId = value;
                },
                getUserObjectId: function () {
                    return userObjectId;
                },

                setUserName: function (value) {
                    userName = value;
                },

                getUserName: function () {
                    return userName;
                },

                registerMousePositionControl: function(map, prefix){
                var element = document.getElementById('mouseposition');
                if (element) {
                    var view = map.getView();
                    var units = view.getProjection().getUnits();
                    var epsg = view.getProjection().getCode();
                    //var coordinateFunction = ol.coordinate.createStringXY(0);
                    if (prefix === undefined){
                        prefix = '';
                    }
                    var coordinate2string = function(coord){
                        var mousehtml = '' + prefix;
                        var geographic = false;
                        if (mousehtml.length > 0) {
                            switch (units) {
                                case 'degrees':
                                    mousehtml = '';
                                    geographic = true;
                                    break;
                                case 'm':
                                    switch(epsg){
                                        case 'EPSG:25831':
                                        case 'EPSG:32631':
                                            mousehtml += '31 ';
                                            break;
                                        case 'EPSG:25832':
                                        case 'EPSG:32632':
                                            mousehtml += '32 ';
                                            break;
                                        case 'EPSG:25833':
                                        case 'EPSG:32633':
                                            mousehtml += '33 ';
                                            break;
                                        case 'EPSG:25834':
                                        case 'EPSG:32634':
                                            mousehtml += '34 ';
                                            break;
                                        case 'EPSG:25835':
                                        case 'EPSG:32635':
                                            mousehtml += '35 ';
                                            break;
                                        case 'EPSG:25836':
                                        case 'EPSG:32636':
                                            mousehtml += '36 ';
                                            break;
                                        case 'EPSG:25837':
                                        case 'EPSG:32637':
                                            mousehtml += '37 ';
                                            break;
                                        case 'EPSG:25838':
                                        case 'EPSG:32638':
                                            mousehtml += '38 ';
                                            break;
                                        case 'EPSG:900913':
                                            mousehtml += 'merc ';
                                            break;
                                    }
                                    break;
                            }
                        }
                        if (geographic){
                            mousehtml += Math.round(coord[1]*10000)/10000 + 'N, ' + Math.round(coord[0]*10000)/10000 + 'E';
                        } else {
                            mousehtml += parseInt(coord[1], 10) + 'N, ' + parseInt(coord[0], 10) + 'E';
                        }
                        return mousehtml;
                    };
                    var mousePositionControl = new ol.control.MousePosition({
                        coordinateFormat: coordinate2string,
                        projection: epsg,
                        //undefinedHTML: '&nbsp;',
                        // comment the following two lines to have the mouse position
                        // be placed within the map.
                        className: 'mousePosition',
                        target: element
                    });
                    map.addControl(mousePositionControl);
                }
            }

            };
        }]
    );