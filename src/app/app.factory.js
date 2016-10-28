angular.module('processApp')
    .factory('processAppFactory', [
        function(){


            var userObjectId = "";
            var userName = "";

            var position;
            var geolocation;
            var geolocationguid = 999999;
            var geolocationLayer;
            var initialGeolocationChange = false;

            function _guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }

            var pictureGuid = '';
            var oldFileName = '';
            var newFileName = '';

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

                registerMousePositionControl: function (map, prefix) {
                    var element = document.getElementById('mouseposition');
                    if (element) {
                        var view = map.getView();
                        var units = view.getProjection().getUnits();
                        var epsg = view.getProjection().getCode();
                        //var coordinateFunction = ol.coordinate.createStringXY(0);
                        if (prefix === undefined) {
                            prefix = '';
                        }
                        var coordinate2string = function (coord) {
                            var mousehtml = '' + prefix;
                            var geographic = false;
                            if (mousehtml.length > 0) {
                                switch (units) {
                                    case 'degrees':
                                        mousehtml = '';
                                        geographic = true;
                                        break;
                                    case 'm':
                                        switch (epsg) {
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
                            if (geographic) {
                                mousehtml += Math.round(coord[1] * 10000) / 10000 + 'N, ' + Math.round(coord[0] * 10000) / 10000 + 'E';
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
                },

                getGeolocation: function(map, callback){
                    var view = map.getView();
                    var mapProjection = view.getProjection();
                    geolocation = new ol.Geolocation({
                        projection:  mapProjection,
                        tracking: true,
                        trackingOptions: {
                            //enableHighAccuracy: true,
                            //timeout: 5000,
                            maximumAge: 0
                        }
                    });

                    geolocationLayer = new ol.layer.Vector({
                        source: new ol.source.Vector(),
                        projection: map.getView().getProjection()
                    });
                    geolocationLayer.guid = geolocationguid;
                    map.addLayer(geolocationLayer);

                    initialGeolocationChange = true;

                    var _refreshGeolocationLayer = function() {
                        if (geolocationLayer !== null){
                            map.removeLayer(geolocationLayer);
                        }
                        geolocationLayer = new ol.layer.Vector({
                            source: new ol.source.Vector(),
                            projection: map.getView().getProjection()
                        });
                        geolocationLayer.guid = geolocationguid;
                        map.addLayer(geolocationLayer);
                        return geolocationLayer;
                    };

                    var _drawGeolocation = function(center, radius){
                        position = center;
                        var geolocationLayer = _refreshGeolocationLayer();
                        if (geolocationLayer !== null){
                            var geolocationSource = geolocationLayer.getSource();
                            geolocationSource.clear();
                            var geolocationStyle = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 6,
                                    stroke: new ol.style.Stroke({
                                        color: 'rgba(255,255,255,0.8)',
                                        width: 2
                                    }),
                                    fill: new ol.style.Fill({
                                        color: 'rgba(32,170,172,0.8)'
                                    })
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(0,102,204,0.15)'
                                }),
                                zIndex: geolocationguid
                            });
                            var geolocationFeature = new ol.Feature({
                                geometry: new ol.geom.GeometryCollection([
                                    new ol.geom.Point(center),
                                    new ol.geom.Circle(center, parseInt(radius, 10))
                                ]),
                                name: 'geolocation_center'
                            });
                            geolocationFeature.setStyle(geolocationStyle);
                            geolocationSource.addFeature(geolocationFeature);
                            if (initialGeolocationChange){
                                initialGeolocationChange = false;
                                var geolocextent = geolocationFeature.getGeometry().getExtent();
                                geolocextent[0] -= 5*radius;
                                geolocextent[1] -= 5*radius;
                                geolocextent[2] += 5*radius;
                                geolocextent[3] += 5*radius;
                                //map.getView().fit(geolocextent, map.getSize());
                            }
                        }
                    };
                    var _geolocationChange = function(){
                        var center = geolocation.getPosition();
                        if (center === undefined){
                            return;
                        }
                        callback(center);
                        //var view = map.getView();
                        //view.setCenter(center);
                        _drawGeolocation(center, geolocation.getAccuracy());
                        // var geolocationObject = {
                        //     center: center,
                        //     accuracy: Math.round(geolocation.getAccuracy()*10)/10,
                        //     altitude: geolocation.getAltitude(),
                        //     altitudeAccuracy: geolocation.getAltitudeAccuracy(),
                        //     heading: geolocation.getHeading(),
                        //     speed: geolocation.getSpeed()
                        // };
                    };

                    geolocation.on('change:position', _geolocationChange);
                    geolocation.on('change:accuracy', _geolocationChange);
                },

                generatePictureGuid: function () {
                    pictureGuid = _guid();
                },

                getPictureGuid: function () {
                    return pictureGuid;
                },

                setOldFileName: function (value) {
                      oldFileName = value;
                },

                getOldFileName: function () {
                    return oldFileName;
                },

                setNewFileName: function (value) {
                    newFileName = value;
                },

                getNewFileName: function () {
                    return newFileName;
                }



            };
        }]
    );