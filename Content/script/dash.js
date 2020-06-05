require([
    "esri/map",
    "esri/dijit/BasemapGallery",
    "esri/dijit/BasemapLayer",
    "esri/dijit/Basemap", 
    "esri/dijit/BasemapToggle",
    "esri/layers/FeatureLayer",
    "esri/dijit/LayerList",
    "esri/dijit/Legend",
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
        BasemapGallery,
        BasemapLayer,
        Basemap,
        BasemapToggle,
        FeatureLayer,
        LayerList,
        Legend,
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
       
          
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items"; //"https://portal.geomatic-online.ma/arcgis/sharing/content/items";
        arcgisUtils.createMap("853c2cda0c1b4473a8fa93582305ca2d", "map").then(function (response) {           
            map = response.map;
            var grphicLayer = new GraphicsLayer();           
            map.addLayer(grphicLayer);     
            featureLayer_Nru = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/6");
            q_Nru = new Query();
            q_Nru.outFields = ["*"];
            q_Nru.returnGeometry = true;
            q_Nru.where = '1=1';

            featureLayer_Nru.queryFeatures(q_Nru, result_nru);
            function result_nru(featureSet_nru) {
                var featuresnru = featureSet_nru.features;
                var where = "";
                for (var i = 0; i < featuresnru.length; i++) {
                    if (i != featuresnru.length - 1)
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
           
            featureLayer_Nru1 = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/7");
            q_Nru1 = new Query();
            q_Nru1.outFields = ["*"];
            q_Nru1.where = '1=1';
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


                        var textSymbol = new TextSymbol(arrayCount[j]).setOffset(0, -4).setColor(
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
                        grphicLayer.add(graphicPoint);
                    }                                                       
                }
                map.on("load", function () {
                    alert(grphicLayer.graphics.length);
                    grphicLayer.on("click", function (event) {
                        alert(55);
                    });
                });
                
            }          

            //add the scalebar
            /* var scalebar = new Scalebar({
              map: map,
              scalebarUnit: "english"
            });*/
    
            //add the legend. Note that we use the utility method getLegendLayers to get
            //the layers to display in the legend from the createMap response.
            var legendLayers = arcgisUtils.getLegendLayers(response);
            var legendDijit = new Legend({
              map: map,
              layerInfos: legendLayers
            }, "legend");
            legendDijit.startup();

            var layerList = new LayerList({
                map: response.map,
                layers: arcgisUtils.getLayerList(response)
            }, "layerList");

            layerList.startup();       

            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,                
                map: map
            }, "basemapGallery");
            basemapGallery.startup();
            basemapGallery.on("load", function () {            
                var tot = basemapGallery.basemaps.length;                   
                for (var i = 0; i < tot + 1; i++) {                   
                    if (basemapGallery.basemaps[i].title === "Canevas gris foncé" || basemapGallery.basemaps[i].title === "Streets (Night)" || basemapGallery.basemaps[i].title == "Nuances de gris" || basemapGallery.basemaps[i].title === "Navigation" || basemapGallery.basemaps[i].title === "Océans et bathymétrie") {                       
                        basemapGallery.remove(basemapGallery.basemaps[i].id);
                    }
                }
              
            });


           
        });

       


        document.getElementById('rechercheBtn').onclick = function () {

            map.graphics.clear();
            var dateDebut = document.getElementById('dateDebut').value;
            var dateFin = document.getElementById('dateFin').value;
            var pref = document.getElementById('Preff').value;  
            var commun = document.getElementById('Comm').value;  
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

            if (dateDebut == "" && dateFin == "" && pref == "" && commun == "") { 
                stringWhere = "1=1";                  
            } else {
                if (dateDebut != "") {
                    if (stringWhere == "")
                        stringWhere += "Date_Demande >= date '"+dateDebut+"'";
                    else
                        stringWhere += " AND Date_Demande >= date '"+dateDebut+"'";
                }

                if (dateFin != "") {                    
                    if (stringWhere == "")
                        stringWhere += "Date_Demande <= date '"+dateFin+"'";
                    else
                        stringWhere += " AND Date_Demande <= date '"+dateFin+"'";
                }

                if (pref != "") {
                    if (stringWhere == "")
                        stringWhere += "provinceId = " + pref;
                    else
                        stringWhere += " AND  provinceId = " + pref;
                }

                if (commun != "") {
                    if (stringWhere == "")
                        stringWhere += "communeId = " + commun;
                    else
                        stringWhere += " AND  communeId = " + commun;
                }
                
            }

            featureLayer_Nru = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/6");
            q_Nru = new Query();
            q_Nru.outFields = ["*"];
            q_Nru.returnGeometry = true;
            q_Nru.where = stringWhere;             
            featureLayer_Nru.queryFeatures(q_Nru, result_nru);
            function result_nru(featureSet_nru) {
                var featuresnru = featureSet_nru.features; 
                var arrCount = [];
                var where = "";
                for (var i = 0; i < featuresnru.length; i++) {
                    if (i != featuresnru.length - 1) {
                        arrCount.push({ id: featuresnru[i].attributes['parcellaireId'],times : featuresnru[i].attributes['parcellaireId'] });
                        where += featuresnru[i].attributes['parcellaireId'] + ",";
                    }
                    else {
                        arrCount.push({ id: featuresnru[i].attributes['parcellaireId'], times: featuresnru[i].attributes['parcellaireId'] });
                        where += featuresnru[i].attributes['parcellaireId'];
                    }                       
                }
                           
                var arr2 = arrCount.reduce((a, b) => {
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
                        for (var k = 0; k < arr2.length; k++) {
                            if (featuresparcel[j].attributes['objectid'] == arr2[k].id) {

                                var textSymbol = new TextSymbol(arr2[k].times).setOffset(0, -4).setColor(
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
                                break;
                            }
                        }                       
                        //alert(arr2[j].times);
                      
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

        document.getElementById("Preff").onchange = function () {

            document.getElementById("Comm").options.length = 1;

            featureLayer_Commune = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/3");
            q_Comm = new Query();
            q_Comm.outFields = ["*"];
            q_Comm.returnGeometry = true;
            q_Comm.where = "id_prov = " + document.getElementById("Preff").value;
            featureLayer_Commune.queryFeatures(q_Comm, result_Comm);
            function result_Comm(featureSet_Comm) {
                var featurescomm = featureSet_Comm.features;              
                if (featurescomm != null) {
                    for (var i = 0; i < featurescomm.length; i++) {
                        var oOption = document.createElement('OPTION');
                        oOption.value = featurescomm[i].attributes["id_commune"];
                        oOption.text = featurescomm[i].attributes["nom_commun"];
                        try {
                            document.getElementById("Comm").add(oOption, i + 1);
                        }
                        catch (e) {
                            document.getElementById("Comm").add(oOption, null);
                        }
                    }
                }
            }
        }


        $('.count').each(function () {
                //$('#sss').text(50);
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                        duration: 500,
                        easing: 'swing',
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        }
                    });
        });

        $(document).ready(function () {
            $('#testBtn').click(function () {  
               if ($('#testBtn').val() == "0") {
                    $('#testBtn').val("1") ;

                } else {
                    $('#testBtn').val("0");
                }

                 if ($('#testBtn1').val() == "1") {
                     $('.divHide1').slideToggle("fast");
                     $('#testBtn1').val("0");
                }
                if ($('#testBtn2').val() == "1") {
                    $('.divHide2').slideToggle("fast");
                    $('#testBtn2').val("0");
                } 

                $('.divHide').slideToggle("fast");
            });
        });

        $(document).ready(function () {
            $('#testBtn1').click(function () {
                if ($('#testBtn1').val() == "0") {
                    $('#testBtn1').val("1");

                } else {
                    $('#testBtn1').val("0");
                }

                if ($('#testBtn').val() == "1") {
                    $('.divHide').slideToggle("fast");
                    $('#testBtn').val("0");
                } 
                if ($('#testBtn2').val() == "1") {
                    $('.divHide2').slideToggle("fast");
                    $('#testBtn2').val("0");
                } 

                $('.divHide1').slideToggle("fast");
            });
        });

        $(document).ready(function () {
            $('#testBtn2').click(function () {
                if ($('#testBtn2').val() == "0") {
                    $('#testBtn2').val("1");

                } else {
                    $('#testBtn2').val("0");
                }

                if ($('#testBtn').val() == "1") {
                    $('.divHide').slideToggle("fast");
                    $('#testBtn').val("0");
                }
                if ($('#testBtn1').val() == "1") {
                    $('.divHide1').slideToggle("fast");
                    $('#testBtn1').val("0");
                } 
                $('.divHide2').slideToggle("fast");
            });
           
        });

        $(document).ready(function () {
            $('#btnBasemap').click(function () {
                $('.divHide').slideToggle("fast");
                $('#testBtn').val("0");
            });
        });

        $(document).ready(function () {
            $('#btnLayerList').click(function () {
                $('.divHide1').slideToggle("fast");
                $('#testBtn1').val("0");
            });
        });

        $(document).ready(function () {
            $('#btnLegend').click(function () {
                $('.divHide2').slideToggle("fast");
                $('#testBtn2').val("0");
            });
        });

       
    });