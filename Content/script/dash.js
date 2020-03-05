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
      //  arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/arcgis/sharing/content/items";

        //arcgisUtils.createMap("4b5e81bda0c44c34b94007ace884bfc2", "map").then(function (response) {
        //arcgisUtils.createMap("346973c168364d1cae3033b10dc16106", "map").then(function (response) {
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items";
        arcgisUtils.createMap("853c2cda0c1b4473a8fa93582305ca2d", "map").then(function (response) {
            mapp1 = response.map;

         

                //var table = document.getElementById('tbodyCoord');
                //var row = table.insertRow(table.length);
                //var cell1 = row.insertCell(0);
                //var cell2 = row.insertCell(1);
               
                //cell1.innerHTML = y;
                //cell2.innerHTML = x;
                
            };     
                //ptt = new Point(-6.830522393999956, 34.008039729000075);
               // ptt = new Point(-763780.176769992, 4027941.238359115);
              //  ptt = new Point(-6.830522393999956, 34.008039729000075);

                //ptt = new Point(-6.8298944549999305, 34.00805424400005);
                //ptt = new Point(-6.829774529999952, 34.008112779000044);
               // ptt = new Point(-6.829715994999958, 34.00802711800003);
               // ptt = new Point(-763780.176769992, 4027941.238359115);
                //alert('ffff');
               // ptt = new Point(-6.862819609999974, 33.99817791700008);
                //ptt = new Point(-6.861154064999937, 33.99358915200003);
                //ptt = new Point(-763780.176769992, 4027941.238359115);
                //var graphic2 = new Graphic(ptt, sym);
                //mapp1.graphics.add(graphic2);
                //mapp1.centerAndZoom(ptt, 17);
               

            });

            //document.getElementById('RefFon').onchange = function () {
            //    var sym1 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            //            new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            //    );

            //    var featureLeyr_parc = new FeatureLayer("http://localhost:6080/arcgis/rest/services/MODAURS/MapServer/0");
            //    var q_parc = new Query();
            //    q_parc.outFields = ["*"];
            //    q_parc.returnGeometry = true;
            //    q_parc.where = "parcellaire.numfoncier='" + this.value + "'";
                
            //    featureLeyr_parc.queryFeatures(q_parc, function (featureSet) {
                    
            //        featuresParc = featureSet.features;
            //        for (var i = 0; i < featuresParc.length; i++) {
            //            //if (geometryEngine.intersects(pt, featuresParc[i].geometry) == true) {
            //            var graphic2 = new Graphic(featuresParc[0].geometry, sym1);
            //           // var graphic2 = new Graphic(featuresParc[0].geometry);
            //            //map.graphics.add(graphic2);
            //            //graphicLayer.add(graphic2);
            //            // }

            //            mapp1.setExtent(graphic2.geometry.getExtent());
            //            mapp1.graphics.add(graphic2);
            //            //mapp1.Zoom(graphic2.geometry, 4);
            //            //console.log(graphic2);
            //        }

                    
                    
            //    });
            //};


            
        });              
    });