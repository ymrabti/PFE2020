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
    "esri/dijit/Print",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "esri/tasks/PrintTemplate",
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
        StatisticDefinition,
        Print,
        PrintTask,
        PrintParameters,
        PrintTemplate
    ) {
       
        
        var mapp1;
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items";
        arcgisUtils.createMap("4c164463636546be9142d9fdac1e41aa", "map").then(function (response) {
            mapp1 = response.map;
            console.log(mapp1);
        });

           
        //var where = "parcellaire.objectid in (";
        //for (var i = 0; i < arr.length; i++) {
        //    if (i != (arr.length - 1)) {
        //        where += arr[i] + ",";
        //    } else {
        //        where += arr[i] + ")";
        //    }

        //} 
        //alert(where);
        //featureLayer_Parcell = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/MapServer/0");
        //q_Parcel = new Query();
        //q_Parcel.outFields = ["*"];
        //q_Parcel.returnGeometry = true;
        //q_Parcel.where = where;
        //featureLayer_Parcell.queryFeatures(q_Parcel, function (featureSet_Parcel) {
        //    alert('vvvvv');
        //    var featuresParcel = featureSet_Parcel.features;
        //    var geometryParcel = [];
        //    for (var i = 0; i < featuresParcel.length; i++) {
        //        geometryParcel.push(featuresParcel[i].geometry);
        //    }           
        //    var geometryParcelUnion = geometryEngine.union(geometryParcel);  
        //    featureLayer_Zonage = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/1");
        //    q_Zonage = new Query();
        //    q_Zonage.outFields = ["*"];
        //    q_Zonage.returnGeometry = true;
        //    q_Zonage.geometry = geometryParcelUnion;
        //    featureLayer_Zonage.queryFeatures(q_Zonage, function (featureSet_Zonage) {
        //        var featuresZonage = featureSet_Zonage.features;                
        //        $("#ListZonage").empty().append('<option value="">--- Zonage ---</option>');;
        //        for (var i = 0; i < featuresZonage.length; i++) {
        //            $("#ListZonage").append("<option value='" + featuresZonage[i].attributes["objectid"] + "'>" + featuresZonage[i].attributes["zone_"] + "</option>");
        //        }
        //        $('#ListZonage').trigger("liszt:updated");

        //    });   

        //    featureLayer_Secteur = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/0");
        //    q_Secteur = new Query();
        //    q_Secteur.outFields = ["*"];
        //    q_Secteur.returnGeometry = true;
        //    q_Secteur.geometry = geometryParcelUnion;
        //    featureLayer_Secteur.queryFeatures(q_Secteur, function (featureSet_Secteur) {
        //        var featuresSecteur = featureSet_Secteur.features;             
        //        $("#ListSecteurs").empty().append('<option>--- Secteurs---</option>');;
        //        for (var i = 0; i < featuresSecteur.length; i++) {
        //            $("#ListSecteurs").append("<option value='" + featuresSecteur[i].attributes["objectid"] + "'>" + featuresSecteur[i].attributes["secteur"] + "</option>");
        //        }
        //        $('#ListSecteurs').trigger("liszt:updated");
        //    });   

        //});     

        
    });