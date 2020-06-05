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
        geometryEngine
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
        var graphicLayer = new GraphicsLayer();
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items";
        arcgisUtils.createMap("853c2cda0c1b4473a8fa93582305ca2d", "map").then(function (response) {
            //update the app
            // dom.byId("title").innerHTML = response.itemInfo.item.title;
            // dom.byId("subtitle").innerHTML = response.itemInfo.item.snippet;

            map = response.map;

            graphicLayer.on('click', function (e) {
                $("#tbodyCoord tr").remove();
                array = [];
                gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

                var pointsGraphic = e.graphic.geometry.rings[0];
                for (var i = 0; i < pointsGraphic.length - 1; i++) {
                    var x = pointsGraphic[i][0];
                    var y = pointsGraphic[i][1];
                    array.push([x, y]);
                    var wkid = new SpatialReference(4326);
                    pt = new Point(x, y, wkid);
                    var wkid1 = new SpatialReference(26191);

                    gsvc.project([pt], wkid1, function (projectPoint) {
                        var p = projectPoint[0];
                        // array.push([p.x, p.y]);
                        var table = document.getElementById('tbodyCoord');
                        var row = table.insertRow(table.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        cell1.innerHTML = "B" + table.rows.length;
                        cell2.innerHTML = p.x.toFixed(3);
                        cell3.innerHTML = p.y.toFixed(3);
                        var btn = document.createElement("input");
                        btn.setAttribute("id", table.rows.length);
                        btn.setAttribute("src", "../Content/documentation/img/modif.png");
                        btn.setAttribute("type", "image");
                        btn.setAttribute("name", "update");
                        btn.onclick = function () {
                            var id = this.id;
                            cell2.innerHTML = "<input type='text' class='form-control' id='new_lon' value='" + table.rows[id - 1].cells[1].innerHTML + "'/>";
                            cell3.innerHTML = "<input type='text' class='form-control' id='new_lat' value='" + table.rows[id - 1].cells[2].innerHTML + "'/>";


                            var valider = document.createElement('input');
                            valider.setAttribute('src', "../Content/documentation/img/valid.png");
                            valider.setAttribute('id', table.rows.length);
                            valider.setAttribute('type', "image");
                            valider.onclick = function () {
                                var a = document.getElementById('new_lon').value.replace(",", ".");
                                var b = document.getElementById('new_lat').value.replace(",", ".");
                                cell2.innerHTML = document.getElementById('new_lon').value.replace(",", ".");
                                cell3.innerHTML = document.getElementById('new_lat').value.replace(",", ".");
                                var pt2 = new Point(a, b, wkid);
                                gsvc.project([pt2], wkid1, function (projectPoint) {
                                    var p2 = projectPoint[0];
                                    array[id - 1] = [p2.x, p2.y];
                                });
                                cell4.removeChild(valider); cell4.removeChild(btn1);
                                cell4.appendChild(btn);
                            }


                            var btn1 = document.createElement('input');
                            btn1.setAttribute("src", "../Content/documentation/img/del.png");
                            btn1.setAttribute("type", "image");
                            btn1.setAttribute("id", id);
                            btn1.setAttribute("name", "delete");
                            btn1.onclick = function () {
                                if (table.rows.length > btn1.getAttribute('id')) {
                                    table.deleteRow(id - 1);
                                    array.splice(id - 1, 1);
                                    var x1 = parseInt(id) - 1;
                                    for (var i = x1; i < table.rows.length + 1; i++) {
                                        var j = document.getElementsByName("update")[i].getAttribute('id');
                                        var k = i + 1;
                                        table.rows[i].cells[0].innerHTML = "B" + k;
                                        document.getElementsByName("update")[i].setAttribute('id', j - 1);
                                    }
                                }
                                if (table.rows.length <= btn1.getAttribute('id') && table.rows.length > 1) { table.deleteRow(id - 1); array.splice(id - 1, 1); }
                                if (table.rows.length <= btn1.getAttribute('id') && table.rows.length == 1) {
                                    table.deleteRow(id - 1); array.splice(id - 1, 1);
                                    document.getElementById('vider').disabled = true;
                                }
                            }
                            cell4.removeChild(btn);
                            cell4.appendChild(valider);
                            cell4.appendChild(btn1);
                        }
                        cell4.appendChild(btn);
                    });
                }
            });

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

        /****************************************************************
         * Add feature layer - A FeatureLayer at minimum should point
         * to a URL to a feature service or point to a feature collection 
         * object.
         ***************************************************************/

        // Carbon storage of trees in Warren Wilson College.   
        var xCenteroidF;
        var yCenteroidF;



     

        //document.getElementById('localiser').onclick = Localiser();
        $("#VerifTerrain").click(Localiser);

        $("#divInfo").on("click", "#addCoord", function () {           
            gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var x = document.getElementById('xx');
            var y = document.getElementById('yy');
            var wkid = new SpatialReference(26191);
            pt = new Point(x.value.replace(",", "."), y.value.replace(",", "."), wkid);
            var wkid1 = new SpatialReference(4326);
            gsvc.project([pt], wkid1, function (projectPoint) {
                var p = projectPoint[0];
                array.push([p.x, p.y]);
                var table = document.getElementById('tbodyCoord');
                var row = table.insertRow(table.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = "B" + table.rows.length;
                cell2.innerHTML = x.value.replace(",", ".");
                cell3.innerHTML = y.value.replace(",", ".");
                var btn = document.createElement("input");
                btn.setAttribute("id", table.rows.length);
                btn.setAttribute("src", "../Content/documentation/img/modif.png");
                btn.setAttribute("type", "image");
                btn.setAttribute("name", "update");
                btn.onclick = function () {
                    var id = this.id;
                    cell2.innerHTML = "<input type='text' class='form-control' id='new_lon' value='" + table.rows[id - 1].cells[1].innerHTML + "'/>";
                    cell3.innerHTML = "<input type='text' class='form-control' id='new_lat' value='" + table.rows[id - 1].cells[2].innerHTML + "'/>";


                    var valider = document.createElement('input');
                    valider.setAttribute('src', "../Content/documentation/img/valid.png");
                    valider.setAttribute('id', table.rows.length);
                    valider.setAttribute('type', "image");
                    valider.onclick = function () {
                        var a = document.getElementById('new_lon').value.replace(",", ".");
                        var b = document.getElementById('new_lat').value.replace(",", ".");
                        cell2.innerHTML = document.getElementById('new_lon').value.replace(",", ".");
                        cell3.innerHTML = document.getElementById('new_lat').value.replace(",", ".");
                        var pt2 = new Point(a, b, wkid);
                        gsvc.project([pt2], wkid1, function (projectPoint) {
                            var p2 = projectPoint[0];
                            array[id - 1] = [p2.x, p2.y];
                        });
                        cell4.removeChild(valider); cell4.removeChild(btn1);
                        cell4.appendChild(btn);
                    }


                    var btn1 = document.createElement('input');
                    btn1.setAttribute("src", "../Content/documentation/img/del.png");
                    btn1.setAttribute("type", "image");
                    btn1.setAttribute("id", id);
                    btn1.setAttribute("name", "delete");
                    btn1.onclick = function () {
                        if (table.rows.length > btn1.getAttribute('id')) {
                            table.deleteRow(id - 1);
                            array.splice(id - 1, 1);
                            var x1 = parseInt(id) - 1;
                            for (var i = x1; i < table.rows.length + 1; i++) {
                                var j = document.getElementsByName("update")[i].getAttribute('id');
                                var k = i + 1;
                                table.rows[i].cells[0].innerHTML = "B" + k;
                                document.getElementsByName("update")[i].setAttribute('id', j - 1);
                            }
                        }
                        if (table.rows.length <= btn1.getAttribute('id') && table.rows.length > 1) { table.deleteRow(id - 1); array.splice(id - 1, 1); }
                        if (table.rows.length <= btn1.getAttribute('id') && table.rows.length == 1) {
                            table.deleteRow(id - 1); array.splice(id - 1, 1);
                            document.getElementById('vider').disabled = true;
                        }
                    }
                    cell4.removeChild(btn);
                    cell4.appendChild(valider);
                    cell4.appendChild(btn1);
                }
                cell4.appendChild(btn);
                x.value = "";
                y.value = "";
                x.style.boxShadow = "";
                y.style.boxShadow = "";
            });
        });
     

        document.getElementById('alimBD').onclick = function () {
            alert(66);
            var typeFonc = document.getElementById('selRef').value;
            var numFonc = document.getElementById('numfonc').value;
            var indice = document.getElementById('indice').value;
            var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            );
            if (typeFonc == 'TNI') {
                var pol = new Polygon(array);
                gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                var wkid = new SpatialReference(4326);
                pt = new Point(pol.getCentroid().x, pol.getCentroid().y, wkid);
                var wkid1 = new SpatialReference(26191);
                gsvc.project([pt], wkid1, function (projectPoint) {
                    var p = projectPoint[0];
                    var f = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                    var xCenteroid = p.x.toFixed(3).replace(".", ",");
                    var yCenteroid = p.y.toFixed(3).replace(".", ",");
                    attr = { "typefoncier": typeFonc, "xCenteroid": xCenteroid, "yCenteroid": yCenteroid };
                    var graphic = new Graphic(pol, sym, attr);
                    f.applyEdits([graphic], null, null, function () {
                        Localiser();
                    });

                });
            } else {

                var pol = new Polygon(array);
                array = [];
                var f = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                attr = { "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice };
                var graphic = new Graphic(pol, sym, attr);
                f.applyEdits([graphic], null, null, function () {
                    Localiser();
                });
                map.graphics.clear();
                $("#tbodyCoord tr").remove();
                $('alimBD').hide();
            }
        }
               


        function Localiser() {            
            graphicLayer.clear();
            var petFr = document.getElementById('petFrance').value;
            var petAr = document.getElementById('petArabe').value;
            var typeFonc = document.getElementById('selRef').value;            
            if ($("#numfonc").val() != undefined) { var numFonc = document.getElementById('numfonc').value; }
            if ($("#indice").val() != undefined) { var indice = document.getElementById('indice').value; }
            map.graphics.clear();           
            if (typeFonc == "" || (petFr == "" && petAr == "")) {

                document.getElementById('error').style.display = 'block';
                document.getElementById('error').innerHTML = "Merci de remplire tous les champs nécessaires"
            }            
            else {
                document.getElementById('error').style.display = 'none';                
                if (array.length != 0) {
                    alert(44);
                    if (array.length == 1) {
                        alert(55);
                        var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([255, 0, 0]), 1),
                            new Color([0, 255, 0, 0.25]));
                        var sym1 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                                new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
                        );
                        map.graphics.clear();
                        var pt = new Point(array[0][0], array[0][1]);
                        featureLeyr_parc = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                        q_parc = new Query();
                        q_parc.outFields = ["*"];
                        q_parc.returnGeometry = true;
                        q_parc.where = "typefoncier = 'TNI'";
                        featureLeyr_parc.queryFeatures(q_parc, function (featureSet) {
                            featuresParc = featureSet.features;
                            for (var i = 0; i < featuresParc.length; i++) {
                                if (geometryEngine.intersects(pt, featuresParc[i].geometry) == true) {
                                    var graphic2 = new Graphic(featuresParc[i].geometry, sym1);
                                    //map.graphics.add(graphic2);
                                    graphicLayer.add(graphic2);
                                }
                            }
                            map.addLayer(graphicLayer);
                        });


                        var graphic2 = new Graphic(pt, sym);
                        map.graphics.add(graphic2);
                        // var extent = pt.getExtent().expand(2);
                        map.centerAndZoom(pt, 17);

                    } else {
                        var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                                new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
                        );
                        map.graphics.clear();
                        var pol = new Polygon(array);
                        gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                        var wkid = new SpatialReference(4326);

                        pt = new Point(pol.getCentroid().x, pol.getCentroid().y, wkid);
                        var wkid1 = new SpatialReference(26191);
                        gsvc.project([pt], wkid1, function (projectPoint) {
                            var p = projectPoint[0];
                            var xCenteroid = p.x.toFixed(3);
                            var yCenteroid = p.y.toFixed(3);
                            xCenteroidF = p.x.toFixed(3);
                            yCenteroidF = p.y.toFixed(3);
                            var graphic2 = new Graphic(pol, sym);
                            map.graphics.add(graphic2);
                            var extent = pol.getExtent().expand(2);
                            map.setExtent(extent);
                            alert(666);
                            q_parcellaire = new QueryTask("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                            q_p = new Query();
                            q_p.outFields = ["*"];
                            q_p.returnGeometry = true;
                            q_p.where = "typefoncier = '" + typeFonc + "' AND xcenteroid  = " + xCenteroid + " AND ycenteroid  =" + yCenteroid; //+" AND yCenteroid = "+pol.getCentroid().y;alert(pol.getCentroid().x);alert(pol.getCentroid().y);
                            q_parcellaire.execute(q_p, result);

                            function result(featureSet) {
                                var features_parcellaire = featureSet.features;
                                if (features_parcellaire.length != 0) {
                                    var graphic2 = new Graphic(features_parcellaire[0].geometry, sym);
                                    map.graphics.add(graphic2);
                                    var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                                    map.setExtent(extent);
                                    document.getElementById('alimBD').style.display = 'none';
                                    document.getElementById('idparcellaire').value = features_parcellaire[0].attributes['objectid'];
                                    featureLeyr_Comm = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/3");
                                    q_Comm = new Query();
                                    q_Comm.outFields = ["*"];
                                    q_Comm.returnGeometry = true;
                                    q_Comm.geometry = features_parcellaire[0].geometry;
                                    featureLeyr_Comm.queryFeatures(q_Comm, function (featureSet) {
                                        featuresComm = featureSet.features; alert(88);
                                        document.getElementById('idprov').value = featuresComm[0].attributes['id_prov'];
                                        document.getElementById('idcommune').value = featuresComm[0].attributes['id_commune'];
                                    });

                                } else {
                                    document.getElementById('alimBD').style.display = 'inline';
                                    document.getElementById('coordInputs').style.display = 'block';
                                    document.getElementById('error').style.display = 'block';
                                }
                            }
                        });
                    }
                } else {
                    if (numFonc != "") {                        
                        var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                                new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
                        );

                        q_parcellaire = new QueryTask("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
                        q_p = new Query();
                        q_p.outFields = ["*"];
                        q_p.returnGeometry = true;
                        q_p.where = "typefoncier = '" + typeFonc + "' AND numfoncier = '" + numFonc + "' AND indice = '" + indice + "'";
                        q_parcellaire.execute(q_p, result);
                        function result(featureSet) {
                            var features_parcellaire = featureSet.features;                            
                            if (features_parcellaire.length != 0) {
                                var graphic2 = new Graphic(features_parcellaire[0].geometry, sym);
                                map.graphics.add(graphic2);
                                var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                                map.setExtent(extent);
                                document.getElementById('idparcellaire').value = features_parcellaire[0].attributes['objectid'];
                                featureLeyr_Comm = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/3");
                                q_Comm = new Query();
                                q_Comm.outFields = ["*"];
                                q_Comm.returnGeometry = true;
                                q_Comm.geometry = features_parcellaire[0].geometry;
                                featureLeyr_Comm.queryFeatures(q_Comm, function (featureSet) {
                                    featuresComm = featureSet.features;
                                    document.getElementById('idprov').value = featuresComm[0].attributes['id_prov'];
                                    document.getElementById('idcommune').value = featuresComm[0].attributes['id_commune'];
                                });

                            } else {
                                $("#error").append("Ce titre foncier n'existe pas dans la base de données<br/><br/>")
                                document.getElementById('error').style.display = 'block';
                                $('#divInfo').append("<div class='form-group' id='coordInputs'>" +
                                    "<label for='inputText11'>Coordonnées lambert :</label>"+
                                        "<div class='form-group' class='col-sm-4'>"+
                                            "<input type='text' id='xx' class='form-control' placeholder='X'>"+
                                        "</div>"+
                                        "<div class='form-group' class='col-sm-4'>"+
                                            "<input type='text' id='yy' class='form-control' placeholder='Y'>"+
                                        "</div>"+
                                        "<button class='btn btn-space btn-primary' type='button' style='position:absolute;right:10px' id='addCoord'>Ajouter coordonnées</button>"+
                                        "<br/> <br/> <br/>"+
                                        "<div class='table-responsive'>"+
                                            "<table class='table table-striped table-bordered first' style='border-spacing:2px;border-collapse:separate'>"+
                                                "<thead>"+
                                                    "<tr>"+
                                                        "<th>N° Borne</th>"+
                                                        "<th>X</th>"+
                                                        "<th>Y</th>"+
                                                    "</tr>"+
                                                "</thead>"+
                                                "<tbody id='tbodyCoord'></tbody>"+
                                            "</table>"+
                                        "</div>"+   
                                    "</div>");
                                document.getElementById('alimBD').style.display = 'inline';  
                            }
                        }
                    } else {
                        document.getElementById('error').style.display = 'block';
                        document.getElementById('error').innerHTML = "Merci de remplire tous les champs nécessaires";
                    }

                }
            }
        }

    });