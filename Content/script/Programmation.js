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




        console.log(document.getElementById('chk'));

        $("[name='test1']").change(function () {
            document.getElementById('CodeCommission').value = this.value;
            // alert(document.getElementById('CodeCommission').value);
        });




        //Ajouter Architecte
        //document.getElementById('btnPetitionnaire').onclick = function () {

        //    var btnValue = document.getElementById('btnPetitionnaire').value;
        //    if (btnValue == 1) {
        //        document.getElementById('divPetitionnaire').style.display = "none";
        //        document.getElementById('btnPetitionnaire').value = 0;
        //        document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/plusicon.png');
        //    } else if (btnValue == 0) {
        //        document.getElementById('divPetitionnaire').style.display = "block";
        //        document.getElementById('btnPetitionnaire').value = 1;
        //        document.getElementById('imgbtnPetitionnaire296-n2 n20').setAttribute('src', '../Content/documentation/img/minusicon.png');
        //    }

        //}
        //Ajouter Topographe
        //document.getElementById('btnAddTopo').onclick = function () {

        //    var btnValue = document.getElementById('btnAddTopo').value;
        //    if (btnValue == 1) {
        //        document.getElementById('divAddTOPOGRAPHE').style.display = "none";
        //        document.getElementById('btnAddTopo').value = 0;
        //        document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/plusicon.png');
        //    } else if (btnValue == 0) {
        //        document.getElementById('divAddTOPOGRAPHE').style.display = "block";
        //        document.getElementById('btnAddTopo').value = 1;
        //        document.getElementById('imgbtnPetitionnaire296-n2 n20').setAttribute('src', '../Content/documentation/img/minusicon.png');
        //    }

        //}
    }
);