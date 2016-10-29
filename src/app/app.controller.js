angular.module('processApp')
    .controller('processAppController', ['$scope','$window','$location','$timeout','$http','processAppFactory',
        function($scope,$window,$location,$timeout,$http,processAppFactory){
            var map;
            var oldCenter;
            var mapsrs = 'EPSG:25833';
            var geojsonlayer = {};

            var projections = {
                'EPSG:4326': { defs: '+proj=longlat +datum=WGS84 +no_defs', extent: [-180, -90, 180, 90], units: 'degrees' },
                'EPSG:25832': { defs: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0], units: 'm' },
                'EPSG:25833': { defs: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0], units: 'm' },
                'EPSG:25835': { defs: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-3500000.0, 3500000.0, 2045984.0, 9045984.0], units: 'm' },
                'EPSG:32632': { defs: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0], units: 'm' },
                'EPSG:32633': { defs: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0], units: 'm' },
                'EPSG:32635': { defs: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-3500000.0, 3500000.0, 2045984.0, 9045984.0], units: 'm' },
                'EPSG:900913': { defs: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34], units: 'm' }
            };
            var bkglesskey = { appid: "7DB77AF0-F276-073B-FFC2-0B2AA0A2E900", jskey: "E48F463B-8606-F4E3-FFA9-A8756155BC00", version: "v1"};
            Backendless.initApp( bkglesskey.appid, bkglesskey.jskey, bkglesskey.version );

            $scope.showMainPage = function(){
                $scope.layout = "mainPage";
                $timeout(function() {
                    $scope.$apply(function () {
                        $scope.redrawMap();
                    },0);
                },5);
            };

            $scope.showAuthorizationPage = function(){
                $scope.layout = "authorizationPage";
            };

            $scope.showCreateAccoutPage = function () {
                $scope.layout = "createAccountPage";
            };

            $scope.showTopscorePage = function () {
                $scope.layout = "topscorePage";
            };

            $scope.layout = "mainPage";

            var _loadCustomProj = function(){
                for (var srs in projections){
                    var projection = projections[srs];
                    proj4.defs(srs, projection.defs);
                    ol.proj.addProjection(new ol.proj.Projection({
                        code: srs,
                        units: projection.units
                    }));
                }
            };

            var _setSearch = function (obj) {
                if (!angular.equals(obj, $location.search())) {
                    var newSearch = angular.extend($location.search(), obj);
                    $location.search(newSearch);
                }
            };

            var _createLayer = function(config){
                return new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        params: {
                            LAYERS: config.layers,
                            VERSION: config.version,
                            FORMAT: config.format
                        },
                        url: config.url,
                        crossOrigin: null,
                        transparent: true
                    }),
                    visible: config.visible
                });
            };

            var _createLayers = function(config){
                var sources = [];
                config.forEach(function(element){
                    sources.push(_createLayer(element));
                });
                return sources;
            };

            $scope.drawBackendlessPoints = function(points){
                if (points){
                    var features = [];
                    for (var i in points) {
                        features.push({
                            type: 'Feature',
                            properties: {
                                id: points[i].objectId,
                                pictureGuid: points[i].metadata.pictureGuid
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: $scope._transformCoordinates('EPSG:4326', mapsrs, [points[i].longitude, points[i].latitude])
                            }
                        });
                    }
                    var featureCollection = {
                        type: 'FeatureCollection',
                        features: features
                    };
                    $scope.drawGeoJson(featureCollection, 'backendless', true);
                }
            };

            var _getLayerStyle = function(layername) {
                switch (layername.toLowerCase()){
                    case 'backendless':
                        return new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 5,
                                fill: new ol.style.Stroke({color: [255, 0, 0, 0.5]}),
                                stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
                            })
                        });
                    case 'ssr':
                        return new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 5,
                                fill: new ol.style.Stroke({color: [0, 0, 255, 0.5]}),
                                stroke: new ol.style.Stroke({color: [255, 255, 255, 0.9], width: 2})
                            })
                        });
                    default:
                        break;
                }
            };

            $scope.drawGeoJson = function(geoJson, layername, overwrite){
                if (geojsonlayer[layername] === undefined){
                    var style = _getLayerStyle(layername);
                    geojsonlayer[layername] = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            format: new ol.format.GeoJSON()
                        }),
                        style: style
                    });
                    map.addLayer(geojsonlayer[layername]);
                }

                var geoJsonParser = new ol.format.GeoJSON();
                var features = geoJsonParser.readFeatures(geoJson);
                if (overwrite){
                    geojsonlayer[layername].getSource().clear();
                }
                geojsonlayer[layername].getSource().addFeatures(features);
            };

            var _readGeometryFromPlacenames = function (jsonObject, service) {
                var features = [];
                for (var i in jsonObject) {
                    features.push({
                        type: "Feature",
                        properties: {
                            name: jsonObject[i][service.name],
                            id: jsonObject[i][service.id],
                            type: jsonObject[i][service.type]
                        },

                        geometry: {
                            type: "Point",
                            coordinates: [jsonObject[i][service.lon], jsonObject[i][service.lat]]
                        }

                    });
                }
                var featureCollection = {
                    type: "FeatureCollection",
                    features: features
                };
                $scope.drawGeoJson(featureCollection, 'ssr', true);
            };

            var _readPlacenames = function (result, service) {
                var jsonObject=result.data;
                var uniqueResults={};
                if (jsonObject[service.root] === undefined){
                    return;
                }
                jsonObject[service.root].forEach(function(placename){
                    var concatinatedCoordinates=placename[service.lon].split('.')[0]+placename[service.lat].split('.')[0];
                    uniqueResults[placename[service.name]+concatinatedCoordinates]=placename;
                });
                _readGeometryFromPlacenames(uniqueResults, service);
            };

            var _getPlacenames = function (extent) {
                var placeNameServices = {
                    ssr: {
                        source: 'ssr',
                        id: 'ssrId',
                        root: 'stedsnavn',
                        type: 'navnetype',
                        url: 'https://ws.geonorge.no/SKWS3Index/ssr/sok?',
                        lat: 'nord',
                        lon: 'aust',
                        name: 'stedsnavn',
                        bbox: {
                            minx: 'ostLL',
                            miny: 'nordLL',
                            maxx: 'ostUR',
                            maxy: 'nordUR',
                            name: undefined
                        },
                        epsg: 'EPSG:25833'
                    }
                };
                var service = placeNameServices.ssr;
                var bbox = service.bbox.minx + '=' + extent[0] + '&' +
                    service.bbox.miny + '=' + extent[1] + '&' +
                    service.bbox.maxx + '=' + extent[2] + '&' +
                    service.bbox.maxy + '=' + extent[3];
                var url = service.url + bbox;
                $http.get(url).then(function (result) {
                        _readPlacenames(result, service);
                    }
                );
            };

            var _createSelectBox = function (center, radius) {
                var centerExtent=new ol.geom.Point(center).getExtent();
                return  new ol.extent.buffer(centerExtent,radius);
            };

            $scope._transformCoordinates = function(fromEpsg, toEpsg, coordinates){
                if (fromEpsg === undefined){
                    fromEpsg = mapsrs;
                }
                if (fromEpsg && toEpsg && coordinates) {
                    if (proj4.defs(fromEpsg) && proj4.defs(toEpsg)) {
                        var transformObject = proj4(fromEpsg, toEpsg);
                        return transformObject.forward(coordinates);
                    }
                }
            };

            $scope.setMapHeight = function(){
                // Set width and height
                $('#map').height($(document).height() - $('[header-panel]').height());
                $('#map').width($(document).width());
                if (map) {
                    map.updateSize();
                }
            };

            $scope.initMap = function(){

                _loadCustomProj();

                $scope.setMapHeight();

                var projection = new ol.proj.Projection({
                    code: mapsrs,
                    extent: projections[mapsrs].extent,
                    units: 'm'
                });
                ol.proj.addProjection(projection);

                var maplayers = [
                    {
                        layers: 'egk',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        visible: true
                    },
                    {
                        layers: 'topo2',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        visible: false
                    },
                    {
                        layers: 'topo2graatone',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'https://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        visible: true
                    },
                    {
                        layers: 'GPI13klasser_fill',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'https://wms.skogoglandskap.no/cgi-bin/ar5gpi?',
                        visible: false
                    }
                ];

                var maxRes = 21664.0;
                if (mapsrs == "EPSG:900913") {
                    maxRes = 156543.0339;
                } else if (mapsrs == "EPSG:4326") {
                    maxRes = 0.703125;
                } else if (mapsrs == "EPSG:54009") {
                    maxRes = 70312.5;
                }

                var numZoomLevels = 18;
                var newMapRes = [];
                newMapRes[0]= maxRes;
                //var mapScales = [];
                //mapScales[0] = mapConfig.newMaxScale;
                for (var t = 1; t < numZoomLevels; t++) {
                    newMapRes[t] = newMapRes[t - 1] / 2;
                    //mapScales[t] = mapScales[t - 1] / 2;
                }
                var mapResolutions = newMapRes;
                map = new ol.Map({
                    layers: _createLayers(maplayers),
                    loadTilesWhileAnimating: true,
                    target: 'map',
                    view: new ol.View({
                        projection: projection,
                        center: $scope._transformCoordinates('EPSG:25833', mapsrs, [236304, 6676890]),
                        zoom: 10,
                        resolutions: mapResolutions,
                        maxResolution: newMapRes[0],
                        numZoomLevels: numZoomLevels
                    }),
                    controls: [],
                    overlays: []
                });

                var select = new ol.interaction.Select({
                    condition: ol.events.condition.click
                });
                map.addInteraction(select);
                select.on('select', function(e) {
                    if (e.selected && Array.isArray(e.selected) && e.selected.length > 0){
                        var url = 'https://api.backendless.com/';
                        url += bkglesskey.appid;
                        url += '/';
                        url += bkglesskey.version;
                        url += '/files/my-folder/';
                        url += e.selected[0].getProperties().pictureGuid;
                        console.log(url);
                    }
                });
                processAppFactory.registerMousePositionControl(map, '');
                processAppFactory.getGeolocation(map, _selectClosestPlacename);
            };

            function _delayedClosestPlacename(layer, center){
                _getPlacenamesByBbox(center);
                var source = layer.getSource();
                var closestFeature = source.getClosestFeatureToCoordinate(center);
                console.log(closestFeature);
            }

            function _getPlacenamesByBbox(center) {
                var bbox=_createSelectBox(center, 1000);
                _getPlacenames(bbox);
            }

            function _checkForMovement(center, tolerance){
                if(!oldCenter){
                    oldCenter=center;
                    return true;
                }
                var oldCenterGeog=ol.proj.transform(oldCenter,mapsrs,'EPSG:4326');
                var centerGeog=ol.proj.transform(center,mapsrs,'EPSG:4326');
                var distance = ol.sphere.WGS84.haversineDistance(oldCenterGeog,centerGeog);

                if(distance>tolerance){
                    oldCenter=center;
                    return true;
                }
                return false;
            }

            function _selectClosestPlacename(center){
                if(_checkForMovement(center, 100) || !oldCenter){
                    _getPlacenamesByBbox(center);
                }
                var layer = geojsonlayer['ssr'];
                if (layer) {
                    _delayedClosestPlacename(layer, center);
                } else {
                    $timeout(function(){
                        _selectClosestPlacename(center);
                    }, 50);
                }
            }

            $scope.redrawMap = function(){
                processAppFactory.resetGeolocation(map);
                map = undefined;
                geojsonlayer = {};
                $scope.initMap();
                //$timeout($scope.setMapHeight,10);
            };

            $(document).ready(function(){
                if ($location.search().srs === undefined){
                    _setSearch({'srs': mapsrs});
                }
                mapsrs = $location.search().srs.toUpperCase();
                $scope.initMap();
            });
            $($window).resize(function(){
                $timeout($scope.setMapHeight,10);
            });
        }
    ]);