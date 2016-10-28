angular.module('processApp')
    .controller('processAppController', ['$scope','$location','$timeout','$http',
        function($scope,$location,$timeout,$http){
            var map;
            var mapsrs = 'EPSG:25833';

            var projections = {
                'EPSG:25832': { defs: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0], units: 'm' },
                'EPSG:25833': { defs: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0], units: 'm' },
                'EPSG:25835': { defs: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-3500000.0, 3500000.0, 2045984.0, 9045984.0], units: 'm' },
                'EPSG:32632': { defs: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0], units: 'm' },
                'EPSG:32633': { defs: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0], units: 'm' },
                'EPSG:32635': { defs: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', extent: [-3500000.0, 3500000.0, 2045984.0, 9045984.0], units: 'm' },
                'EPSG:900913': { defs: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34], units: 'm' }
            };

            Backendless.initApp( "7DB77AF0-F276-073B-FFC2-0B2AA0A2E900", "E48F463B-8606-F4E3-FFA9-A8756155BC00", "v1" );

            $scope.showMainPage = function(){
                $scope.layout = "mainPage";
                $timeout(function() {
                    $scope.$apply(function () {
                        $scope.initMap();
                    },0);
                },5);
            };

            $scope.showAuthorizationPage = function(){
                $scope.layout = "authorizationPage";
            };

            $scope.showCreateAccoutPage = function () {
                $scope.layout = "createAccountPage";
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

            var getPlacenames = function (extent) {
                var placeNameServices = {
                    ssr: {
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
                        }
                    }
                };
                var service=placeNameServices.ssr;
                var bbox=service.bbox.minx + '=' + extent[0] + '&' +
                    service.bbox.miny + '=' + extent[1] + '&' +
                    service.bbox.maxx + '=' + extent[2] + '&' +
                    service.bbox.maxy + '=' + extent[3];
                var url=service.url + bbox;
                console.log($http.get(url));


            };

            var _mapMoveend = function(){
                var extent = map.getView().calculateExtent(map.getSize());
                console.log(extent);
                getPlacenames(extent);
                var test = _transformCoordinates(mapsrs, 'EPSG:4326', map.getView().getCenter());
                console.log(test);
                map.un('moveend', _mapMoveend);
            };

            var _transformCoordinates = function(fromEpsg, toEpsg, coordinates){
                if (fromEpsg && toEpsg && coordinates) {
                    if (proj4.defs(fromEpsg) && proj4.defs(toEpsg)) {
                        var transformObject = proj4(fromEpsg, toEpsg);
                        return transformObject.forward(coordinates);
                    }
                }
            };

            $scope.initMap = function(){


                _loadCustomProj();

                // Set width and height
                $('#map').height($(document).height() - $('[header-panel]').height());
                $('#map').width($(document).width());

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
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        visible: true
                    },
                    {
                        layers: 'topo2',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        visible: false
                    },
                    {
                        layers: 'topo2graatone',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        visible: true
                    },
                    {
                        layers: 'GPI13klasser_fill',
                        version: '1.1.1',
                        format: 'image/png',
                        url: 'http://wms.skogoglandskap.no/cgi-bin/ar5gpi?',
                        visible: false
                    }
                ];

                var numZoomLevels = 18;
                var newMapRes = [];
                newMapRes[0]= 21664;
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
                        center: [269517, 7034234],
                        zoom: 3,
                        resolutions: mapResolutions,
                        maxResolution: newMapRes[0],
                        numZoomLevels: numZoomLevels
                    }),
                    controls: [],
                    overlays: []
                });
                map.on('moveend', _mapMoveend);
            };

            $(document).ready(function(){
                if ($location.search().srs === undefined){
                    _setSearch({'srs': mapsrs});
                }
                mapsrs = $location.search().srs.toUpperCase();
                $scope.initMap();
            });
        }
    ]);