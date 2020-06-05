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
        var tableEnLigne = document.getElementById('tableDemandePayee1');
        var rowsEnMigne = tableEnLigne.rows;
      
        for (var i = 0; i < rows.length; i++) {          

           
            var date = new Date(rows[i].getAttribute('value'));           
            var dateNow = new Date();
            var date_now = new Date(dateNow.toISOString().slice(0, 10) + ',' + dateNow.getHours() + ':' + dateNow.getMinutes());           
            var tempsRester = (date.getTime() + 172800000) - date_now.getTime(); 
            var tempsResterSec = 172800000 - tempsRester; 
            var backclr = '';
            var clr = '';
            if (tempsRester < 0) { backclr = '#d70702'; clr = 'white' } else if (0 <= tempsRester && tempsRester < 43200000) { backclr = '#e38710'; clr = 'white' }
            rows[i].setAttribute('temps', tempsResterSec);
            rows[i].setAttribute('backclr', backclr);
            rows[i].setAttribute('clr', clr);
            rows[i].style.backgroundColor = backclr;
            rows[i].style.color = clr;

            rows[i].onclick = function () {
                for (var j = 0; j < rows.length; j++) {
                    table.rows[j].style.backgroundColor = table.rows[j].getAttribute('backclr');
                    table.rows[j].style.color = table.rows[j].getAttribute('clr');
                    table.rows[j].clicked = false;
                }

                for (var j = 0; j < rowsEnMigne.length; j++) {
                    tableEnLigne.rows[j].style.backgroundColor = tableEnLigne.rows[j].getAttribute('backclr');
                    tableEnLigne.rows[j].style.color = tableEnLigne.rows[j].getAttribute('clr');
                    tableEnLigne.rows[j].clicked = false;
                }
                var id = this.id;
                document.getElementById(id).style.backgroundColor = "#337ab7";
                document.getElementById(id).style.borderColor = "#2e6da4";
                document.getElementById(id).style.color = "#fff";
                document.getElementById(id).clicked = true;
                document.getElementById('hiddenDemande').value = id;
            }

           
           rows[i].onmouseover = function () {
                var id = this.id;               
                if (document.getElementById(id).clicked != true) {
                    document.getElementById(id).style.backgroundColor = "#f5f5f5";
                    document.getElementById(id).style.borderColor = "#f5f5f5";
                    document.getElementById(id).style.color = '';
                }
            }

            rows[i].onmouseout = function () {
                var id = this.id;
                if (document.getElementById(id).clicked != true) {
                    document.getElementById(id).style.backgroundColor = document.getElementById(id).getAttribute('backclr');
                    document.getElementById(id).style.borderColor = '';
                    document.getElementById(id).style.color = document.getElementById(id).getAttribute('clr');
                }
            }

        };

       

        for (var i = 0; i < rowsEnMigne.length; i++) {


            var date = new Date(rowsEnMigne[i].getAttribute('value'));
            var dateNow = new Date();
            var date_now = new Date(dateNow.toISOString().slice(0, 10) + ',' + dateNow.getHours() + ':' + dateNow.getMinutes());
            var tempsRester = (date.getTime() + 172800000) - date_now.getTime();
            var tempsResterSec = 172800000 - tempsRester;
            var backclr = '';
            var clr = '';
            if (tempsRester < 0) { backclr = '#d70702'; clr = 'white' } else if (0 <= tempsRester && tempsRester < 43200000) { backclr = '#e38710'; clr = 'white' }
            rowsEnMigne[i].setAttribute('temps', tempsResterSec);
            rowsEnMigne[i].setAttribute('backclr', backclr);
            rowsEnMigne[i].setAttribute('clr', clr);
            rowsEnMigne[i].style.backgroundColor = backclr;
            rowsEnMigne[i].style.color = clr;

            rowsEnMigne[i].onclick = function () {
                for (var j = 0; j < rowsEnMigne.length; j++) {
                    tableEnLigne.rows[j].style.backgroundColor = tableEnLigne.rows[j].getAttribute('backclr');
                    tableEnLigne.rows[j].style.color = tableEnLigne.rows[j].getAttribute('clr');
                    tableEnLigne.rows[j].clicked = false;
                }

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


            rowsEnMigne[i].onmouseover = function () {
                var id = this.id;
                if (document.getElementById(id).clicked != true) {
                    document.getElementById(id).style.backgroundColor = "#f5f5f5";
                    document.getElementById(id).style.borderColor = "#f5f5f5";
                    document.getElementById(id).style.color = '';
                }
            }

            rowsEnMigne[i].onmouseout = function () {
                var id = this.id;
                if (document.getElementById(id).clicked != true) {
                    document.getElementById(id).style.backgroundColor = document.getElementById(id).getAttribute('backclr');
                    document.getElementById(id).style.borderColor = '';
                    document.getElementById(id).style.color = document.getElementById(id).getAttribute('clr');
                }
            }

        };
                                                         
    });

    