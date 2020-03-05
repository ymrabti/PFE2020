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
        alert('ffff');
        /*
              var map = new Map("map", {
              basemap: "streets",
              autoResize: "autoResize",
              center: [-7, 35.6122],
              zoom: 5
              });*/

        var map;
        var array = [];
        var mapp1;
        arcgisUtils.arcgisUrl = "https://portal.geomatic-online.ma/arcgis/sharing/content/items";
       var test = arcgisUtils.createMap("4b5e81bda0c44c34b94007ace884bfc2", "map").then(function (response) {
            mapp1 = response.map;
            console.log(mapp1);

            //var scalebar = new Scalebar({
            //    map: mapp1,
            //    scalebarUnit: "english"
            //});          
        });
        console.log(test);
        //document.getElementById("click").onclick = function () {
        //    //alert(12);

        //    var url = "https://portal.geomatic-online.ma/arcgis2/rest/services/MohcineNRU/ExportWebMapNRU/GPServer/Exporter%20une%20carte%20Web";
        //    var printer = new PrintTask(url);
        //    var params = new PrintParameters();
        //    var template = new PrintTemplate();
        //    //var params = new PrintParameters(); alert(mapp1);
        //    //params.map = mapp1;
        //    template.layout = "impression1";
        //    // template.format = "PNG";   
        //    template.preserveScale = true;
        //    template.outScale = 900;
        //    alert(mapp1)
        //    params.map = mapp1;
        //    params.template = template;
        //    console.log(printer);
        //    printer.execute(params, function (result) {
        //        var doc = new jsPDF();
        //        //var image = 'data:image/jpeg;base64,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';

        //        //doc.addImage(image, 'JPEG', 2, 2);
        //        doc.setFontSize(8);
        //        doc.setFontType('bold');
        //        doc.text("La Commune Urbaine de Marrakech", 3, 4);
        //        var date = new Date();
        //        var d = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        //        doc.text("Marrakech, le " + d, 3, 8);




        //        // Titre 
        //        doc.setFontSize(20);
        //        doc.setFontType('bold');
        //        doc.text("Fiche projet", 85, 22);

        //        // Détails
        //        doc.setFontSize(8);
        //        doc.setFontType('bold');

        //        doc.text("Intitulée du programme:", 70, 34); doc.text(document.getElementById('txtFraction').value, 130, 34);
        //        doc.text("Nature du projet:", 70, 38); doc.text(document.getElementById('txtFraction').value, 130, 38);
        //        doc.text("Objectif:", 70, 42); doc.text(document.getElementById('txtFraction').value, 130, 42);
        //        doc.text("Constistances du projet:", 70, 46); doc.text(document.getElementById('txtFraction').value, 130, 46);
        //        doc.text("Source de financemenet:", 70, 50); doc.text(document.getElementById('txtFraction').value, 130, 50);
        //        doc.text("Budget programme:", 70, 54); doc.text(document.getElementById('txtFraction').value, 130, 54);
        //        doc.text("Code budgetaire:", 70, 58); doc.text(document.getElementById('txtFraction').value, 130, 58);
        //        doc.text("Cout estimé:", 70, 62); doc.text(document.getElementById('txtFraction').value, 130, 62);



        //        var img = new Image;
        //        img.onload = function () {
        //            doc.addPage();
        //            //var image1 = 'data:image/png;base64,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';
        //            //doc.addImage(image1, 'PNG', 5, 5);
        //            //var image = 'data:image/png;base64,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'
        //            //doc.addImage(image, 'PNG', 80, 4);
        //            doc.addImage(this, 0, 2);
        //            //doc.setFontSize(14);
        //            //doc.setFontType('bold');
        //            //doc.text("Carte de situation", 90, 60);
        //            // doc.save('Informations_urbanistiques.pdf');
        //            // string = doc.output('datauristring');
        //            var blob = doc.output("blob");
        //            console.log(blob);
        //            // window.open(URL.createObjectURL(blob));
        //            //var img = "<img src='" + string + "' />";
        //            //console.log(string);
        //            doc.save("ffff.pdf");
        //            //document.getElementById("NRUDiv").innerHTML = '<div><object style="height:780px; width:100%" type="application/pdf" data="' + URL.createObjectURL(blob) + '" ></object></div>';
        //            // document.getElementById("NRUDiv").innerHTML = '<div><iframe style="height:780px; width:100%"  src="C:/Users/user/Downloads/SGIPM_PV2_(11_12-2018).doc" ></iframe></div>';
        //        }
        //        img.crossOrigin = "";
        //        img.src = result.url;
        //    }, function (error) {
        //        alert(22);
        //        console.log('error: ', error);
        //    });
        //};
            /// Creation de la carte 
          

        document.getElementById("idNat").onchange = function () {
            var btnValue = document.getElementById('idNat').value;
            if (btnValue == 1) { document.getElementById('DivNbNiveau').style.display = "block"; }
            else { document.getElementById('DivNbNiveau').style.display = "none"; }

        };
         //arcgisUtils.createMap("a1a11d6b28184138a7c29ea0dcc7554d", "map").then(function (response) {        



       
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items";
           arcgisUtils.createMap("c373128a6e8a4302a57fae57eeb91858", "map").then(function (response) {           
            map = response.map;
        });

            document.getElementById("Preff").onchange = function () {

            document.getElementById("Comm").options.length = 1;

            featureLayer_Commune = new FeatureLayer("https://services3.arcgis.com/hjUMsSJ87zgoicvl/ArcGIS/rest/services/NRUAURS/FeatureServer/4");
            q_Comm = new Query();
            q_Comm.outFields = ["*"];
            q_Comm.returnGeometry = true;
            q_Comm.where = "CodeProvince  = '" + document.getElementById("Preff").value + "'";
            featureLayer_Commune.queryFeatures(q_Comm, result_Comm);
            function result_Comm(featureSet_Comm) {
                var featurescomm = featureSet_Comm.features;
                if (featurescomm != null) {
                    for (var i = 0; i < featurescomm.length; i++) {
                        var oOption = document.createElement('OPTION');
                        oOption.value = featurescomm[i].attributes["OBJECTID"];
                        oOption.text = featurescomm[i].attributes["NomCommune"];
                        try {
                            document.getElementById("Comm").add(oOption, i + 1);
                        }
                        catch (e) {
                            document.getElementById("Comm").add(oOption, null);
                        }
                    }
                }
            }
        };

        document.getElementById("RefFon").onchange = function () {

      
            var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            );


            q_parcellaire = new QueryTask("https://services3.arcgis.com/hjUMsSJ87zgoicvl/ArcGIS/rest/services/NRUAURS/FeatureServer/0");
            q_p = new Query();
            q_p.outFields = ["*"];
            q_p.returnGeometry = true;
            q_p.where = "numfoncier=" + document.getElementById("RefFon").value;           
            alert('cccc');
            //+" AND yCenteroid = "+pol.getCentroid().y;alert(pol.getCentroid().x);alert(pol.getCentroid().y);
            q_parcellaire.execute(q_p, result);

            function result(featureSet) {
                console.log(featureSet);
                var features_parcellaire = featureSet.features;
                if (features_parcellaire.length != 0) {
                    var graphic2 = new Graphic(features_parcellaire[0].geometry, sym);
                    map.graphics.add(graphic2);
                    var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                    map.setExtent(extent);
                }
            }
          //  alert("CodeProvince  = '" + document.getElementById("RefFon").value + "'");
        };


      

        document.getElementById('addCoord').onclick = function () {
         
            var table = document.getElementById('tbodyCoord');
            var row = table.insertRow(table.length);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = document.getElementById("RefFon").value;
            cell2.innerHTML = document.getElementById("txtFraction").value;

          


            //Loop through the Table rows and build a JSON array.
            var customers = new Array();

            var customer = {};
            customer.Name = document.getElementById("RefFon").value;
            customer.Country = document.getElementById("txtFraction").value;
            customers.push(customer);

            console.log(customer);
                }; 
             
        $.ajax({
            type: "POST",
            url: "/WorkflowAutorisation/Index1",
            data: JSON.stringify(customers),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                alert(r + " record(s) inserted.");
            }
        });

        //Aspect juridique
        


    });