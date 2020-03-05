require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "dojo/on",
    "esri/arcgis/utils",
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/toolbars/draw",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Polygon",
    "esri/geometry/Point",
    "esri/dijit/HomeButton",
    "esri/geometry/geometryEngine",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/tasks/StatisticDefinition",
    "dojo/domReady!"
],
    function (
        Map,
        FeatureLayer,
        on,
        arcgisUtils,
        Query,
        QueryTask,
        FeatureLayer,
        GraphicsLayer,
        GeometryService,
        SpatialReference,
        Graphic,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        Color,
        Draw,
        SimpleFillSymbol,
        Polygon,
        Point,
        HomeButton,
        geometryEngine,
        TextSymbol,
        Font,
        StatisticDefinition
    ) {

        /*
              var map = new Map("map", {
              basemap: "streets",
              autoResize: "autoResize",
              center: [-7, 35.6122],
              zoom: 5
              });*/

        var map;
        var array = [];
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items";
        arcgisUtils.createMap("853c2cda0c1b4473a8fa93582305ca2d", "map").then(function (response) {         
            map = response.map;

            //featureLayer_Nru = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/6");
            //q_Nru = new Query();
            //q_Nru.outFields = ["*"];
            //q_Nru.returnGeometry = true;
            //q_Nru.where = '1=1';

            //featureLayer_Nru.queryFeatures(q_Nru, result_nru);
            //function result_nru(featureSet_nru) {
            //    var featuresnru = featureSet_nru.features;
            //    var where = "";
            //    for (var i = 0; i < featuresnru.length; i++) {
            //        if (i != featuresnru.length - 1)
            //            where += featuresnru[i].attributes['parcellaireId'] + ",";
            //        else
            //            where += featuresnru[i].attributes['parcellaireId'];
            //    }

            //    featureLayer_parcel = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
            //    q_parcel = new Query();
            //    q_parcel.outFields = ["*"];
            //    q_parcel.returnGeometry = true;
            //    q_parcel.where = 'objectid in (' + where + ')';
            //    featureLayer_parcel.queryFeatures(q_parcel, result_parcel);
            //    function result_parcel(featureSet_parcel) {
            //        var featuresparcel = featureSet_parcel.features;
            //        var arrayParcel = [];
            //        var arrayPoint = [];
            //        for (var j = 0; j < featuresparcel.length; j++) {
            //            arrayParcel.push(featuresparcel[j].geometry);
            //            arrayPoint.push(featuresparcel[j].geometry.getCentroid());
            //        }
            //        var parcelUnion = geometryEngine.union(arrayParcel);
            //        var pointUnion = geometryEngine.union(arrayPoint);

            //        var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            //                new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            //        );

            //        var graphic2 = new Graphic(parcelUnion, sym);
            //        map.graphics.add(graphic2);
            //        var extent = parcelUnion.getExtent().expand(2);
            //        map.setExtent(extent);

            //    }

            //}

            //featureLayer_Nru1 = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/7");
            //q_Nru1 = new Query();
            //q_Nru1.outFields = ["*"];
            //q_Nru1.where = '1=1';
            //featureLayer_Nru1.queryFeatures(q_Nru1, result_nru1);
            //function result_nru1(featureSet_nru1) {
            //    var featuresnru1 = featureSet_nru1.features;
            //    var where = "";
            //    var arrayCount = [];
            //    for (var i = 0; i < featuresnru1.length; i++) {
            //        arrayCount.push(featuresnru1[i].attributes['ParcelCount']);

            //        if (i != featuresnru1.length - 1)
            //            where += featuresnru1[i].attributes['parcellaireId'] + ",";
            //        else
            //            where += featuresnru1[i].attributes['parcellaireId'];
            //    }
            //    featureLayer_parcel = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
            //    q_parcel = new Query();
            //    q_parcel.outFields = ["*"];
            //    q_parcel.returnGeometry = true;
            //    q_parcel.where = 'objectid in (' + where + ')';
            //    featureLayer_parcel.queryFeatures(q_parcel, result_parcel);
            //    function result_parcel(featureSet_parcel) {
            //        var featuresparcel = featureSet_parcel.features;
            //        var arrayParcel = [];
            //        var arrayPoint = [];
            //        for (var j = 0; j < featuresparcel.length; j++) {
            //            arrayParcel.push(featuresparcel[j].geometry);
            //            arrayPoint.push(featuresparcel[j].geometry.getCentroid());


            //            var textSymbol = new TextSymbol(arrayCount[j]).setOffset(0, -4).setColor(
            //                new Color([255, 255, 255, 2])).setAlign(Font.ALIGN_START).setAngle(0).setFont(
            //                    new Font("12pt").setWeight(Font.WEIGHT_BOLD));

            //            var symPoint = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 40,
            //                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            //                    new Color([5, 113, 176, 0.25]), 10),
            //                new Color([5, 113, 176, 0.5]));

            //            var graphicPointText = new Graphic(featuresparcel[j].geometry.getCentroid(), textSymbol);
            //            var graphicPoint = new Graphic(featuresparcel[j].geometry.getCentroid(), symPoint);
            //            map.graphics.add(graphicPoint);
            //            map.graphics.add(graphicPointText);

            //        }

            //    }
            //}
            //add the scalebar
            /* var scalebar = new Scalebar({
              map: map,
              scalebarUnit: "english"
            });
    
            //add the legend. Note that we use the utility method getLegendLayers to get
            //the layers to display in the legend from the createMap response.
            var legendLayers = arcgisUtils.getLegendLayers(response);
            var legendDijit = new Legend({
              map: map,
              layerInfos: legendLayers
            }, "legend");
            legendDijit.startup();*/
        });

        document.getElementById('rechercheBtn').onclick = function () {

            map.graphics.clear();
            var dateDebut = document.getElementById('dateDebut').value;
            var dateFin = document.getElementById('dateFin').value;
            var pref = document.getElementById('Preff').value;  
            var stringWhere = "";

          /*  if (dateDebut == "") {      
                stringWhere = "1=1";              
            } else {
                if (stringWhere == "")
                    stringWhere += "datedemande <= " + dateDebut;
                else
                    stringWhere += " AND datedemande <= " + dateDebut;
            }*/

          /*  if (dateFin == "" && stringWhere == "") {                
                stringWhere += "datedemande <= " + dateFin;
            } else {
                stringWhere += " AND datedemande >= " + dateFin;
            }*/

            if (pref == "") { 
                stringWhere = "1=1";  
                
            } else {
                if (stringWhere == "")
                    stringWhere += "provinceId = " + pref;
                else
                    stringWhere += " AND  provinceId = " + pref;
            }

           // alert(stringWhere);

            featureLayer_Nru = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/6");
            q_Nru = new Query();
            q_Nru.outFields = ["*"];
            q_Nru.returnGeometry = true;
            q_Nru.where = stringWhere; 
            
            featureLayer_Nru.queryFeatures(q_Nru, result_nru);
            function result_nru(featureSet_nru) {
                var featuresnru = featureSet_nru.features;          
                var where = "";
                for (var i = 0; i < featuresnru.length; i++) {
                    if (i != featuresnru.length-1)
                        where += featuresnru[i].attributes['parcellaireId'] + ",";
                    else
                        where += featuresnru[i].attributes['parcellaireId'];
                }                              

                featureLayer_parcel = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                q_parcel = new Query();
                q_parcel.outFields = ["*"];
                q_parcel.returnGeometry = true;
                q_parcel.where = 'objectid in (' + where + ')';                
                featureLayer_parcel.queryFeatures(q_parcel, result_parcel);
                function result_parcel(featureSet_parcel) {
                    var featuresparcel = featureSet_parcel.features;                                        
                    var arrayParcel = [];
                    var arrayPoint = [];
                    for (var j = 0; j < featuresparcel.length; j++) {                      
                        arrayParcel.push(featuresparcel[j].geometry);
                        arrayPoint.push(featuresparcel[j].geometry.getCentroid());
                    }                
                    var parcelUnion = geometryEngine.union(arrayParcel);
                    var pointUnion = geometryEngine.union(arrayPoint);
                    
                    var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
                    );                  

                    var graphic2 = new Graphic(parcelUnion, sym);                                      
                    map.graphics.add(graphic2);                                  
                    var extent = parcelUnion.getExtent().expand(2);
                    map.setExtent(extent);
                    
                }
              
            }     


            featureLayer_Nru1 = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/6");
            q_Nru1 = new Query();
            q_Nru1.outFields = ["*"];
            q_Nru1.returnGeometry = true;
            q_Nru1.where = "1 = 1";

            featureLayer_Nru1.queryFeatures(q_Nru1, result_nru1);
            function result_nru1(featureSet_nru1) {
                var arrNum = [];
                var arrCount = [];
                var featuresnru1 = featureSet_nru1.features;  
                var where = "";
                for (var i = 0; i < featuresnru1.length; i++) {
                    if (i != featuresnru1.length - 1) {
                        where += featuresnru1[i].attributes['parcellaireId'] + ",";
                        arrNum.push({ id: featuresnru1[i].attributes['parcellaireId'], test: featuresnru1[i].attributes['parcellaireId'] });
                    } else {
                        where += featuresnru1[i].attributes['parcellaireId'];
                        arrNum.push({ id: featuresnru1[i].attributes['parcellaireId'], test: featuresnru1[i].attributes['parcellaireId'] });
                    }
                }                    
                var arr2 = arrNum.reduce((a, b) => {
                    var i = a.findIndex(x => x.id === b.id);
                    return i === -1 ? a.push({ id: b.id, times: 1 }) : a[i].times++ , a;
                }, []);

                featureLayer_parcel = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                q_parcel = new Query();
                q_parcel.outFields = ["*"];
                q_parcel.returnGeometry = true;
                q_parcel.where = 'objectid in (' + where + ')';
                featureLayer_parcel.queryFeatures(q_parcel, result_parcel);
                function result_parcel(featureSet_parcel) {
                    var featuresparcel = featureSet_parcel.features;
                    var arrayParcel = [];
                    var arrayPoint = [];
                    for (var j = 0; j < featuresparcel.length; j++) {
                        arrayParcel.push(featuresparcel[j].geometry);
                        arrayPoint.push(featuresparcel[j].geometry.getCentroid());

                        alert(arr2.length);
                        var textSymbol = new TextSymbol(arr2[j].times).setOffset(0, -4).setColor(
                            new Color([255, 255, 255, 2])).setAlign(Font.ALIGN_START).setAngle(0).setFont(
                                new Font("12pt").setWeight(Font.WEIGHT_BOLD));

                        var symPoint = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 40,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([5, 113, 176, 0.25]), 10),
                            new Color([5, 113, 176, 0.5]));

                        var graphicPointText = new Graphic(featuresparcel[j].geometry.getCentroid(), textSymbol);
                        var graphicPoint = new Graphic(featuresparcel[j].geometry.getCentroid(), symPoint);
                        map.graphics.add(graphicPoint);
                        map.graphics.add(graphicPointText);

                    }

                }
            }

            /*
            featureLayer_Nru1 = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/7");            
            q_Nru1 = new Query();
            q_Nru1.outFields = ["*"];            
            q_Nru1.where = "1=1"; 
            featureLayer_Nru1.queryFeatures(q_Nru1, result_nru1);
            function result_nru1(featureSet_nru1) {
                var featuresnru1 = featureSet_nru1.features;
                var where = "";
                var arrayCount = [];
                for (var i = 0; i < featuresnru1.length; i++) {
                    arrayCount.push(featuresnru1[i].attributes['ParcelCount']);

                    if (i != featuresnru1.length - 1)
                        where += featuresnru1[i].attributes['parcellaireId'] + ",";
                    else
                        where += featuresnru1[i].attributes['parcellaireId'];
                }
                featureLayer_parcel = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                q_parcel = new Query();
                q_parcel.outFields = ["*"];
                q_parcel.returnGeometry = true;
                q_parcel.where = 'objectid in (' + where + ')';
                featureLayer_parcel.queryFeatures(q_parcel, result_parcel);
                function result_parcel(featureSet_parcel) {
                    var featuresparcel = featureSet_parcel.features;
                    var arrayParcel = [];
                    var arrayPoint = [];
                    for (var j = 0; j < featuresparcel.length; j++) {
                        arrayParcel.push(featuresparcel[j].geometry);
                        arrayPoint.push(featuresparcel[j].geometry.getCentroid());


                        var textSymbol = new TextSymbol(arrayCount[j]).setOffset(0,-4).setColor(
                            new Color([255, 255, 255,2])).setAlign(Font.ALIGN_START).setAngle(0).setFont(
                            new Font("12pt").setWeight(Font.WEIGHT_BOLD));

                        var symPoint = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 40,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([5, 113, 176, 0.25]), 10),
                            new Color([5, 113, 176, 0.5]));

                        var graphicPointText = new Graphic(featuresparcel[j].geometry.getCentroid(), textSymbol);
                        var graphicPoint = new Graphic(featuresparcel[j].geometry.getCentroid(), symPoint);
                        map.graphics.add(graphicPoint); 
                        map.graphics.add(graphicPointText);
                         
                    }                     

                }
            }*/

          /*  featureLayer_Nru2 = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/6");
            q_Nru2 = new Query();
            q_Nru2.outFields = ["*"];
            q_Nru2.returnGeometry = true;            
            q_Nru2.where = "1=1"
            q_Nru2.outStatistics = [{
                onStatisticField: "parcellaireId",
                outStatisticFieldName: "test",
                statisticType: "count"
            }];
            q_Nru2.groupByFieldsForStatistics = ["parcellaireId"];

            featureLayer_Nru2.queryFeatures(q_Nru2, result_nru2);
            function result_nru2(featureSet_nru2) {
                var ff = featureSet_nru2.features;
                alert(ff.length);
            }
            */
        }

    });