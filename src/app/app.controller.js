angular.module('processApp')
    .controller('processAppController', ['$scope',
        function($scope){
            var map;

            Backendless.initApp( "7DB77AF0-F276-073B-FFC2-0B2AA0A2E900", "E48F463B-8606-F4E3-FFA9-A8756155BC00", "v1" );

            $scope.showMainPage = function(){
                $scope.layout = "mainPage";
            };

            $scope.showAuthorizationPage = function(){
                $scope.layout = "authorizationPage";
            };

            $scope.layout = "mainPage";


            $scope.initMap = function(){
                // Set with and height
                $("#map").height($(document).height() - $("[header-panel]").height());
                $("#map").width($(document).width());

                var projections = {
                    'EPSG:25832': { extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0] },
                    'EPSG:32632': { extent: [-2000000.0, 3500000.0, 3545984.0, 9045984.0] },
                    'EPSG:25833': { extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0] },
                    'EPSG:32633': { extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0] },
                    'EPSG:25835': { extent: [-3500000.0, 3500000.0, 2045984.0, 9045984.0] },
                    'EPSG:32635': { extent: [-3500000.0, 3500000.0, 2045984.0, 9045984.0] },
                    'EPSG:4326': { extent: [-180, -90, 180, 90] },
                    'EPSG:900913': { extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34] }
                };

                var epsgcode = 'EPSG:900913';

                var projection = new ol.proj.Projection({
                    code: epsgcode,
                    extent: projections[epsgcode].extent,
                    units: 'm'
                });
                ol.proj.addProjection(projection);

                var rastersource = new ol.source.TileWMS({
                    params: {
                        LAYERS: 'egk',//'topo2',
                        VERSION: '1.1.1',
                        FORMAT: 'image/png'
                    },
                    url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open?',
                    crossOrigin: null,
                    transparent: true
                });

                var raster = new ol.layer.Tile({
                    source: rastersource
                });

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
                    layers: [raster],
                    loadTilesWhileAnimating: true,
                    target: 'map',
                    view: new ol.View({
                        projection: projection,
                        center: [569517, 7034234],
                        zoom: 2,
                        resolutions: mapResolutions,
                        maxResolution: newMapRes[0],
                        numZoomLevels: numZoomLevels
                    }),
                    controls: [],
                    overlays: []
                });
            };

            $scope.initDemo = function(){
                var layers = [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    new ol.layer.Tile({
                        extent: [-13884991, 2870341, -7455066, 6338219],
                        source: new ol.source.TileWMS({
                            url: 'https://ahocevar.com/geoserver/wms',
                            params: {'LAYERS': 'topp:states', 'TILED': true},
                            serverType: 'geoserver'
                        })
                    })
                ];
                map = new ol.Map({
                    layers: layers,
                    target: 'map',
                    view: new ol.View({
                        center: [-10997148, 4569099],
                        zoom: 4
                    })
                });
            };
            $(document).ready($scope.initMap);
            //$scope.initDemo();
        }
    ]);