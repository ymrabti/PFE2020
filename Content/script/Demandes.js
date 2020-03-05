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
    "esri/dijit/Scalebar",
    "esri/dijit/Legend",
    "esri/dijit/editing/AttachmentEditor",
    "dojo/promise/all",
    "dojo/domReady!"
    ],
    function(
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
        Scalebar,
        Legend,
        AttachmentEditor,
        all
    ) {

        /*
         var map = new Map("map", {
            basemap: "streets",
            autoResize: "autoResize",
            center: [-7, 35.6122],
            zoom: 5
        });*/
      
      

        var table = document.getElementById('tableDemandePayee');
        
        var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
            rows[i].onclick = function () {
                for (var j = 0; j < rows.length; j++) {
                    table.rows[j].style.backgroundColor = table.rows[j].getAttribute('backclr');
                    table.rows[j].style.color = table.rows[j].getAttribute('clr');
                    table.rows[j].clicked = false;
                }
                var id = this.id;
                document.getElementById(id).style.backgroundColor = "#337ab7";
                document.getElementById(id).style.borderColor = "#2e6da4";
                document.getElementById(id).style.color = "#fff";
                document.getElementById(id).clicked = true;
                document.getElementById('hiddenDemande').value = id;               
            }
        };

     

                                                         
    });

    