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
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/dijit/LayerList",
    "esri/dijit/Legend",
    "esri/dijit/BasemapGallery",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/toolbars/draw",
    "esri/symbols/SimpleFillSymbol",

    "dojo/parser", "dijit/registry",
    "esri/geometry/Polygon",
    "esri/geometry/Point",
    "esri/dijit/HomeButton",
    "esri/geometry/geometryEngine",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/WidgetSet", 
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
        Extent,
        SpatialReference,
        LayerList,
        Legend,
        BasemapGallery,
        Graphic,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        Color,
        Draw,
        SimpleFillSymbol, parser, registry,
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
        arcgisUtils.arcgisUrl = "https://si.aurs.org.ma/portal/sharing/content/items";
        arcgisUtils.createMap("fe0cf9e1c18f44388cae869a212d72de", "map").then(function (response) {
            //arcgisUtils.createMap("245516f3a0364a899ead7f121b03c860", "map").then(function (response) {
            //update the app
            // dom.byId("title").innerHTML = response.itemInfo.item.title;
            // dom.byId("subtitle").innerHTML = response.itemInfo.item.snippet;

            map = response.map;
            //console(map.getExtent());
           

            //var legendLayers = arcgisUtils.getLegendLayers(response);
            //var legendDijit = new Legend({
            //    map: map,
            //    layerInfos: legendLayers
            //}, "legend");
            //legendDijit.startup();

            //var layerList = new LayerList({
            //    map: response.map,
            //    layers: arcgisUtils.getLayerList(response)
            //}, "layerList");

            //layerList.startup();

            //var basemapGallery = new BasemapGallery({
            //    showArcGISBasemaps: true,
            //    map: map
            //}, "basemapGallery");
            //basemapGallery.startup();
            //basemapGallery.on("load", function () {
            //    var tot = basemapGallery.basemaps.length;
            //    for (var i = 0; i < tot + 1; i++) {
            //        if (basemapGallery.basemaps[i].title === "Canevas gris foncé"
            //            || basemapGallery.basemaps[i].title === "Streets (Night)"
            //            || basemapGallery.basemaps[i].title == "Nuances de gris"
            //            || basemapGallery.basemaps[i].title === "Navigation"
            //            || basemapGallery.basemaps[i].title === "Océans et bathymétrie") {
            //            basemapGallery.remove(basemapGallery.basemaps[i].id);
            //        }
            //    }
            //});

            gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            graphicLayer.on('click', function (e) {
                $("#tbodyCoord tr").remove();
                array = [];

                var pointsGraphic = e.graphic.geometry.rings[0];
                //console.log(features_parcellaire[0].geometry);
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

        

        var xminextend = 86661.6116; var yminextend = 109335.0949; var xmaxextend = 916839.6617; var ymaxextend = 602597.8926;

        var xrandom = Math.random() * (xmaxextend - xminextend) + xminextend;
        var yrandom = Math.random() * (ymaxextend - yminextend) + yminextend;

        var xmax = xrandom + 1000; var xmin = xrandom - 1000;
        var ymax = yrandom + 500; var ymin = yrandom - 600;

        var x = document.getElementById('xx');
        var y = document.getElementById('yy');

        document.getElementById('xx').onclick = function () {
            x.value = Math.random() * (xmax - xmin) + xmin;
            y.value = Math.random() * (ymax - ymin) + ymin;
        }

        // Carbon storage of trees in Warren Wilson College.  
        var xCenteroidF;
        var yCenteroidF;


        //x.value = Math.floor(Math.random() * 954135) + 947100;
        //y.value = Math.floor(Math.random() * 3473355) + 3469086;

        x.value = Math.random() * (xmax - xmin) + xmin;
        y.value = Math.random() * (ymax - ymin) + ymin;

        var wkid = new SpatialReference(26191);
        var wkid1 = new SpatialReference(3857);


        gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");



        document.getElementById('addCoord').onclick = function () {
            pt = new Point(x.value.replace(",", "."), y.value.replace(",", "."), wkid);
            //map.setZoom(15); 
            gsvc.project([pt], wkid1, function (projectPoint) {
                var p = projectPoint[0];
                /////Zoom to Added point
                //var sym = new SimpleMarkerSymbol ( SimpleMarkerSymbol.STYLE_SQUARE, 10,
                //    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));

                var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 1),
                    new Color([0, 255, 0, 0.25]));


                var graphic2 = new Graphic(p, sym);

                map.graphics.add(graphic2);
                //console.log(projectPoint[0]);

                var thispoint = [p.x, p.y];
                array.push(thispoint);


                console.log(array);
                //Liste.push(p);
                //map.centerAt(p);
                if (array.length == 1) {
                    map.centerAt(p);
                }
                else {
                    var arrayx = []; var arrayy = [];
                    for (ik = 0; ik < array.length; ik++) { arrayx.push(array[ik][0]) };
                    for (ik = 0; ik < array.length; ik++) { arrayy.push(array[ik][1]) };
                    var _xmax = Math.max(...arrayx); var _xmin = Math.min(...arrayx);
                    var _ymax = Math.max(...arrayy); var _ymin = Math.min(...arrayy);



                    var startExtent = new Extent();
                    startExtent.xmin = _xmin;
                    startExtent.ymin = _ymin;
                    startExtent.xmax = _xmax;
                    startExtent.ymax = _ymax;
                    startExtent.spatialReference = wkid1;

                    map.setExtent(startExtent);

                    console.log([_xmin, _ymin, _xmax, _ymax]);
                    console.log('\n\n');
                    //new Extent({ xmin: -20098296, ymin: -2804413, xmax: 5920428, ymax: 15813776, spatialReference: { wkid: 54032 } })
                }

                ///////////////////////

                //console.log(projectPoint);
                //console.log(array);
                var table = document.getElementById('tbodyCoord');
                var row = table.insertRow(table.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = "P" + table.rows.length;
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
                                table.rows[i].cells[0].innerHTML = "P" + k;
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
                //x.value = Math.floor(Math.random() * 954135) + 947100;
                //y.value = Math.floor(Math.random() * 3473355) + 3469086;
                x.value = Math.random() * (xmax - xmin) + xmin;
                y.value = Math.random() * (ymax - ymin) + ymin;
                x.style.boxShadow = "";
                y.style.boxShadow = "";
            });
        }

        document.getElementById('alimBD').onclick = function () {

            var typeFonc = document.getElementById('selRef').value;
            var numFonc = document.getElementById('numfonc').value;
            var indice = document.getElementById('indice').value;
            var fraction = document.getElementById('fraction').value;
            var complement = document.getElementById("complement").value;
            var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            );

            if (typeFonc == 'TNI') {
                var pol = new Polygon(array);

                var wkid = new SpatialReference(26191);
                var wkid1 = new SpatialReference(3857);
                pt = new Point(pol.getCentroid().x, pol.getCentroid().y, wkid);
                console.log('Centroid : ' + [pol.getCentroid().x, pol.getCentroid().y]);
                gsvc.project([pt], wkid1, function (projectPoint) {
                    var p = projectPoint[0];
                    var f = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/FeatureServer/0");
                    var xCenteroid = p.x.toFixed(3).replace(".", ",");
                    var yCenteroid = p.y.toFixed(3).replace(".", ",");
                    attr = { "typefoncier": typeFonc, "x": xCenteroid, "y": yCenteroid };
                    var graphic = new Graphic(pol, sym, attr);
                    f.applyEdits([graphic], null, null, function () {
                        Localiser();
                    });

                });
            } else {
                array = [];
                array.push([-746530.0130604643, 4017850.880879946]);
                array.push([-746503.3819100509, 4017862.1044801027]);
                array.push([-746439.371403158, 4017961.4527203813]);


                var pol = new Polygon(array);
                var sr = new SpatialReference(3857);
                pol.setSpatialReference(sr);
                //array = [];
                console.log(pol);

                var f = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/FeatureServer/0", { outFields: ["*"] });
                attr = { "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice, "fraction": fraction };
                //  attr = { "OBJECTID": 10054, "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice, "fraction": fraction, "complement": complement };
                attr = { "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice, "fraction": fraction, "complement": complement };
                // var graphic = new Graphic([pol], null, null);



                //var feature = [];      
                //var attr = {};
                //attr["typefoncier"] = typeFonc;  
                //var graphic = new Graphic([pol]);
                //graphic.setAttributes(attr);
                //feature.push(graphic);


                //console.log(feature);

                var sr = new SpatialReference(102100);
                gsvc.project([pol], sr, function (projectpol) {
                    var poly = projectpol[0];
                    var graphic = new Graphic([poly], null, null);

                    f.applyEdits([graphic], null, null, function (res) {
                        console.log(res);
                        Localiser();
                        alert('C est Bon');
                    }, function (err) {
                        console.log('Error occured: ', err);
                        alert('Error');
                    });
                });
                map.graphics.clear();
                $("#tbodyCoord tr").remove();
                $('alimBD').hide();
            }
        }

        document.getElementById('selRef').onchange = function () {
            var typeFonc = document.getElementById('selRef').value;
            var numFonc = document.getElementById('numfonc').value;
            var indice = document.getElementById('indice').value;
            var fraction = document.getElementById('fraction').value;
            document.getElementById('indice').disabled = false;
            if (typeFonc == 'TF') {
                document.getElementById('coordInputs').style.display = 'none';
                document.getElementById('refInputs').style.display = 'block';
                $('#indice').prop('disabled', false).trigger("liszt:updated");
            } else if (typeFonc == 'Req') {
                document.getElementById('coordInputs').style.display = 'none';
                document.getElementById('refInputs').style.display = 'block';
                document.getElementById('indice').value = "";
                //$('#indice').prop('disabled', true).trigger("liszt:updated");

            } else if (typeFonc == 'TNI') {
                document.getElementById('coordInputs').style.display = 'block';
                document.getElementById('refInputs').style.display = 'none';
            }
        }

        document.getElementById('vider').onclick = function () {
            document.getElementById('error').style.display = 'none'
            document.getElementById('xx').value = "";
            document.getElementById('yy').value = "";
            document.getElementById('numfonc').value = "";
            document.getElementById('indice').value = "";
            document.getElementById('selRef').selectedIndex = "0";
            array = [];
            map.graphics.clear();
            $("#tbodyCoord tr").remove();
        }

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


        $("#localiser").click(Localiser);

        
        function Localiser() {

            graphicLayer.clear();
            document.getElementById('coordInputs').style.display = 'none';
            document.getElementById('xx').value = "";
            document.getElementById('yy').value = "";
            array = [];
            map.graphics.clear();
            $("#tbodyCoord tr").remove();
            var petFr = document.getElementById('petFrance').value;
            var petAr = document.getElementById('petArabe').value;
            var typeFonc = document.getElementById('selRef').value;
            var numFonc = document.getElementById('numfonc').value;
            var indice = document.getElementById('indice').value;
            var fraction = document.getElementById('fraction').value;
            var complement = document.getElementById("complement").value;
            map.graphics.clear();
            if (typeFonc == "" || (petFr == "" && petAr == "")) {
                document.getElementById('error').style.display = 'block';
                document.getElementById('error').innerHTML = "Merci de remplire tous les champs nécessaires"
            }
            else {
                document.getElementById('error').style.display = 'none';
                if (array.length != 0) {
                    console.log(array);
                    if (array.length == 1) {
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

                        console.log(pt);

                        featureLeyr_parc = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/MapServer/0");
                        q_parc = new Query();
                        q_parc.outFields = ["*"];
                        q_parc.returnGeometry = true;
                        q_parc.where = "typefoncier = 'TNI'";
                        featureLeyr_parc.queryFeatures(q_parc, function (featureSet) {
                            featuresParc = featureSet.features;
                            for (var i = 0; i < featuresParc.length; i++) {
                                console.log(pt); console.log(featuresParc[i].geometry);
                                if (geometryEngine.intersects(pt, featuresParc[i].geometry) == true) {
                                    var graphic2 = new Graphic(featuresParc[i].geometry, sym1);
                                    graphicLayer.add(graphic2);
                                }
                            }
                            map.addLayer(graphicLayer);
                        });
                        var graphic2 = new Graphic(pt, sym);
                        map.graphics.add(graphic2);
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
                            var xCenteroid = p.x.toFixed(3).replace(".", ","); console.log(xCenteroid);
                            var yCenteroid = p.y.toFixed(3).replace(".", ","); console.log(yCenteroid);
                            xCenteroidF = p.x.toFixed(3);
                            yCenteroidF = p.y.toFixed(3);
                            var graphic2 = new Graphic(pol, sym);
                            map.graphics.add(graphic2);
                            var extent = pol.getExtent().expand(2);
                            map.setExtent(extent);
                            q_parcellaire = new QueryTask("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/MapServer/0");
                            q_p = new Query();
                            q_p.outFields = ["*"];
                            q_p.returnGeometry = true;
                            q_p.where = "typefoncier = '" + typeFonc + "' AND x  = '" + xCenteroid + "' AND y  ='" + yCenteroid + "'";
                            q_parcellaire.execute(q_p, result);
                            function result(featureSet) {
                                var features_parcellaire = featureSet.features;
                                if (features_parcellaire.length != 0) {
                                    var graphic2 = new Graphic(features_parcellaire[0].geometry, sym);
                                    map.graphics.add(graphic2);
                                    var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                                    map.setExtent(extent);
                                    document.getElementById('alimBD').style.display = 'none';
                                    document.getElementById('idparcellaire').value = features_parcellaire[0].attributes['OBJECTID'];
                                    featureLeyr_Comm = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/MapServer/0");
                                    q_Comm = new Query();
                                    q_Comm.outFields = ["*"];
                                    q_Comm.returnGeometry = true;
                                    q_Comm.geometry = features_parcellaire[0].geometry;
                                    featureLeyr_Comm.queryFeatures(q_Comm, function (featureSet) {
                                        featuresComm = featureSet.features;
                                        document.getElementById('idprov').value = featuresComm[0].attributes['id_prov'];
                                        document.getElementById('idcommune').value = featuresComm[0].attributes['id_commune'];
                                    });
                                    featureLeyr_PA = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/MapServer/0");
                                    q_PA = new Query();
                                    q_PA.outFields = ["*"];
                                    q_PA.returnGeometry = true;
                                    q_PA.geometry = features_parcellaire[0].geometry;
                                    featureLeyr_PA.queryFeatures(q_PA, function (featureSet) {
                                        featuresPA = featureSet.features;
                                        document.getElementById('idPa').value = featuresPA[0].attributes['objectid'];
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
                        q_parcellaire = new QueryTask("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/MapServer/0");
                        q_p = new Query();
                        q_p.outFields = ["*"];
                        q_p.returnGeometry = true;

                        q_p.where = "typefoncier = '" + typeFonc + "' AND numfoncier = '" + numFonc + "' AND indice = '" + indice + "' AND fraction ='" + fraction + "' AND complement='" + complement + "'";
                        q_parcellaire.execute(q_p, result);
                        function result(featureSet) {
                            var features_parcellaire = featureSet.features;

                            if (features_parcellaire.length != 0) {
                                var graphic2 = new Graphic(features_parcellaire[0].geometry, sym);
                                map.graphics.add(graphic2);
                                var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                                map.setExtent(extent);
                                document.getElementById('idparcellaire').value = features_parcellaire[0].attributes['OBJECTID'];
                                featureLeyr_Comm = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/ZONE_AURS/MapServer/0");
                                q_Comm = new Query();
                                q_Comm.outFields = ["*"];
                                q_Comm.returnGeometry = true;
                                q_Comm.geometry = features_parcellaire[0].geometry;
                                featureLeyr_Comm.queryFeatures(q_Comm, function (featureSet) {
                                    featuresComm = featureSet.features;
                                    document.getElementById('idprov').value = featuresComm[0].attributes['prefecture'];
                                    document.getElementById('idcommune').value = featuresComm[0].attributes['objectid'];
                                });
                                featureLeyr_PA = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/ZONE_AURS/MapServer/0");
                                q_PA = new Query();
                                q_PA.outFields = ["*"];
                                q_PA.returnGeometry = true;
                                q_PA.geometry = features_parcellaire[0].geometry;
                                featureLeyr_PA.queryFeatures(q_PA, function (featureSet) {
                                    featuresPA = featureSet.features;
                                    document.getElementById('idPa').value = featuresPA[0].attributes['objectid'];
                                });
                            } else {
                                document.getElementById('alimBD').style.display = 'inline';
                                document.getElementById('coordInputs').style.display = 'block';
                                document.getElementById('error').style.display = 'block';
                            }
                        }
                    } else {
                        document.getElementById('error').style.display = 'block';
                        document.getElementById('error').innerHTML = "Merci de remplire tous les champs nécessaires";
                    }
                }
            }
        }

        //document.getElementById('localiser').onclick = Localiser();
        //var extend = new Extent({ xmin: -793686.5760865562, ymin: 3673182.038422566, xmax: -689043.2877939753, ymax: 4052694.022156317, spatialReference: { wkid: 3857 } })
        //document.getElementById('btnPetitionnaire').onclick = function () {        
        //    var btnValue = document.getElementById('btnPetitionnaire').value;
        //    if (btnValue == 1) {
        //        document.getElementById('divPetitionnaire').style.display = "none";
        //        document.getElementById('btnPetitionnaire').value = 0;
        //        document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/plusicon.png');
        //        document.getElementById('inputPetFr').value = "";
        //        document.getElementById('inputPetAr').value = "";
        //        document.getElementById('inputCIN').value = "";
        //        document.getElementById('inputMail').value = "";
        //        document.getElementById('inputTel').value = "";
        //    }else if (btnValue == 0) {
        //        document.getElementById('divPetitionnaire').style.display = "block";
        //        document.getElementById('btnPetitionnaire').value = 1;
        //        document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/minusicon.png');
        //        document.getElementById("petFrance").selectedIndex = "0";
        //        document.getElementById("petArabe").selectedIndex = "0";
        //    }
        //}

    });