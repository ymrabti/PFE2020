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
        HomeButton
    ) {

        document.getElementById('suiv1').onclick = function () {
                    
            var prop;            
            if (document.getElementById('prop1').checked == true) { prop = "Non" }
            if (document.getElementById('prop2').checked == true) { prop = "Oui" }                     
            var typeTerrain;
            if (document.getElementById('typeTerrain1').checked == true) { typeTerrain = "TI" }
            if (document.getElementById('typeTerrain2').checked == true) { typeTerrain = "TNI" }
            document.getElementById('divPiece').style.display = 'block';            
            if (prop == "Oui" && typeTerrain == "TI" || prop == "Non" && typeTerrain == "TI") {
                    document.getElementById('tableTI').style.display = "block";
                    document.getElementById('tableTNI').style.display = "none";                   
                }
            if (prop == "Oui" && typeTerrain == "TNI" || prop == "Non" && typeTerrain == "TNI") {
                    document.getElementById('tableTI').style.display = "none";
                    document.getElementById('tableTNI').style.display = "block";                   
                }                                   
        }


    

       

       
        

    });