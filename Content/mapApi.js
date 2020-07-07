require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "dojo/on",
    "esri/arcgis/utils",
    'esri/tasks/query',
    'esri/tasks/QueryTask',
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
    "esri/symbols/SimpleFillSymbol", "esri/symbols/PictureFillSymbol",
    "esri/symbols/CartographicLineSymbol",
    "dojo/parser", "dijit/registry",
    "esri/geometry/Polygon",
    "esri/geometry/Point", "esri/geometry/webMercatorUtils",
    "esri/dijit/HomeButton",
    "esri/geometry/geometryEngine",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/WidgetSet", "dojo/dom",
    "dojo/domReady!"
],
    function (
        Map, FeatureLayer, on, arcgisUtils, Query, QueryTask, GraphicsLayer, GeometryService, Extent, SpatialReference, LayerList,
        Legend, BasemapGallery, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, Color,
        Draw, SimpleFillSymbol, PictureFillSymbol, CartographicLineSymbol, parser, registry, Polygon, Point, webMercatorUtils, HomeButton, geometryEngine, dom
    ) {
        var tb;
        var map = new Map("map", {
            basemap: "hybrid",
            center: [-6.677, 33.968],
            zoom: 11
        });

        var wkid = new SpatialReference(26191);//Merchich - Nord Maroc
        //WGS84 Bounds: -9.7500, 31.5000, -1.0100, 35.9500
        //Projected Bounds: 86661.6116, 109335.0949, 916839.6617, 602597.8926
        //Scope: Large and medium scale topographic mapping and engineering survey.
        //Last Revised: Sept. 19, 2002
        //Area: Morocco - north of 31.5°N
        var wkid1 = new SpatialReference(3857);//WGS84 Web Mercator (Auxiliary Sphere): SR ... x y
        var wkid2 = new SpatialReference(102100);//SR-ORG Projection -- Spatial Reference lat lon
        gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

        map.on("load", initToolbar);
        map.on("load", function () {
            map.on("mouse-move", showCoordinates);
            map.on("mouse-drag", showCoordinates);
        });
        var coordsWidget = document.getElementById("coordsWidget");
        var spanCoords = document.getElementById("infospan");

        function showCoordinates(evt) {
            //evt : 102100,     mp : 4326
            //var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
            //gsvc.project([evt.mapPoint], wkid, function (projectPoint) {
            //    spanCoords.innerHTML = projectPoint[0].x.toFixed(2) + ", " + projectPoint[0].y.toFixed(2);
            //})
            //console.log(evt);
            //var coordsText = mp.x/*.toFixed(2)*/ + ", " + mp.y/*.toFixed(2)*/;
            var coords = evt.mapPoint.x.toFixed(3) + " , " + evt.mapPoint.y.toFixed(3);
            coordsWidget.innerHTML = coords;
            //spanCoords.innerHTML = coordsText;
            //console.log(coordsText + " . " + mp.SpatialReference + " " + coords + " . "+evt.SpatialReference);
        }



        //var layerAURS = new FeatureLayer({
        //    url: "https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/FeatureServer", layerId: 0
        //});



        var markerSymbol = new SimpleMarkerSymbol();
        markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,"
            + "5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,"
            + "14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,"
            + "18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
        markerSymbol.setColor(new Color("#00FFFF"));
        var symPoint = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1)
            , new Color([0, 255, 0, 0.25]));
        var lineSymbol = new CartographicLineSymbol(
            CartographicLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0]), 1,
            CartographicLineSymbol.CAP_ROUND,
            CartographicLineSymbol.JOIN_MITER, 5
        );

        var fillSymbol = new PictureFillSymbol(
            "../Content/documentation/img/valid.png",
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color('#0f0'),
                1
            ), 10, 20
        );

        function initToolbar() {
            tb = new Draw(map);
            tb.on("draw-end", addGraphic);
            on(dojo.byId("info"), "click", function (evt) {
                if (evt.target.id === "info") {
                    return;
                }
                var tool = evt.target.id.toLowerCase();
                map.disableMapNavigation();
                tb.activate(tool);
            });
        }

        function addGraphic(evt) {
            tb.deactivate();
            map.enableMapNavigation();
            var symbol;
            if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
                symbol = markerSymbol;
            } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
                symbol = lineSymbol;
            }
            else {
                symbol = fillSymbol;
            }
            //map.graphics.clear();
            //var temp1 = evt.geometry.rings[0];
            //var arrayx = []; var arrayy = [];
            //for (ik = 0; ik < temp1.length; ik++) { arrayx.push(temp1[ik][0]) };
            //for (ik = 0; ik < temp1.length; ik++) { arrayy.push(temp1[ik][1]) };var pointsCoordinates = [];
            //console.log(evt.geometry);
            //for (i = 0; i < evt.geometry.rings[0].length; i++) {
            //    pt = new Point(evt.geometry.rings[0][i][0], evt.geometry.rings[0][i][1], wkid1);
            //    pointsCoordinates.push(pt);
            //}
            //projecteur(pointsCoordinates);


            map.graphics.add(new Graphic(evt.geometry, symbol));
        }

        function projecteur(points) {
            gsvc.project(points, wkid, function (projectPoints) {
                console.log(projectPoints);
            })
        }

        var array = []; var PointsWKID = []; var PointsWKID1 = [];

        var ringsParcels = []; var ringsPointsWKID = []; var ringsPointsWKID1 = [];

        arcgisUtils.arcgisUrl = "https://si.aurs.org.ma/portal/sharing/content/items";

        var json = [
            [
                {
                    "x": 363564.2608327697,
                    "y": 373878.50794192,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 363606.0970894097,
                    "y": 373927.2629257601,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 363691.8605103388,
                    "y": 373856.9667622168,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 363643.601771194,
                    "y": 373809.7821770096,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 363564.2608327697,
                    "y": 373878.50794192,
                    "spatialReference": {
                        "wkid": 26191
                    }
                }
            ],
            [
                {
                    "x": 364926.5352684335,
                    "y": 373680.2215259044,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365053.06995971204,
                    "y": 373794.91037553607,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365157.23950326914,
                    "y": 373728.3170764742,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365082.04761496035,
                    "y": 373598.1041302808,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365029.8932273509,
                    "y": 373626.4677649411,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 364984.54042947164,
                    "y": 373644.8670194514,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 364921.41295317374,
                    "y": 373668.44987959636,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 364926.5352684335,
                    "y": 373680.2215259044,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 364926.5352684335,
                    "y": 373680.2215259044,
                    "spatialReference": {
                        "wkid": 26191
                    }
                }
            ],
            [
                {
                    "x": 365264.40912420175,
                    "y": 379401.15782520804,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365363.23542559345,
                    "y": 379524.05897428264,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365386.9302548074,
                    "y": 379517.81023428706,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365523.04654639185,
                    "y": 379401.4947360698,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365521.9320951655,
                    "y": 379392.6330148095,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365406.51139649976,
                    "y": 379287.71481748094,
                    "spatialReference": {
                        "wkid": 26191
                    }
                },
                {
                    "x": 365264.40912420175,
                    "y": 379401.15782520804,
                    "spatialReference": {
                        "wkid": 26191
                    }
                }
            ]
        ]



        var elementtt = 0;


        var x = document.getElementById('xx');
        var y = document.getElementById('yy');

        x.value = json[0][elementtt].x.toFixed(2);
        y.value = json[0][elementtt].y.toFixed(2);

        var typeFon = document.getElementById('selRef');
        var numFon = document.getElementById('numfonc');
        var indic = document.getElementById('indice');
        var fractio = document.getElementById('fraction');
        var complemen = document.getElementById("complement");
        var table = document.getElementById('tbodyCoord');
        numFon.value = 'Bi';
        indic.value = 'Bi';
        fractio.value = 'Bi';
        complemen.value = 'Bi';

        function CarteSetExtent() {
            try {
                if (array.length == 1 && array.length != 0) {
                    map.centerAt(PointsWKID1[0]);
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

                }
            }
            catch (error) {
                console.log(error);
            }

        }

        function UpdateGraphicPoints() {
            map.graphics.clear();
            array.forEach(myFunction);

            function myFunction(item, index) {
                p = new Point(item[0], item[1], wkid1);
                var graphic2 = new Graphic(p, markerSymbol);
                map.graphics.add(graphic2);
            }
        }

        function RecuperePolygons() {
            map.graphics.clear();
            ringsParcels.forEach(myFunction);

            function myFunction(item, index) {
                var polygonJson = {
                    "rings": item, "spatialReference": { "wkid": 102100, "latestWkid": 3857 }
                };
                var polygon = new Polygon(polygonJson);
                console.log(polygon.rings)
                map.graphics.add(new Graphic(polygon, fillSymbol));
            }
        }

        

        document.getElementById('addCoord').onclick = function () {

            pp = new Point(x.value.replace(",", "."), y.value.replace(",", "."), wkid);
            PointsWKID.push(pp);

            gsvc.project([pp], wkid1, function (projectPoint) {

                var p = projectPoint[0];

                var graphic2 = new Graphic(p, markerSymbol);
                map.graphics.add(graphic2);

                var thispoint = [p.x, p.y];
                array.push(thispoint);
                PointsWKID1.push(p);

                CarteSetExtent();


            });


            var row = table.insertRow(table.length);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
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
                cell2.innerHTML = "<input type='text' class='form-control' id='new_lon' value='"
                    + table.rows[id - 1].cells[1].innerHTML + "'/>";
                cell3.innerHTML = "<input type='text' class='form-control' id='new_lat' value='"
                    + table.rows[id - 1].cells[2].innerHTML + "'/>";


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
                    PointsWKID[id - 1] = pt2;
                    gsvc.project([pt2], wkid1, function (projectPoint) {
                        var p2 = projectPoint[0];
                        array[id - 1] = [p2.x, p2.y];
                        PointsWKID1[id - 1] = p2;
                    });
                    cell4.removeChild(valider); cell5.removeChild(btn1);
                    cell4.appendChild(btn);
                    CarteSetExtent(); UpdateGraphicPoints();
                }
                var btn1 = document.createElement('input');
                btn1.setAttribute("src", "../Content/documentation/img/del.png");
                btn1.setAttribute("type", "image");
                btn1.setAttribute("id", id);
                btn1.setAttribute("name", "delete");
                btn1.onclick = function () {
                    table.deleteRow(id - 1);
                    array.splice(id - 1, 1);
                    PointsWKID.splice(id - 1, 1);
                    PointsWKID1.splice(id - 1, 1);
                    CarteSetExtent(); UpdateGraphicPoints();
                    //if (table.rows.length > btn1.getAttribute('id')) {}
                    var x1 = parseInt(id) - 1;
                    for (var i = x1; i < table.rows.length + 1; i++) {
                        var j = document.getElementsByName("update")[i].getAttribute('id');
                        var k = i + 1;
                        table.rows[i].cells[0].innerHTML = "P" + k;
                        document.getElementsByName("update")[i].setAttribute('id', j - 1);
                    }
                }
                cell4.removeChild(btn);
                cell4.appendChild(valider);
                cell5.appendChild(btn1);
            }
            cell4.appendChild(btn);
            elementtt += 1;
            x.value = json[0][elementtt].x.toFixed(2);
            y.value = json[0][elementtt].y.toFixed(2);
            x.style.boxShadow = "";
            y.style.boxShadow = "";

        }

        document.getElementById('alimBD').onclick = function () {
            //le tableau des coordonnes n\'est pas vide, les enregistrements seront perdus, voulez vous confirmer ??
            

            if (array.length < 4) {
                alert('4 points au mois pour dessiner un parcelle');
            }
            else {
                ringsParcels.push([array]); ringsPointsWKID1.push(PointsWKID1);
                array = []; PointsWKID1 = [];
                $("#tbodyCoord tr").remove();
                RecuperePolygons();
                var polygonJson = {
                    "rings": [array], "spatialReference": { "wkid": 102100, "latestWkid": 3857 }
                };
                var polygon = new Polygon(polygonJson);
                console.log(polygon.rings)
                map.graphics.add(new Graphic(polygon, fillSymbol));
            }
            

            if (false) {
                //var typeFonc = typeFon.value;
            //var numFonc = numFon.value;
            //var indice = indic.value;
            //var fraction = fractio.value;
            //var complement = complemen.value;

            //var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            //        new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            //);

            //if (typeFonc.trim().toUpperCase() == 'TNI') {
            //    var pol = new Polygon(array);

            //    var wkid = new SpatialReference(26191);
            //    var wkid1 = new SpatialReference(3857);
            //    pt = new Point(pol.getCentroid().x, pol.getCentroid().y, wkid);

            //    console.log('Centroid : ' + [pol.getCentroid().x, pol.getCentroid().y]);

            //    //var p = projectPoint[0];
            //    var f = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/FeatureServer/0");
            //    var xCenteroid = pt.x.toFixed(3).replace(".", ",");
            //    var yCenteroid = pt.y.toFixed(3).replace(".", ",");
            //    attr = { "typefoncier": typeFonc, "x": xCenteroid, "y": yCenteroid };
            //    var graphic = new Graphic(pol, sym, attr);
            //    f.applyEdits([graphic], null, null, function () {
            //        Localiser();
            //    });

            //    //gsvc.project([pt], wkid1, function (projectPoint) {


            //    //});
            //}
            //else {
            //    var temp1 = array;
            //    var arrayx = []; var arrayy = [];
            //    for (ik = 0; ik < temp1.length; ik++) { arrayx.push(temp1[ik][0]) };
            //    for (ik = 0; ik < temp1.length; ik++) { arrayy.push(temp1[ik][1]) };
            //    var polygon = {
            //        rings: [array], _ring: 0, spatialReference: { wkid: 3857/*, latestWkid: 26191*/ },
            //        cache: {
            //            _extent: { xmin: Math.min(...arrayx), ymin: Math.min(...arrayy), xmax: Math.max(...arrayx), ymax: Math.max(...arrayy) },
            //            _partwise: null
            //        }
            //    };
            //    console.log(polygon);
            //    var arrayx = []; var arrayy = [];
            //    for (ik = 0; ik < temp1.length; ik++) { arrayx.push(temp1[ik][0]) };
            //    for (ik = 0; ik < temp1.length; ik++) { arrayy.push(temp1[ik][1]) };
            //    var simpleFillSymbol = new PictureFillSymbol(
            //        "../Content/documentation/img/del.png",
            //        new SimpleLineSymbol(
            //            SimpleLineSymbol.STYLE_SOLID,
            //            new Color('#000'),
            //            3
            //        ), 12, 12
            //    );
            //    //var polygonGraphic = new Graphic({
            //    //    geometry: polygon,
            //    //    symbol: simpleFillSymbol
            //    //});
            //    map.graphics.add(new Graphic(polygon, simpleFillSymbol));
            //    //map.graphics.add(polygonGraphic);
            //    //map.graphics.clear();
            //    //array = [];
            //    //array.push([-746530.0130604643, 4017850.880879946]);
            //    //array.push([-746503.3819100509, 4017862.1044801027]);
            //    //array.push([-746439.371403158, 4017961.4527203813]);

            //    //var polygonJson = { "rings": [array], "spatialReference": { "wkid": 3857 } };
            //    //var polygon = new Polygon(polygonJson);
            //    //map.addLayer(polygon);


            //    //var pol = new Polygon(array);
            //    //var sr = new SpatialReference(3857);
            //    //pol.setSpatialReference(sr);
            //    //array = [];
            //    //console.log(pol);

            //    //type: "polygon",

            //    //var polygon = new Polygon(new SpatialReference(3857));
            //    //polygon.addRing(array);

            //    //console.log(map);
            //    //var simpleFillSymbol = {
            //    //    type: "simple-fill",
            //    //    color: [227, 139, 79, 0.18],  // orange, opacity 80%
            //    //    outline: {
            //    //        color: [255, 255, 255],
            //    //        width: 1
            //    //    }
            //    //};

            //    //var f = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/PARCELLAIRE/FeatureServer/0", { outFields: ["*"] });
            //    //attr = { "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice, "fraction": fraction, "complement": complement };


            //    //attr = { "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice, "fraction": fraction };
            //    //  attr = { "OBJECTID": 10054, "typefoncier": typeFonc, "numfoncier": numFonc, "indice": indice, "fraction": fraction, "complement": complement };
            //    // var graphic = new Graphic([pol], null, null);

            //    //var feature = [];      
            //    //var attr = {};
            //    //attr["typefoncier"] = typeFonc;  
            //    //var graphic = new Graphic([pol]);
            //    //graphic.setAttributes(attr);
            //    //feature.push(graphic);

            //    //console.log(feature);

            //    //var sr = new SpatialReference(102100);

            //    //var graphic = new Graphic([pol], null, null);
            //    //map.graphics.add(graphic);

            //    //f.applyEdits([graphic], null, null, function (res) {
            //    //    console.log('resultat : ' + res);
            //    //    Localiser();
            //    //    alert('C est Bon');
            //    //}, function (err) {
            //    //    console.log('Error occured: ', err);
            //    //    alert('Error');
            //    //});

            //    //$("#tbodyCoord tr").remove();
            //    //$('#alimBD').hide();
            //}
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
            //document.getElementById('error').style.display = 'none'
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


    });