require([
    "esri/map",
    "esri/dijit/BasemapGallery",
    "esri/dijit/BasemapLayer",
    "esri/dijit/Basemap",
    "esri/dijit/BasemapToggle",
    "esri/layers/FeatureLayer",
    "esri/dijit/LayerList",
    "dojo/promise/all",
    "esri/dijit/Legend",
    "dojo/on",
    "esri/arcgis/utils",
    "esri/dijit/BasemapGallery",
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
        all,
        Legend,
        on,
        arcgisUtils,
        BasemapGallery,
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
        var geometrymaj;
        var GeometryProjet;




        window.fn1 = function fn1(ObjectId) {
            var Parcelle = new FeatureLayer("https://si.aurs.org.ma/server/rest/services/MODAURSF/MapServer/0", {
                outFields: ["*"]
            });


            var selectQueryParcelle = new Query();
            selectQueryParcelle.outSpatialReference = mapp1.spatialReference;
            selectQueryParcelle.where = 'objectid =' + ObjectId;


            Parcelle.selectFeatures(selectQueryParcelle, FeatureLayer.SELECTION_NEW, function (resultFeaturesa) {



                var extent = resultFeaturesa[0].geometry.getExtent().expand(5);
                mapp1.setExtent(extent);



            });

        };


        arcgisUtils.arcgisUrl = "http://srvsiidev.aurs.local/portal/sharing/content/items";
        arcgisUtils.createMap("464e3d0db8954e209dfe0dc6195330dc", "map").then(function (response) {
            mapp1 = response.map;
            console.log(mapp1);
            var myWidget = new LayerList({
                map: response.map,
                layers: arcgisUtils.getLayerList(response)
            }, "layerList");
            myWidget.startup();



            if (mapp1.loaded) {
                onMapLoad();
            } else {
                mapp1.on("load", onMapLoad);
            }

            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,
                map: mapp1
            }, "basemapGallery");
            basemapGallery.startup();

            var Parcelle = new FeatureLayer("http://si.aurs.org.ma/server/rest/services/Communes/MapServer/0", {
                outFields: ["*"]
            });


            var selectQueryParcelle = new Query();
            selectQueryParcelle.outSpatialReference = mapp1.spatialReference;
            selectQueryParcelle.where = "code_commu  ='" + document.getElementById("CodeCommuneZoom").value +"'";
         


            Parcelle.selectFeatures(selectQueryParcelle, FeatureLayer.SELECTION_NEW, function (resultFeaturesa) {



                var extent = resultFeaturesa[0].geometry.getExtent().expand(0.1);
                mapp1.setExtent(extent);



            });

        });






        function onMapLoad() {

            //////////////////////////
            var featureLayer = new FeatureLayer("http://srvsiidev.aurs.local/server/rest/services/Projets/FeatureServer/0", { outFields: ["*"]});

            mapp1.addLayer(featureLayer);

            featureLayer.on('click', function (e) {
                //console.log(e);

                if (TitreOuProjet == 2) {
                    $('#xtxtProjet').val("");
                    $('#ytxtProjet').val("");
                    array = [];
                    $("#tbodyInfProj").empty();
                    var pointsGraphic = e.graphic.geometry.rings[0];
                    union = null;
                    console.log(union);
                    console.log(1);
                    union = e.graphic.geometry;
                    

                    var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color([255, 0, 0]), 2), new Color([255, 100, 0, 0.25]));

                    var graphic22 = new Graphic(e.graphic.geometry, sfs);
                    GeometryProjet = e.graphic.geometry;
                   


                    mapp1.graphics.clear();
                    mapp1.graphics.add(graphic22);
                    
                    var table2 = document.getElementById('tbodyInfProj');
                    var row = table2.insertRow(table2.length);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    cell1.innerHTML = "Adresse";
                    cell2.innerHTML = e.graphic.attributes["adresse"];


                    var row2 = table2.insertRow(table2.length);
                    var cell3 = row2.insertCell(0);
                    cell3.innerHTML = "Consistance";
                    var cell4 = row2.insertCell(1);                   
                    cell4.innerHTML = e.graphic.attributes["consistance"];
                    

                    $('#CodeProjetInput').val(e.graphic.attributes["objectid"]);

                    //////////////////////////////////////////////////////////////////////////////////////////console.log(e.graphic.geometry);
                    //////////////////////////////////////////////////////////////////////////////////////////for (var i = 0; i < pointsGraphic.length - 1; i++) {
                    //////////////////////////////////////////////////////////////////////////////////////////    var x = pointsGraphic[i][0];
                    //////////////////////////////////////////////////////////////////////////////////////////    var y = pointsGraphic[i][1];

                    //////////////////////////////////////////////////////////////////////////////////////////    array.push([x, y]);

                    //////////////////////////////////////////////////////////////////////////////////////////    var wkid = new SpatialReference(102100);
                    //////////////////////////////////////////////////////////////////////////////////////////    pt = new Point(x, y, wkid);
                    //////////////////////////////////////////////////////////////////////////////////////////    var wkid1 = new SpatialReference(26191);
                    //////////////////////////////////////////////////////////////////////////////////////////    gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                    //////////////////////////////////////////////////////////////////////////////////////////    gsvc.project([pt], wkid1, function (projectPoint) {

                    //////////////////////////////////////////////////////////////////////////////////////////        var p = projectPoint[0];
                    //////////////////////////////////////////////////////////////////////////////////////////        //console.log(p);
                    //////////////////////////////////////////////////////////////////////////////////////////        // array.push([p.x, p.y]);
                    //////////////////////////////////////////////////////////////////////////////////////////        var table = document.getElementById('tbodyCoordProjet');
                    //////////////////////////////////////////////////////////////////////////////////////////        var row = table.insertRow(table.length);
                    //////////////////////////////////////////////////////////////////////////////////////////        var cell1 = row.insertCell(0);
                    //////////////////////////////////////////////////////////////////////////////////////////        var cell2 = row.insertCell(1);
                    //////////////////////////////////////////////////////////////////////////////////////////        var cell3 = row.insertCell(2);
                    //////////////////////////////////////////////////////////////////////////////////////////        var cell4 = row.insertCell(3);
                    //////////////////////////////////////////////////////////////////////////////////////////        cell1.innerHTML = "B" + table.rows.length;
                    //////////////////////////////////////////////////////////////////////////////////////////        cell2.innerHTML = p.x.toFixed(3);
                    //////////////////////////////////////////////////////////////////////////////////////////        cell3.innerHTML = p.y.toFixed(3);
                    //////////////////////////////////////////////////////////////////////////////////////////        var btn = document.createElement("input");
                    //////////////////////////////////////////////////////////////////////////////////////////        btn.setAttribute("id", table.rows.length);
                    //////////////////////////////////////////////////////////////////////////////////////////        btn.setAttribute("src", "../Content/documentation/img/modif.png");
                    //////////////////////////////////////////////////////////////////////////////////////////        btn.setAttribute("type", "image");
                    //////////////////////////////////////////////////////////////////////////////////////////        btn.setAttribute("name", "update");
                    //////////////////////////////////////////////////////////////////////////////////////////        btn.onclick = function () {
                    //////////////////////////////////////////////////////////////////////////////////////////            var id = this.id;
                    //////////////////////////////////////////////////////////////////////////////////////////            cell2.innerHTML = "<input type='text' class='form-control' id='new_lon' value='" + table.rows[id - 1].cells[1].innerHTML + "'/>";
                    //////////////////////////////////////////////////////////////////////////////////////////            cell3.innerHTML = "<input type='text' class='form-control' id='new_lat' value='" + table.rows[id - 1].cells[2].innerHTML + "'/>";


                    //////////////////////////////////////////////////////////////////////////////////////////            var valider = document.createElement('input');
                    //////////////////////////////////////////////////////////////////////////////////////////            valider.setAttribute('src', "../Content/documentation/img/valid.png");
                    //////////////////////////////////////////////////////////////////////////////////////////            valider.setAttribute('id', table.rows.length);
                    //////////////////////////////////////////////////////////////////////////////////////////            valider.setAttribute('type', "image");
                    //////////////////////////////////////////////////////////////////////////////////////////            valider.onclick = function () {
                    //////////////////////////////////////////////////////////////////////////////////////////                var a = document.getElementById('new_lon').value.replace(",", ".");
                    //////////////////////////////////////////////////////////////////////////////////////////                var b = document.getElementById('new_lat').value.replace(",", ".");
                    //////////////////////////////////////////////////////////////////////////////////////////                cell2.innerHTML = document.getElementById('new_lon').value.replace(",", ".");
                    //////////////////////////////////////////////////////////////////////////////////////////                cell3.innerHTML = document.getElementById('new_lat').value.replace(",", ".");
                    //////////////////////////////////////////////////////////////////////////////////////////                var pt2 = new Point(a, b, wkid);
                    //////////////////////////////////////////////////////////////////////////////////////////                gsvc.project([pt2], wkid1, function (projectPoint) {
                    //////////////////////////////////////////////////////////////////////////////////////////                    var p2 = projectPoint[0];
                    //////////////////////////////////////////////////////////////////////////////////////////                    array[id - 1] = [p2.x, p2.y];
                    //////////////////////////////////////////////////////////////////////////////////////////                });
                    //////////////////////////////////////////////////////////////////////////////////////////                cell4.removeChild(valider); cell4.removeChild(btn1);
                    //////////////////////////////////////////////////////////////////////////////////////////                cell4.appendChild(btn);
                    //////////////////////////////////////////////////////////////////////////////////////////            }


                    //////////////////////////////////////////////////////////////////////////////////////////            var btn1 = document.createElement('input');
                    //////////////////////////////////////////////////////////////////////////////////////////            btn1.setAttribute("src", "../Content/documentation/img/del.png");
                    //////////////////////////////////////////////////////////////////////////////////////////            btn1.setAttribute("type", "image");
                    //////////////////////////////////////////////////////////////////////////////////////////            btn1.setAttribute("id", id);
                    //////////////////////////////////////////////////////////////////////////////////////////            btn1.setAttribute("name", "delete");
                    //////////////////////////////////////////////////////////////////////////////////////////            btn1.onclick = function () {
                    //////////////////////////////////////////////////////////////////////////////////////////                if (table.rows.length > btn1.getAttribute('id')) {
                    //////////////////////////////////////////////////////////////////////////////////////////                    table.deleteRow(id - 1);
                    //////////////////////////////////////////////////////////////////////////////////////////                    array.splice(id - 1, 1);
                    //////////////////////////////////////////////////////////////////////////////////////////                    var x1 = parseInt(id) - 1;
                    //////////////////////////////////////////////////////////////////////////////////////////                    for (var i = x1; i < table.rows.length + 1; i++) {
                    //////////////////////////////////////////////////////////////////////////////////////////                        var j = document.getElementsByName("update")[i].getAttribute('id');
                    //////////////////////////////////////////////////////////////////////////////////////////                        var k = i + 1;
                    //////////////////////////////////////////////////////////////////////////////////////////                        table.rows[i].cells[0].innerHTML = "B" + k;
                    //////////////////////////////////////////////////////////////////////////////////////////                        document.getElementsByName("update")[i].setAttribute('id', j - 1);
                    //////////////////////////////////////////////////////////////////////////////////////////                    }
                    //////////////////////////////////////////////////////////////////////////////////////////                }
                    //////////////////////////////////////////////////////////////////////////////////////////                if (table.rows.length <= btn1.getAttribute('id') && table.rows.length > 1) { table.deleteRow(id - 1); array.splice(id - 1, 1); }
                    //////////////////////////////////////////////////////////////////////////////////////////                if (table.rows.length <= btn1.getAttribute('id') && table.rows.length == 1) {
                    //////////////////////////////////////////////////////////////////////////////////////////                    table.deleteRow(id - 1); array.splice(id - 1, 1);
                    //////////////////////////////////////////////////////////////////////////////////////////                    document.getElementById('vider').disabled = true;
                    //////////////////////////////////////////////////////////////////////////////////////////                }
                    //////////////////////////////////////////////////////////////////////////////////////////            }
                    //////////////////////////////////////////////////////////////////////////////////////////            cell4.removeChild(btn);
                    //////////////////////////////////////////////////////////////////////////////////////////            cell4.appendChild(valider);
                    //////////////////////////////////////////////////////////////////////////////////////////            cell4.appendChild(btn1);
                    //////////////////////////////////////////////////////////////////////////////////////////        }
                    //////////////////////////////////////////////////////////////////////////////////////////        cell4.appendChild(btn);

                    //////////////////////////////////////////////////////////////////////////////////////////    });

                    //////////////////////////////////////////////////////////////////////////////////////////    //console.log(pointsGraphic);

                    //////////////////////////////////////////////////////////////////////////////////////////}


              }

            });


            ///////////////////

            // when function called, do whatever you need to do to your map
            var featureLayer = new FeatureLayer("http://si.aurs.org.ma/server/rest/services/MODAURSF/MapServer/0");

            mapp1.addLayer(featureLayer);

            featureLayer.on('click', function (e) {
                //console.log(e);
                if (TitreOuProjet == 1) {

                    array = [];
                    $("#tbodyCoord").empty();
                    var pointsGraphic = e.graphic.geometry.rings[0];
                    console.log(e.graphic.geometry);
                    for (var i = 0; i < pointsGraphic.length - 1; i++) {
                        var x = pointsGraphic[i][0];
                        var y = pointsGraphic[i][1];

                        array.push([x, y]);

                        var wkid = new SpatialReference(102100);
                        pt = new Point(x, y, wkid);
                        var wkid1 = new SpatialReference(26191);
                        gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                        gsvc.project([pt], wkid1, function (projectPoint) {

                            var p = projectPoint[0];
                            //console.log(p);
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

                        //console.log(pointsGraphic);

                    }


                }

            });







        }

        // do other stuff...




        gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        document.getElementById('addCoord').onclick = function () {

            var xtxt = $('#xtxt').val();
            var ytxt = $('#ytxt').val();

            var wkid = new SpatialReference(26191);
            var wkid1 = new SpatialReference(4326);
            pt = new Point(xtxt.replace(",", "."), ytxt.replace(",", "."), wkid);

            gsvc.project([pt], wkid1, function (projectPoint) {
                var p = projectPoint[0];


                var table = document.getElementById('tbodyCoord');

                var row = table.insertRow(table.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);



                cell2.innerHTML = xtxt;
                cell3.innerHTML = ytxt;

                var btn = document.createElement("input");
                btn.setAttribute("id", xtxt);
                btn.setAttribute("src", "../Content/documentation/img/del.png");
                btn.setAttribute("type", "image");
                btn.setAttribute("name", "delete");
                btn.onclick = function () {
                    $(this).closest('tr').remove();
                }
                cell4.appendChild(btn);
                console.log(table);

                var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 1),
                    new Color([0, 255, 0, 0.25]));



                var pt = new Point(p.x, p.y, mapp1.SpatialReference);

                var graphic2 = new Graphic(pt, sym);
                mapp1.graphics.add(graphic2);
                // var extent = pt.getExtent().expand(2);
                mapp1.centerAndZoom(pt, 20);

                if (table.rows.length < 3) {
                    document.getElementById('CreerTitre').style.display = "none";
                  
                } else {
                    document.getElementById('CreerTitre').style.display = "block";
                }

            });







        }
        document.getElementById('addCoordProjet').onclick = function () {


            var xtxt = $('#xtxtProjet').val();
            var ytxt = $('#ytxtProjet').val();

            var wkid = new SpatialReference(26191);
            var wkid1 = new SpatialReference(4326);
            pt = new Point(xtxt.replace(",", "."), ytxt.replace(",", "."), wkid);

            gsvc.project([pt], wkid1, function (projectPoint) {
                alert('ffffff');
                var p = projectPoint[0];


                var table = document.getElementById('tbodyCoordProjet');

                var row = table.insertRow(table.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell5 = row.insertCell(2);



                cell1.innerHTML = xtxt;
                cell2.innerHTML = ytxt;

                var btn = document.createElement("input");
                btn.setAttribute("id", xtxt);
                btn.setAttribute("src", "../Content/documentation/img/del.png");
                btn.setAttribute("type", "image");
                btn.setAttribute("name", "delete");
                btn.onclick = function () {
                    $(this).closest('tr').remove();

                    if (table.rows.length < 3) {
                        document.getElementById('CreerTitre').style.display = "none";
                    } else {
                        document.getElementById('CreerTitre').style.display = "block";
                    }
                }
                cell5.appendChild(btn);
                console.log(table);

                var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 1),
                    new Color([0, 255, 0, 0.25]));



                var pt = new Point(p.x, p.y, mapp1.SpatialReference);

                var graphic2 = new Graphic(pt, sym);
                mapp1.graphics.add(graphic2);
                // var extent = pt.getExtent().expand(2);
                mapp1.centerAndZoom(pt, 20);

                if (table.rows.length < 3) {
                    document.getElementById('CreerTitre').style.display = "none";
                } else {
                    document.getElementById('CreerTitre').style.display = "block";
                }

            });







        }
        var pol;
        var TitreOuProjet;
        //1 ==> Titre
        //2 ==> Projet
        //document.getElementById('SaisiCordTitre').onclick = function () {
        //    TitreOuProjet = 1;
        //    $("#tbodyCoord").empty();

        //}
        document.getElementById('SaisiCordProjet').onclick = function () {
            mapp1.graphics.clear();
            TitreOuProjet = 2
            $('#CodeProjetInput').val("");
            $("#tbodyCoordProjet").empty();
            $("#tbodyInfProj").empty();
            document.getElementById('DivInfo').style.display = "block";
            document.getElementById('DivXY').style.display = "none";
            


        }
        document.getElementById('DetecterProjet').onclick = function () {
            
            if (this.text = "Saisir coordonnées  projet") { this.text = "Visualiser le projet"; }
            if (this.text = "Visualiser le projet") { this.text = "Saisir coordonnées  projet"; }
            mapp1.graphics.clear();
            TitreOuProjet = 2
            $('#CodeProjetInput').val("");
            $("#tbodyCoordProjet").empty();
            $("#tbodyInfProj").empty();

            document.getElementById('DivInfo').style.display = "none";
            document.getElementById('DivXY').style.display = "block";


        }

        document.getElementById('CreerTitre').onclick = function () {
            var table = document.getElementById('tbodyCoord');
         

            var myArray = [];
            // var singleRingPolygon = new Polygon([[50, 0], [150, 20], [150, -20], [50, 0]]);

            for (i = 0; i < table.rows.length; i++) {

                var x = document.getElementById("tbodyCoord").rows[i].cells;

                //myArray.push([parseInt(x[0].innerHTML, 8), parseInt(x[1].innerHTML, 8)]);
                var p = new Point(parseFloat(x[1].innerHTML).toFixed(3), parseFloat(x[2].innerHTML).toFixed(3));
                //   alert(parseFloat(x[1].innerHTML).toFixed(3));
                //  alert(parseFloat(x[2].innerHTML).toFixed(3));
                myArray.push([p.x, p.y]);
            }
            //console.log(myArray);

            mapp1.graphics.clear();
            pol = new Polygon(myArray);
            var sr = new SpatialReference(26191);
            pol.setSpatialReference(sr);

            var wkid = new SpatialReference(26191);
            var wkid1 = new SpatialReference(4326);


            gsvc.project([pol], wkid1, function (projectpol) {
                //console.log(projectpol);
                var arr = [];
                var pp = projectpol[0].getCentroid();
                //console.log(pp);
                for (var i = 0; i < projectpol[0].rings.length; i++) {
                    //console.log(projectpol[0].rings[i]);
                    for (var j = 0; j < projectpol[0].rings[i].length; j++) {

                        arr.push((projectpol[0].rings[i][j]));

                    }
                }
                var count = 0;
                var arrFinal = [];
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[i][0] == arr[j][0] && arr[i][1] == arr[j][1]) {
                            count++;
                        }
                    }
                    if (count <= 2) {
                        arrFinal.push(arr[i]);
                    }
                    count = 0;
                }



                var poly = new Polygon(arr);
                var polyy = projectpol[0];


                geometrymaj = poly;
                var extent = poly.getExtent().expand(5);
                mapp1.setExtent(extent);

                var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));

                //console.log(poly);
                alert(poly.isSelfIntersecting(poly));


                var graphic2 = new Graphic(poly, sfs);
                //console.log(graphic2);
                mapp1.graphics.add(graphic2);
                document.getElementById("MajTitre").style.display = "block";
            });
            //////////////var table = document.getElementById('tbodyCoord');

            //////////////var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //////////////    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            //////////////        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));


            //////////////var myArray = [];
            //////////////// var singleRingPolygon = new Polygon([[50, 0], [150, 20], [150, -20], [50, 0]]);

            //////////////for (i = 0; i < table.rows.length; i++) {

            //////////////    var x = document.getElementById("tbodyCoord").rows[i].cells;

            //////////////    //myArray.push([parseInt(x[0].innerHTML, 8), parseInt(x[1].innerHTML, 8)]);
            //////////////    var p = new Point(parseFloat(x[1].innerHTML).toFixed(3), parseFloat(x[2].innerHTML).toFixed(3));
            //////////////    alert(parseFloat(x[1].innerHTML).toFixed(3));
            //////////////    alert(parseFloat(x[].innerHTML).toFixed(3));
            //////////////    myArray.push([p.x, p.y]);
            //////////////}
            //////////////console.log(myArray);

            //////////////mapp1.graphics.clear();
            //////////////pol = new Polygon(myArray);
            //////////////var sr = new SpatialReference(26191);
            //////////////pol.setSpatialReference(sr);
            //////////////var wkid = new SpatialReference(26191);
            //////////////var wkid1 = new SpatialReference(4326);

            //////////////gsvc.project([pol], wkid1, function (projectpol) {
            //////////////    console.log(projectpol);
            //////////////    var poly = projectpol[0];
            //////////////    console.log(poly);
            //////////////    geometrymaj = poly;
            //////////////    var extent = poly.getExtent().expand(5);
            //////////////    mapp1.setExtent(extent);
            //////////////    var graphic2 = new Graphic(poly, sfs);
            //////////////    console.log(graphic2);
            //////////////    mapp1.graphics.add(graphic2);
            //////////////    document.getElementById("MajTitre").style.display = "block";
            //////////////});

            //var union = geometryEngine.union(myArray);






            //// var geometry = new esri.geometry.polygon(resultFeaturesa[i].attributes["Shape_Area"] , spatialReference);
            //// graphic = new Graphic(geometry,spatialReference);	
            //var attr = { "Plant": "Mesa Mint" };

            //graphic22 = new Graphic(union, sfs, attr);
            ////graphic22.attr("new_att", "new_value");  
            //console.log(graphic22);
            //cityLayer = new GraphicsLayer();
            //cityLayer.id = "toto";
            ////cityLayer.add(graphic2);
            ////cityLayer.add(graphic);
            //cityLayer.add(graphic22);

            //console.log(cityLayer);
            //mapmain.graphics.add(graphic22);
            //mapmain.addLayer(cityLayer);


            //var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            //        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            //var graphicsLayer = new GraphicsLayer();
            ////graphicsLayer.add(new Graphic(union, sfs));

            //mapmain.graphics.add(new Graphic(union, sfs));
        }

        //document.getElementById('Completer').onclick = function () {
        //    //ObjectId = $('#Completer').val();


        //}

        document.getElementById('MajTitre').onclick = function () {

            
            //var attr = {};
            //attr["objectid"] = ObjectId;
            //attr["Etat"] = 'Complet';

            //var featurs = [];

            //var graphicvv = new Graphic(geometrymaj);
            //graphicvv.setAttributes(attr);
            //featurs.push(graphicvv);
            //console.log(graphicvv);
            var FtParcelaire = new FeatureLayer("http://srvsiidev.aurs.local:6080/arcgis/rest/services/MODAURSF/FeatureServer/0",
                { outFields: ["*"] });


            FtParcelaire.queryFeatures({
                where: "objectid=" + ObjectId,
                returnGeometry: true,
                outFields: ["*"]
            }).then(function (results) {
                var updateFeature = results.features[0];
                console.log(updateFeature);
                updateFeature.attributes['etat'] = "Complet";
                updateFeature.geometry = pol;

                //const edits = {
                //    updateFeatures: updateFeature
                //};
                //console.log(edits);
                FtParcelaire.applyEdits(null, [updateFeature], null, function () {
                    alert('Mise à jour avec succès!');          
                    $("#tableTitre").load(location.href + " #tableTitre");
                }, function (err) {
                    console.log('Error occured: ', err);
                });
            });
        }
        var union;
        var text_zonage = "";
        document.getElementById('Fusionner').onclick = function () {




            var rows = document.getElementById("Parcelles").rows;
            console.log(rows);
            var where = '-1,';
            for (var i = 0; i < rows.length; i++) {
                var rowText = rows[i].id;
                where = where + rowText + ','
            }
            where = where + '-1';
            where = 'objectid in (' + where + ')';
            


            var Parcelle = new FeatureLayer("http://srvsiidev.aurs.local:6080/arcgis/rest/services/MODAURSF/FeatureServer/0", {
                outFields: ["*"]
            });

            var selectQueryParcelle = new Query();
            selectQueryParcelle.where = where;
            selectQueryParcelle.outFields = ["*"];

            selectQueryParcelle.outSpatialReference = mapp1.spatialReference;


            Parcelle.selectFeatures(selectQueryParcelle, FeatureLayer.SELECTION_NEW, function (resultFeaturesa) {
                console.log(resultFeaturesa);


                var myArray = [];
                //var featuresParcel = resultFeaturesa.features;

                //console.log(featuresParcel);

                for (i = 0; i < resultFeaturesa.length; i++) {
                    //myArray[i] = resultFeaturesa[i].geometry;
                    console.log(resultFeaturesa[i].geometry);
                    console.log(resultFeaturesa[i]);

                    myArray.push(resultFeaturesa[i].geometry);
                }


                console.log(myArray);



                 union = geometryEngine.union(myArray);

                var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 2), new Color([255, 100, 0, 0.25]));

                var graphic22 = new Graphic(union, sfs);

           

                mapp1.graphics.add(graphic22);


                /////////////////////

                //var featureLeyr_parcSec = new FeatureLayer("https://localhost:6443/arcgis/rest/services/ZoneSecteursRabat/MapServer/0");
                //var q_parc = new Query();
                //q_parc.outFields = ["*"];
                //q_parc.returnGeometry = true;
                //q_parc.where = "1=1";
                //featureLeyr_parcSec.queryFeatures(q_parc, function (featureSet) {
                //    featuresParc = featureSet.features;
                //    for (var i = 0; i < featuresParc.length; i++) {
                        
                //        console.log(graphic22.geometry);
                //        console.log(featuresParc[i].geometry);
                //        if (geometryEngine.intersects(graphic22.geometry, featuresParc[i].geometry) == true) {



                //            $("#ListZonage").append('<option value="' + featuresParc[i].attributes['secteur'] + '">' + featuresParc[i].attributes['secteur'] + '</option>');


                //        }

                //    }


                //})


               //var featureLeyr_parc = new FeatureLayer("https://localhost:6443/arcgis/rest/services/ZoneSecteursRabat/MapServer/1");
               // q_parc = new Query();
               // q_parc.outFields = ["*"];
               // q_parc.returnGeometry = true;
               // q_parc.where = "1=1";
               // featureLeyr_parc.queryFeatures(q_parc, function (featureSet) {
               //     featuresParc = featureSet.features;
               //     for (var i = 0; i < featuresParc.length; i++) {
               //         if (geometryEngine.intersects(graphic22.geometry, featuresParc[i].geometry) == true) {



               //             $("#ListSecteurs").append('<option value="' + featuresParc[i].attributes['zone_'] + '">' + featuresParc[i].attributes['zone_'] + '</option>');


               //         }
               //     }

               // })

                ////////////////////

                var extent = graphic22.geometry.getExtent().expand(5);
                mapp1.setExtent(extent);

                $("#tbodyCoordProjet").empty();


                for (var j = 0; j < graphic22.geometry.rings.length; j++) {
                    var UnionGraphic = graphic22.geometry.rings[j];
                    for (var i = 0; i < UnionGraphic.length - 1; i++) {

                        var x = UnionGraphic[i][0];
                        var y = UnionGraphic[i][1];


                        var table = document.getElementById('tbodyCoordProjet');
                        var row = table.insertRow(table.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        cell1.innerHTML = "B" + table.rows.length;
                        cell2.innerHTML = x;
                        cell3.innerHTML = y;
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

                    }
                }

                console.log(union);



            });

        
           
          

          
        };

        var zon;

        document.getElementById('Croisement').onclick = function () {
       

            
            //////Information Urbanistique


            q1 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/0");
            q1.ef = new Query();
            q1.ef.outFields = ["*"];
            q1.ef.geometry = union;
            q1.ef.returnGeometry = true;
            var a = q1.execute(q1.ef);


            q2 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/1");
            q2.ct = new Query();
            q2.ct.outFields = ["*"];
            q2.ct.geometry = union;
            q2.ct.returnGeometry = true;
            var b = q2.execute(q2.ct);


            q3 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/2");
            q3.Arcade = new Query();
            q3.Arcade.outFields = ["*"];
            q3.Arcade.geometry = union;
            q3.Arcade.returnGeometry = true;
            var c = q3.execute(q3.Arcade);


            q4 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/3");
            q4.LHT = new Query();
            q4.LHT.outFields = ["*"];
            q4.LHT.geometry = union;
            q4.LHT.returnGeometry = true;
            var d = q4.execute(q4.LHT);


            q5 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/4");
            q5.Muraille = new Query();
            q5.Muraille.outFields = ["*"];
            q5.Muraille.geometry = union;
            q5.Muraille.returnGeometry = true;
            var e = q5.execute(q5.Muraille);


            q6 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/5");
            q6.Souk = new Query();
            q6.Souk.outFields = ["*"];
            q6.Souk.geometry = union;
            q6.Souk.returnGeometry = true;
            var f = q6.execute(q6.Souk);


            q7 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/6");
            q7.Servitude = new Query();
            q7.Servitude.outFields = ["*"];
            q7.Servitude.geometry = union;
            q7.Servitude.returnGeometry = true;
            var g = q7.execute(q7.Servitude);


            q8 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/7");
            q8.Recul = new Query();
            q8.Recul.outFields = ["*"];
            q8.Recul.geometry = union;
            q8.Recul.returnGeometry = true;
            var h = q8.execute(q8.Recul);


            q9 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/8");
            q9.Voirie = new Query();
            q9.Voirie.outFields = ["*"];
            q9.Voirie.geometry = union;
            q9.Voirie.returnGeometry = true;
            var k = q9.execute(q9.Voirie);


            q10 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/9");
            q10.DMaritime = new Query();
            q10.DMaritime.outFields = ["*"];
            q10.DMaritime.geometry = union;
            q10.DMaritime.returnGeometry = true;
            var i = q10.execute(q10.DMaritime);


            q11 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/10");
            q11.CouvertureRue = new Query();
            q11.CouvertureRue.outFields = ["*"];
            q11.CouvertureRue.geometry = union;
            q11.CouvertureRue.returnGeometry = true;
            var j = q11.execute(q11.CouvertureRue);


            q12 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/11");
            q12.Construction = new Query();
            q12.Construction.outFields = ["*"];
            q12.Construction.geometry = union;
            q12.Construction.returnGeometry = true;
            var l = q12.execute(q12.Construction);



            q13 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/12");
            q13.ConduiteONEP = new Query();
            q13.ConduiteONEP.outFields = ["*"];
            q13.ConduiteONEP.geometry = union;
            q13.ConduiteONEP.returnGeometry = true;
            var m = q13.execute(q13.ConduiteONEP);


            q14 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/13");
            q14.cp = new Query();
            q14.cp.outFields = ["*"];
            q14.cp.geometry = union;
            q14.cp.returnGeometry = true;
            var o = q14.execute(q14.cp);


            q15 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/14");
            q15.Arr = new Query();
            q15.Arr.outFields = ["*"];
            q15.Arr.geometry = union;
            q15.Arr.returnGeometry = true;
            var p = q15.execute(q15.Arr);




            q16 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/15");
            q16.Eq = new Query();
            q16.Eq.outFields = ["*"];
            q16.Eq.geometry = union;
            q16.Eq.returnGeometry = true;
            var q = q16.execute(q16.Eq);


            q17 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/16");
            q17.ev = new Query();
            q17.ev.outFields = ["*"];
            q17.ev.geometry = union;
            q17.ev.returnGeometry = true;
            var u = q17.execute(q17.ev);


            q18 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/17");
            q18.il = new Query();
            q18.il.outFields = ["*"];
            q18.il.geometry = union;
            q18.il.returnGeometry = true;
            var v = q18.execute(q18.il);


            q19 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/18");
            q19.la = new Query();
            q19.la.outFields = ["*"];
            q19.la.geometry = union;
            q19.la.returnGeometry = true;
            var w = q19.execute(q19.la);


            q20 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/19");
            q20.pa = new Query();
            q20.pa.outFields = ["*"];
            q20.pa.geometry = union;
            q20.pa.returnGeometry = true;
            var x = q20.execute(q20.pa);


            q21 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/20");
            q21.lotis = new Query();
            q21.lotis.outFields = ["*"];
            q21.lotis.geometry = union;
            q21.lotis.returnGeometry = true;
            var y = q21.execute(q21.lotis);


            q22 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/21");
            q22.place = new Query();
            q22.place.outFields = ["*"];
            q22.place.geometry = union;
            q22.place.returnGeometry = true;
            var z = q22.execute(q22.place);

            q23 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/22");
            q23.sv = new Query();
            q23.sv.outFields = ["*"];
            q23.sv.geometry = union;
            q23.sv.returnGeometry = true;
            var z = q23.execute(q23.sv);


            q24 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/23");
            q24.sn = new Query();
            q24.sn.outFields = ["*"];
            q24.sn.geometry = union;
            q24.sn.returnGeometry = true;
            var aa = q24.execute(q24.sn);


            q25 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/24");
            q25.sa = new Query();
            q25.sa.outFields = ["*"];
            q25.sa.geometry = union;
            q25.sa.returnGeometry = true;
            var bb = q25.execute(q25.sa);


            q26 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/26");
            q26.secteur = new Query();
            q26.secteur.outFields = ["*"];
            q26.secteur.geometry = union;
            q26.secteur.returnGeometry = true;
            var cc = q26.execute(q26.secteur);


            q27 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/26");
            q27.rp = new Query();
            q27.rp.outFields = ["*"];
            q27.rp.geometry = union;
            q27.rp.returnGeometry = true;
            var dd = q27.execute(q27.rp);


            q28 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/27");
            q28.zf = new Query();
            q28.zf.outFields = ["*"];
            q28.zf.geometry = union;
            q28.zf.returnGeometry = true;
            var ee = q28.execute(q28.zf);

            q29 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/28");
            q29.za = new Query();
            q29.za.outFields = ["*"];
            q29.za.geometry = union;
            q29.za.returnGeometry = true;
            var ee = q29.execute(q29.za);


            q30 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/30");
            q30.zonage = new Query();
            q30.zonage.outFields = ["*"];
            q30.zonage.geometry = union;
            q30.zonage.returnGeometry = true;
            var ff = q30.execute(q30.zonage);

            //q31 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/30");
            //q31.vp = new Query();
            //q31.vp.outFields = ["*"];
            //q31.vp.geometry = union;
            //var gg = q31.execute(q31.vp);



            //q32 = new QueryTask("http://srvsiidev.aurs.local:6080/arcgis/rest/services/PA/MapServer/31");
            //q32.vp = new Query();



            

           

            // var promises = all([a, b, c, d, e, f, g, h, k, i, j, l, m, o, p, q, u, v, w, y, z, aa, bb, cc, dd, ee, ff, gg, hh, ii]);
            var promises = all([a, ff, cc, v, q]);
            promises.then(result);

            function result(featureSet) {

                
                
                //var Emp_Fer = featureSet[0].features;
                //var Cir_Tou = featureSet[1].features;
                //var Arcade = featureSet[2].features;
                //var Lig_HT = featureSet[3].features;
                //var Mur = featureSet[4].features;
                //var Sp_souk = featureSet[5].features;
                //var Ser_Ae = featureSet[6].features;
                //var Rec = featureSet[7].features;
                //var Voi = featureSet[8].features;
                //var Dom = featureSet[9].features;
                //var Couv = featureSet[10].features;
                //var Cons = featureSet[11].features;
                //var Cond = featureSet[12].features;
                //var Chem = featureSet[13].features;
                //var Arr = featureSet[14].features;
                //var Equ = featureSet[15].features;
                //var Esp_Vr = featureSet[16].features;
                //var Ilo = featureSet[17].features;
                //var Lim_AA = featureSet[18].features;
                //var lim_PA = featureSet[19].features;
                //var Lotis = featureSet[20].features;
                //var Place = featureSet[21].features;
                //var Serv_Vo = featureSet[22].features;
                //var Serv_Por = featureSet[23].features;
                //var erv_Non = featureSet[24].features;
                //var Serv_Ae = featureSet[25].features;
                //var Secteur = featureSet[26].features;
                //var Ron_po = featureSet[27].features;
                //var Z_Ferr = featureSet[28].features;
                //var Z_Aed = featureSet[29].features;
                var Zonage = featureSet[1].features;
               

                var Secteur = featureSet[2].features;
                

                console.log(featureSet[4]);
                var Ilots = featureSet[3].features;


               
                var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.9]));

                var graphic22 = new Graphic(featureSet[4].features[0].geometry, sfs);
               // var graphic22 = new Graphic(geometryEngine.intersect(featureSet[4].features[0].geometry, union), sfs);
                



                mapp1.graphics.clear();
                mapp1.graphics.add(graphic22);

                /// var Voi_Po = featureSet[31].features;





                if (Zonage.length != 0) {

                    text_zonage = "";
                    text_zonage += "<b><p>Informations sur le zonage </p></b><table id='lots' class='table table-striped table-bordered'><thead><tr style='background-color:#337ab7;color:white;'><td><b>Zone</b></td><td><b></b></td><td><b>Définition</b></td></tr></thead>";
                    var j = 0;
                    for (var i = 0; i < Zonage.length; i++) {
                        if (Zonage[i].attributes["zone"] != null || Zonage[i].attributes["definition"] != null) {
                            text_zonage += "<tr>";
                            text_zonage += "<td>" + (j + 1) + "</td>"; j++;
                            text_zonage += "<td>" + Zonage[i].attributes["zone"] + "</td>";
                            text_zonage += "<td>" + Zonage[i].attributes["definition"] + "</td>";
                            text_zonage += "</tr>";
                        }
                    }
                    text_zonage += "</table><br/>";

                    var res = text_zonage.replace(/’/g, "'");
                    var dd = "<div><br/><div id='parag' >" + res + "</div></div>";
                    document.getElementById("lol").innerHTML = dd;

                }
                if (Secteur.length != 0) {

                    text_zonage += "<b><p>Informations sur les Secteurs </p></b><table id='lotss' class='table table-striped table-bordered'><thead><tr style='background-color:#337ab7;color:white;'><td><b>Secteur</b></td><td><b></b></td><td><b>Définition</b></td></tr></thead>";
                    var j = 0;
                    for (var i = 0; i < Secteur.length; i++) {
                        if (Secteur[i].attributes["zone"] != null || Secteur[i].attributes["definition"] != null) {
                            text_zonage += "<tr>";
                            text_zonage += "<td>" + (j + 1) + "</td>"; j++;
                            text_zonage += "<td>" + Secteur[i].attributes["zone"] + "</td>";
                            text_zonage += "<td>" + Secteur[i].attributes["definition"] + "</td>";
                            text_zonage += "</tr>";
                        }
                    }
                    text_zonage += "</table><br/>";

                    var res = text_zonage.replace(/’/g, "'");
                    var dd = "<div><br/><div id='parag' >" + res + "</div></div>";
                    document.getElementById("lol").innerHTML = dd;

                }

                //if (Ilots.length != 0) {

                //    text_zonage += "<b><p>Informations sur les Secteurs </p></b><table id='lotsss' class='table table-striped table-bordered'><thead><tr style='background-color:#337ab7;color:white;'><td><b>Secteur</b></td><td><b></b></td><td><b>Arrondissement</b></td></tr></thead>";
                //    var j = 0;
                //    for (var i = 0; i < Ilots.length; i++) {
                //        if (Ilots[i].attributes["zone"] != null || Ilots[i].attributes["definition"] != null) {
                //            text_zonage += "<tr>";
                //            text_zonage += "<td>" + (j + 1) + "</td>"; j++;
                //            text_zonage += "<td>" + Ilots[i].attributes["Secteur"] + "</td>";
                //            text_zonage += "<td>" + Ilots[i].attributes["Arrondissement"] + "</td>";
                //            text_zonage += "</tr>";
                //        }
                //    }
                //    text_zonage += "</table><br/>";

                //    var res = text_zonage.replace(/’/g, "'");
                //    var dd = "<div><br/><div id='parag' >" + res + "</div></div>";
                //    document.getElementById("lol").innerHTML = dd;

                //}





            }

        };

        document.getElementById('ValiderProjet').onclick = function () {
            //var table = document.getElementById('tbodyCoordProjet');

            //var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            //    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            //        new Color([255, 0, 0]), 2), new Color([0, 255, 0, 0.25]));


            //var myArray = [];
            //// var singleRingPolygon = new Polygon([[50, 0], [150, 20], [150, -20], [50, 0]]);

            //for (i = 0; i < table.rows.length; i++) {

            //    var x = document.getElementById("tbodyCoordProjet").rows[i].cells;

            //    //myArray.push([parseInt(x[0].innerHTML, 8), parseInt(x[1].innerHTML, 8)]);
            //    var p = new Point(parseFloat(x[1].innerHTML).toFixed(14), parseFloat(x[2].innerHTML).toFixed(14));
               
            //    myArray.push([p.x, p.y]);
            //}
            //console.log(myArray);

            //mapp1.graphics.clear();
            //pol = new Polygon(myArray);
            //var sr = new SpatialReference(26191);
            //pol.setSpatialReference(sr);
            //var wkid = new SpatialReference(26191);
            //var wkid1 = new SpatialReference(4326);

            //gsvc.project([pol], wkid1, function (projectpol) {
            //    console.log(projectpol);
            //    var poly = projectpol[0];
            //    console.log(poly);
            //    geometrymaj = poly;
            //    var extent = poly.getExtent().expand(5);
            //    mapp1.setExtent(extent);
            
            ////////////////////////////////////////////////////////var FtProjet = new FeatureLayer("https://srvsiidev.aurs.local/server/rest/services/Projets/FeatureServer/0",
            ////////////////////////////////////////////////////////    { outFields: ["*"] });


            ////////////////////////////////////////////////////////var addFeature;
            ////////////////////////////////////////////////////////addFeature.geometry = GeometryProjet;


            ////////////////////////////////////////////////////////FtProjet.applyEdits([addFeature], null, null, function () {
            ////////////////////////////////////////////////////////        alert('Projet affecté avec succès au dossier d/"autorisation!');
                    
            ////////////////////////////////////////////////////////    }, function (err) {
            ////////////////////////////////////////////////////////        console.log('Error occured: ', err);
            ////////////////////////////////////////////////////////    });
           
        }
            //    console.log(graphic2);
            //    mapp1.graphics.add(graphic2);
            //    //document.getElementById("MajTitre").style.display = "block";

              

            //    featureLeyr_parcSec = new FeatureLayer("https://localhost:6443/arcgis/rest/services/ZoneSecteursRabat/MapServer/0");
            //    var q_parc = new Query();
            //    q_parc.outFields = ["*"];
            //    q_parc.returnGeometry = true;
            //    q_parc.where = "1=1";
            //    featureLeyr_parcSec.queryFeatures(q_parc, function (featureSet) {
            //        featuresParc = featureSet.features;
            //        for (var i = 0; i < featuresParc.length; i++) {
            //            if (geometryEngine.intersects(graphic2.geometry, featuresParc[i].geometry) == true) {

                           

            //                $("#ListZonage").append('<option value="' + featuresParc[i].attributes['secteur'] + '">' + featuresParc[i].attributes['secteur'] + '</option>');


            //            }

            //        }


            //    })


            //    map.addLayer(graphicLayer);
           
            //})
    
            //console.log(fff.getEditCapabilities());
            //console.log(fff);
            //fff.applyEdits(null, featurs, null, function () {
            //    alert('ffffff');
            //}, function (err) {
            //    console.log('Error occured: ', err);
            //});  
          
            //fff.refresh();
      
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














        document.getElementById("click").onclick = function () {
            //var url = "http://portal.geomatic-online.ma/arcgis2/rest/services/MohcineNRU/ExportWebMapNRU/GPServer/Exporter%20une%20carte%20Web";
            var url = "http://srvsiidev.aurs.local:6080/arcgis/rest/services/ExportWebMap/GPServer/Exporter%20une%20carte%20Web";
            var printer = new PrintTask(url);
            var params = new PrintParameters();
            var template = new PrintTemplate();
            template.layout = "impression";
            //template.preserveScale = true;
            //template.preserveScale = true;
            //template.outScale = 2000;

            console.log(mapp1);
            alert("Fiche en cours de génération..Merci de patienter!..");
            // template.outScale = 2000;

            params.map = mapp1;
            params.template = template;

            printer.execute(params, function (result) {
                var img = new Image;
                img.onload = function () {
                    var doc = new jsPDF();

                    //var image1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAB3CAYAAADfEBTOAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAOblJREFUeF7tfQdYVle29mcmU + 5MMjPRxMSGJbbYKxbEjj3G3mLFbuwNC9h7UFEURYpYQBGl916kd + lFBEEREaV3fP + 19vk + wTJzZ + 7l / iiZ9TyLU77T9n73Wutd++yzkeE3KkWF + UhNjpVvffrymwUyLjYcvt52eP36tXzPpy2 / WSDdXW / Dwc6A1v4D5CcneS9y4OJgCmsLfRw9uArrlqvB / MZZuDjdREiIl / yoT1N + U0CWlZXCwfYGZk3qBVvLq / D3dcHiOYNx64YOcnKeyI / 6NOU36VovntsH7WOboX / xIAz0DqKm5tN3r78JICsrK5CaGicskuXWjdNQnz8Myxao4MqlA2Ify + PHqSgseCnf + rSk0QNZkP8Sbi53EB3li7BgDzja3YTFrXO4e / sCLM0v4KbJSWSkJ8PdzQrR0QG0vEduNkt + 9qcjjR7Ixxlp0NPZC6NLWnBxNMOe7T / j1yNrYHj5CDIexSMizB2XdPfDxtIYXu7mcHYwhruLlfzsT0caNZB5ec8JPAucP62B7RtmwfquIcxNdTBvaj + EBnuKYyLCPGBicAL3fRxx7OAa7Ng0A1Z3TVBdXSV + /1Sk0QLJcdGZUg1/PxtY39HFWSI3wQGusL13GYvnjsAxTXU4216FudkFGF0 + BC8PK / h43oPZ9dOICPeGh6vlJwVmowGyuroaD1Ni8SL3mdguKyvD5fP74OFyA + d + 3YOwEF94u93G2sWjcfPqcaxZPBEH96yGp9stzJ7cGzqntiHQ3x6aO5cgONAZbmTJZaUSOaquqhTLj1kaDZBhwV4w1teCj7sFXsvTCa2dS2FjoUcARxIwNzF / al + M6v8t1i4aCVfHq0R4zmPJzEFQG9oOY4YpEZib4eVmAcs7F + DqdEdco6KiAkH + jkiMCxPbH6t8kkBy / 2jO8yfIfJyM6Ah / IipX4exojlsU / 65QXhhKoMY8CIMeWeSOX6bD0eYmgv3dcGSPOsYqt8bCGcrEXg3JlVpQvBwItSFKmDmxL47u34zTx7djw8rJMLh0GKlk4e6uVjirvQXGV45QHHXCq5e5b57hY5JPEsjCwnwEBTniuvER6Orsx6OMJLE / NS2a1hOQnpmIR4 + iEBrogF2b55CFFiE5OQKpScFYNlsF69XHYuvqKbhjehobV0wiSx2M5IQwSlWeiuucP70Vpte0YWd1A67OlkiID0Nm1kNERwZSTL0MPx87pD + KQ26udPzHIJ8kkExCvD3u4SARluLSfLLIS8RGf4UxJfcm + kdFX6qz / TVaGkLn5G7s2TwbR + lYH4 / bOLBzAeZM7IX92 + dh16bpUBvcBrrae + Dva0UWuQohgfY4rLWCLPCYYLSZj + Pg42UJVwcTZD9NQXFJEa4ZnsBdcx1ERfjJn6jh5ZONkTnPnuLsqd3wdr + DyWO7iDSjqKgQVVVVxFjfZpvRkSGwtzHDxbPbcf7ERqjPGozdW2Zgx / ppGK / yPTHUO3StXbCzvU3W5kKWmY / y8go8fvxQ9PY8TE0kt + qMg3uXIYQ8QWpyNHkDbZSWFsvv0PDyyQKZ / igFdjbXYGpylixpk3xvrfh52yCJXGJpSQmuXNiH2zfO4OSBdXCwuoTVC0dAc / scrFw4EotmqVLeeBmGV06Slekh7WG0OP / pk0diWVecHe5i99b5qKmpQHxcuHzvxyGfJJCxMSGwJDaqfWwTpQpOAlCWiHBf + N93IjAScJ3c3z2z0zh9aC1uXz9DbvYilhDJuXf7ItYum4hp43 / AqKFK2L5xHjR3LcKKJSNhRWz19IkNMDY8jYNaq8lSrcV1KyrKxDLn2RPoUUwuKc6Dl6cN7S8X + z8G + SSBjAj3w3Wjo9i6YS4CA5yQmhqLxPgo6Gjvhq2VAbZtmomTJ7biyiUtsryFuHTuMMxvXYDh5cMICnDDtg0L0LfrXzCgZ1P8enwrQkN9yNIWY8XisVjy81hs3zSXUhNdHNJaCZt7 + rhqcBRJCZEoKiygXNOdclJn2Fnr40Gkv0hPPgb5JIFk6l9SXICsrAzcuXWR9lRBX + 8YNDbPo / RjP1nYckREBOOW2RVcvnhQnJOdnQlrSwMCwR3XjE9j + 5YlRJbWUcxzRU5OJrRPbqd4mI68vFxo7VqKvRorsW / 3ciI9h2B97zKRK3tivjFEtMpw784lXLm4n2Kvv + iI + Bjkk42RCnGjPM / DzVxYyd6d6vBwt8exg + spxj0Uv58ii7Mwv4yM9FQY6B + CkcEh3Lh + ipioFbw97yKSrPv0qW3wdLcRx3u6W8DR1kys + 3jZwohip + 65gwTqSso7bREd7UMegQCs + jgAVMgnDWR5eRm8KTU4e2ozNv / yk3i3 + Cu5VI1tc6GxfQEc7ExJr + OK / mEEB7kgMTGY2KsBEuKYBBXjCeWGVpSqXCUGmpAQAmfHayKleRAdBF9ve2xa + yMMLx1GGLleN + fbcHW8TtZoQB5B / gAfkXzSQFZWVlLl38S5MzvJSoIpcY / C9s0LYHL1FK4aHcbpX9dTxevguslJipE6RFAsCVgmRlJ6EhXpi0QC8HFmHNzd79E5J + DkaAxv7zs4f1YD589o4KeJvbF80Rhxni5t + /vaIPf5x9MRoJBP3rUWFb7C8zovgnV+1cDF8zuwef0MrFg2HuqLRiIy0gtG+kfJlVoiPNSF0o1LdF4ubCyNKM4mwc2FrM3lLjzJuo3J9eqe3Y1bptqIjfVBUKAzfLydRF4Z4OdK8dIQxcWF8rt9PPLJA/muaB / fhTXqE8Q7SINLmli1TA1H9q2ElsYi4XLPUnpxaP8qAs + UANeEmelpnDy6AaeObaBc8yRuXtcmAnUeN0zOwcvdEiaGR / D82cc / YqDRARkU4EIpxTpcOLsdU8f3wCHN1bh14xLt90BmZqrojakh15qTm4XcvCeIiw8nK / WCJcW + 82c0CeS1mPVjX4qPU + FHcTIlJQElFE8 / dml0QF4zPotFc1Vw4dxuIjZGlNRbIMDfUfS9OtK2nZW + 6CCwuKULe2sj2FtdEaw3KMABcTH + SEmOhp + PE1Yvm4ppE3siItRbfuWPWxodkJZ3TWCgtwcnDq7Arm3zcIMYqZGBNnZvXwH1hRMxa + oQTJ / cnwjSLso9j2CKWi9Mo + 2lC9Rw / NBmGFMsNdA / iPi4 + 4JInT61Q / TffuzS6IB0d7mDOVN7Y2j / 5pg4ujO0KfbZWepT + uGAtNRwyi + TkBQfLDQxNhAPk8KQTfvi4wIph7wDXZ3dGDWkDRbM7I + 7t4 + JlONjSfr / mTQ6INPTErF6yUSMGNQaw / o1R79uX0K5518xrP / XmDy2E5b9rIrbN89STNSHE + WY2kfXYcWiEdi4bgpmTeuLwf2 + xpC + zdGn65cYObQtvNyk / taPXRodkCwFBfkI8vcit6pL7nIb9uxYjlVLJmPZgjFYMm + 4SC + io / xgZ3Mda1dMhuqgNli5WI3Y7iSsXz0DmhqryB2fRTIRnU9FGhTImppKlJcVCS1TLEsLxbKqsoxiUxmtF4vtivISVFSUinXF8eJY2l9eXiz / vUws8fp9V8id269evsCjh0kEsje5Wm / 4ersQsfFEeFggEuIikP00g1gtnf8JSoMBySPAb147B2srE9yzNIYlJedWlldhJbavUuJtJAYN36WlBS0taN9d0ntW12hpLI6xsqJta9omtbUzhaPDbdjZXoerswW8PGzg5 + soNOC + KwIDPeHv747QsPuIfhCK4GAvAtMToSG + CPR3hY + nNbw9rODpYQt3V0u4uljBhdTN1Roe7ta0pH1u0ra7mw1cnO / RMfdonbZd6TxaernbiPO9vezg5WkrXnVxf60HPYs7bQdSChQW5gd725vIykyT10T9SIMByS + GPahi + AOaul2XlbRdWlmJ4vJyFJaVI7 + 8AvkVlXgl1stQQOuFZF355ZW0XoVXtGStu7 + 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';




                    // Titre 
                    doc.setFontSize(26);
                    doc.setFont("times");
                    doc.setFontType('bold');
                    doc.text("Fiche de projet", 105, 50, 'center');

                    //ligne 
                    doc.setLineWidth(1)
                    doc.line(76, 52, 135, 52)



                    var doc = new jsPDF();
                    //var image1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAB3CAYAAADfEBTOAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAOblJREFUeF7tfQdYVle29mcmU + 5MMjPRxMSGJbbYKxbEjj3G3mLFbuwNC9h7UFEURYpYQBGl916kd + lFBEEREaV3fP + 19vk + wTJzZ + 7l / iiZ9TyLU77T9n73Wutd++yzkeE3KkWF + UhNjpVvffrymwUyLjYcvt52eP36tXzPpy2 / WSDdXW / Dwc6A1v4D5CcneS9y4OJgCmsLfRw9uArrlqvB / MZZuDjdREiIl / yoT1N + U0CWlZXCwfYGZk3qBVvLq / D3dcHiOYNx64YOcnKeyI / 6NOU36VovntsH7WOboX / xIAz0DqKm5tN3r78JICsrK5CaGicskuXWjdNQnz8Myxao4MqlA2Ify + PHqSgseCnf + rSk0QNZkP8Sbi53EB3li7BgDzja3YTFrXO4e / sCLM0v4KbJSWSkJ8PdzQrR0QG0vEduNkt + 9qcjjR7Ixxlp0NPZC6NLWnBxNMOe7T / j1yNrYHj5CDIexSMizB2XdPfDxtIYXu7mcHYwhruLlfzsT0caNZB5ec8JPAucP62B7RtmwfquIcxNdTBvaj + EBnuKYyLCPGBicAL3fRxx7OAa7Ng0A1Z3TVBdXSV + /1Sk0QLJcdGZUg1/PxtY39HFWSI3wQGusL13GYvnjsAxTXU4216FudkFGF0 + BC8PK / h43oPZ9dOICPeGh6vlJwVmowGyuroaD1Ni8SL3mdguKyvD5fP74OFyA + d + 3YOwEF94u93G2sWjcfPqcaxZPBEH96yGp9stzJ7cGzqntiHQ3x6aO5cgONAZbmTJZaUSOaquqhTLj1kaDZBhwV4w1teCj7sFXsvTCa2dS2FjoUcARxIwNzF / al + M6v8t1i4aCVfHq0R4zmPJzEFQG9oOY4YpEZib4eVmAcs7F + DqdEdco6KiAkH + jkiMCxPbH6t8kkBy / 2jO8yfIfJyM6Ah / IipX4exojlsU / 65QXhhKoMY8CIMeWeSOX6bD0eYmgv3dcGSPOsYqt8bCGcrEXg3JlVpQvBwItSFKmDmxL47u34zTx7djw8rJMLh0GKlk4e6uVjirvQXGV45QHHXCq5e5b57hY5JPEsjCwnwEBTniuvER6Orsx6OMJLE / NS2a1hOQnpmIR4 + iEBrogF2b55CFFiE5OQKpScFYNlsF69XHYuvqKbhjehobV0wiSx2M5IQwSlWeiuucP70Vpte0YWd1A67OlkiID0Nm1kNERwZSTL0MPx87pD + KQ26udPzHIJ8kkExCvD3u4SARluLSfLLIS8RGf4UxJfcm + kdFX6qz / TVaGkLn5G7s2TwbR + lYH4 / bOLBzAeZM7IX92 + dh16bpUBvcBrrae + Dva0UWuQohgfY4rLWCLPCYYLSZj + Pg42UJVwcTZD9NQXFJEa4ZnsBdcx1ERfjJn6jh5ZONkTnPnuLsqd3wdr + DyWO7iDSjqKgQVVVVxFjfZpvRkSGwtzHDxbPbcf7ERqjPGozdW2Zgx / ppGK / yPTHUO3StXbCzvU3W5kKWmY / y8go8fvxQ9PY8TE0kt + qMg3uXIYQ8QWpyNHkDbZSWFsvv0PDyyQKZ / igFdjbXYGpylixpk3xvrfh52yCJXGJpSQmuXNiH2zfO4OSBdXCwuoTVC0dAc / scrFw4EotmqVLeeBmGV06Slekh7WG0OP / pk0diWVecHe5i99b5qKmpQHxcuHzvxyGfJJCxMSGwJDaqfWwTpQpOAlCWiHBf + N93IjAScJ3c3z2z0zh9aC1uXz9DbvYilhDJuXf7ItYum4hp43 / AqKFK2L5xHjR3LcKKJSNhRWz19IkNMDY8jYNaq8lSrcV1KyrKxDLn2RPoUUwuKc6Dl6cN7S8X + z8G + SSBjAj3w3Wjo9i6YS4CA5yQmhqLxPgo6Gjvhq2VAbZtmomTJ7biyiUtsryFuHTuMMxvXYDh5cMICnDDtg0L0LfrXzCgZ1P8enwrQkN9yNIWY8XisVjy81hs3zSXUhNdHNJaCZt7 + rhqcBRJCZEoKiygXNOdclJn2Fnr40Gkv0hPPgb5JIFk6l9SXICsrAzcuXWR9lRBX + 8YNDbPo / RjP1nYckREBOOW2RVcvnhQnJOdnQlrSwMCwR3XjE9j + 5YlRJbWUcxzRU5OJrRPbqd4mI68vFxo7VqKvRorsW / 3ciI9h2B97zKRK3tivjFEtMpw784lXLm4n2Kvv + iI + Bjkk42RCnGjPM / DzVxYyd6d6vBwt8exg + spxj0Uv58ii7Mwv4yM9FQY6B + CkcEh3Lh + ipioFbw97yKSrPv0qW3wdLcRx3u6W8DR1kys + 3jZwohip + 65gwTqSso7bREd7UMegQCs + jgAVMgnDWR5eRm8KTU4e2ozNv / yk3i3 + Cu5VI1tc6GxfQEc7ExJr + OK / mEEB7kgMTGY2KsBEuKYBBXjCeWGVpSqXCUGmpAQAmfHayKleRAdBF9ve2xa + yMMLx1GGLleN + fbcHW8TtZoQB5B / gAfkXzSQFZWVlLl38S5MzvJSoIpcY / C9s0LYHL1FK4aHcbpX9dTxevguslJipE6RFAsCVgmRlJ6EhXpi0QC8HFmHNzd79E5J + DkaAxv7zs4f1YD589o4KeJvbF80Rhxni5t + /vaIPf5x9MRoJBP3rUWFb7C8zovgnV+1cDF8zuwef0MrFg2HuqLRiIy0gtG+kfJlVoiPNSF0o1LdF4ubCyNKM4mwc2FrM3lLjzJuo3J9eqe3Y1bptqIjfVBUKAzfLydRF4Z4OdK8dIQxcWF8rt9PPLJA/muaB / fhTXqE8Q7SINLmli1TA1H9q2ElsYi4XLPUnpxaP8qAs + UANeEmelpnDy6AaeObaBc8yRuXtcmAnUeN0zOwcvdEiaGR / D82cc / YqDRARkU4EIpxTpcOLsdU8f3wCHN1bh14xLt90BmZqrojakh15qTm4XcvCeIiw8nK / WCJcW + 82c0CeS1mPVjX4qPU + FHcTIlJQElFE8 / dml0QF4zPotFc1Vw4dxuIjZGlNRbIMDfUfS9OtK2nZW + 6CCwuKULe2sj2FtdEaw3KMABcTH + SEmOhp + PE1Yvm4ppE3siItRbfuWPWxodkJZ3TWCgtwcnDq7Arm3zcIMYqZGBNnZvXwH1hRMxa + oQTJ / cnwjSLso9j2CKWi9Mo + 2lC9Rw / NBmGFMsNdA / iPi4 + 4JInT61Q / TffuzS6IB0d7mDOVN7Y2j / 5pg4ujO0KfbZWepT + uGAtNRwyi + TkBQfLDQxNhAPk8KQTfvi4wIph7wDXZ3dGDWkDRbM7I + 7t4 + JlONjSfr / mTQ6INPTErF6yUSMGNQaw / o1R79uX0K5518xrP / XmDy2E5b9rIrbN89STNSHE + WY2kfXYcWiEdi4bgpmTeuLwf2 + xpC + zdGn65cYObQtvNyk / taPXRodkCwFBfkI8vcit6pL7nIb9uxYjlVLJmPZgjFYMm + 4SC + io / xgZ3Mda1dMhuqgNli5WI3Y7iSsXz0DmhqryB2fRTIRnU9FGhTImppKlJcVCS1TLEsLxbKqsoxiUxmtF4vtivISVFSUinXF8eJY2l9eXiz / vUws8fp9V8id269evsCjh0kEsje5Wm / 4ersQsfFEeFggEuIikP00g1gtnf8JSoMBySPAb147B2srE9yzNIYlJedWlldhJbavUuJtJAYN36WlBS0taN9d0ntW12hpLI6xsqJta9omtbUzhaPDbdjZXoerswW8PGzg5 + soNOC + KwIDPeHv747QsPuIfhCK4GAvAtMToSG + CPR3hY + nNbw9rODpYQt3V0u4uljBhdTN1Roe7ta0pH1u0ra7mw1cnO / RMfdonbZd6TxaernbiPO9vezg5WkrXnVxf60HPYs7bQdSChQW5gd725vIykyT10T9SIMByS + GPahi + AOaul2XlbRdWlmJ4vJyFJaVI7 + 8AvkVlXgl1stQQOuFZF355ZW0XoVXtGStu7 + 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';
                    var header = function (data) {
                    //doc.addImage(image1, 'PNG', 5, 5, 20, 20);
                    doc.setFontSize(6);
                    doc.text("ROYAUME DU MAROC", 10, 5);
                    doc.text("L’Agence Urbaine de Rabat-Salé (AURS )", 10, 8);
                    //doc.text("L’Agence Urbaine de Rabat-Salé (AURS )", 30, 11);
                    //doc.text("MARRAKECH", 30, 14);
                    //doc.text("COMMUNE DE MARRAKECH", 30, 17);
                    //doc.text("DIRECTION GENERALE DES SERVICES", 30, 20);
                    //doc.text("DIVISION DES ETUDES,PLANIFICATION ET CONTROLE DE GESTION", 30, 23);
                    //doc.text("CELLULE SIG", 30, 26);
                    var date = new Date();
                    var d = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                    doc.text("Rabat, le " + d, 175, 5);
                };
                    doc.setFontSize(8);


                    // Titre 
                    doc.setFontSize(26);
                    doc.setFont("times");
                    doc.setFontType('bold');
                    doc.text("Informations urbanistiques", 105, 30, 'center');

                    //ligne 
                    doc.setLineWidth(1)
                    //doc.line(76, 32, 200, 52)


                    //rectangles
                    //var titl = document.getElementById('Objet').getAttribute("idd").toLowerCase();
                    // var splitTitle = doc.splitTextToSize(titl, 180);
                    // doc.text(splitTitle, 105, 65, 'center');
                    doc.setDrawColor(0);
                    doc.setFillColor(78, 156, 175);
                    //doc.rect(40, 90, 60, 6, 'F');
                    //doc.rect(40, 97, 60, 6, 'F');
                    //doc.rect(40, 104, 60, 6, 'F');
                    //doc.rect(40, 111, 60, 6, 'F');
                    //doc.rect(40, 118, 60, 6, 'F');
                    //doc.rect(40, 125, 60, 6, 'F');
                    //doc.rect(40, 132, 60, 6, 'F');
                    //doc.rect(40, 139, 60, 6, 'F');
                    //doc.rect(40, 146, 60, 6, 'F');
                    //doc.rect(105, 90, 60, 6, 'F');
                    //doc.rect(105, 97, 60, 6, 'F');
                    //doc.rect(105, 104, 60, 6, 'F');
                    //doc.rect(105, 111, 60, 6, 'F');
                    //doc.rect(105, 118, 60, 6, 'F');
                    //doc.rect(105, 125, 60, 6, 'F');
                    //doc.rect(105, 132, 60, 6, 'F');
                    //doc.rect(105, 139, 60, 6, 'F');
                    //doc.rect(105, 146, 60, 6, 'F');
                    //doc.rect(5, 170, 80, 6, 'F');
                    //doc.rect(115, 170, 80, 6, 'F');
                    // Détails
                    doc.setFontSize(16);
                    doc.setFontType('bold');
                    doc.setFontSize(12);
                    //doc.text(document.getElementById('Code').getAttribute("idd"), 110, 94);

                    //doc.addHTML($('#lol')[0], 15, 15, {
                    //    'background': '#fff',
                    //});

                  //  if (secteurs.length != 0) {
                        //doc.text("Secteurs  ", 10, doc.autoTableEndPosY() + 7);
                        //var res1 = doc.autoTableHtmlToJson(document.getElementById("lots"));
                        //doc.autoTable(res1.columns, res1.data, options);
                    //} 

                    //doc.text("Code projet:", 45, 94); doc.text(document.getElementById('Code').getAttribute("idd"), 110, 94);
                    //doc.text("Chapitre:", 45, 101); doc.text(document.getElementById('Chap').getAttribute("idd"), 110, 101);
                    //doc.text("Article:", 45, 108); doc.text(document.getElementById('Article').getAttribute("idd"), 110, 108);
                    //doc.text("PRO ACT:", 45, 115); doc.text(document.getElementById('ProAct').getAttribute("idd"), 110, 115);
                    //doc.text("Ligne:", 45, 122); doc.text(document.getElementById('Ligne').getAttribute("idd"), 110, 122);
                    //doc.text("Source de financement:", 45, 129); doc.text(document.getElementById('Source').getAttribute("idd"), 110, 129);
                    //doc.text("Type d'autorisation:", 45, 136); doc.text(document.getElementById('Type').getAttribute("idd"), 110, 136);
                    //doc.text("Lieu d'execution:", 45, 143); doc.text(document.getElementById('Lieu').getAttribute("idd"), 110, 143);
                    //doc.text("Observation:", 45, 150); doc.text(document.getElementById('Obs').getAttribute("idd"), 110, 150);
                    //doc.text("SITUATION GEOGRAPHIQUE:",117,174);
                    //doc.text("LOCALISATION:", 30, 174);


                    //if (secteurs.length != 0) {

                    var footer = function (data) {
                        var image = 'data:image/png;base64,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';
                        doc.addImage(image, 'PNG', 40, 285);
                    }

                    var options = {
                        beforePageContent: header,
                        margin: {
                            top: 70,
                        },
                        // doc.text("Secteurs : ", 40, 30),               
                        startY: 50,
                        styles: { overflow: 'linebreak' },
                        columnStyles: {
                            0: { columnWidth: 15 },
                            1: { columnWidth: 15 },
                            2: { columnWidth: 150 }
                            //3: { columnWidth: 22 },
                            //4: { columnWidth: 40 },
                            //5: { columnWidth: 15 },
                            //6: { columnWidth: 10 },
                            //7: { columnWidth: 20 },
                            //8: { columnWidth: 19 },

                        },
                        //columnWidth: 'auto',
                        afterPageContent: footer,
                    };  


                    doc.text("Le zonage ", 10, 47);
                    var res1 = doc.autoTableHtmlToJson(document.getElementById("lots"));
                    //doc.autoTable(res1.columns, res1.data, { beforePageContent: header, margin: { top: 70, }, startY:50, afterPageContent: footer });
                    doc.autoTable(res1.columns, res1.data, options);


                    var optionsSecteurs = {
                        beforePageContent: header,
                        margin: {
                            top: 70,
                        },
                        // doc.text("Secteurs : ", 40, 30),               
                        startY: 50,
                        styles: { overflow: 'linebreak' },
                        columnStyles: {
                            0: { columnWidth: 15 },
                            1: { columnWidth: 15 },
                            2: { columnWidth: 150 }
                            //3: { columnWidth: 22 },
                            //4: { columnWidth: 40 },
                            //5: { columnWidth: 15 },
                            //6: { columnWidth: 10 },
                            //7: { columnWidth: 20 },
                            //8: { columnWidth: 19 },

                        },
                        //columnWidth: 'auto',
                        afterPageContent: footer,
                    }; 

                    doc.text("Les secteurs ", 10, doc.autoTableEndPosY() + 7);
                    var res1 = doc.autoTableHtmlToJson(document.getElementById("lotss"));
                    doc.autoTable(res1.columns, res1.data, { beforePageContent: header, margin: { top: 70, }, startY: doc.autoTableEndPosY() + 10, afterPageContent: footer });
                   // };


                    //doc.addImage(this, 'PNG', Horizontal, vertical, with, height);
                    doc.addImage(this, 'PNG', 5, 160, 200, 200);

                    doc.save('sample-file.pdf');

                    //ICI pour ajouter 2eme
                   //doc.save("Taxe " + ".pdf");

                    //doc.addHTML(document.getElementById('lol'), 25, 25, {
                    //    'background': '#fff',
                    //}, function () {
                    //    alert(11);
                    //    doc.save('sample-file.pdf');
                    //});

                


                }
                img.crossOrigin = "";
                img.src = result.url;
            }, function (error) {
                alert('Erreur! Merci de contacter votre administrateur!');
                console.log('error: ', error);
            });




        };


        document.getElementById('AjouterAvis').onclick = function () {
          

            var AutrePartie = document.getElementById('AutrePartie').selectedOptions[0].text;                  
            var CodePartie = document.getElementById('AutrePartie').selectedOptions[0].value;
            //alert(CodePartie);
           // alert(AutrePartie);
           //var AvisAutre = document.getElementById('AvisAutre').selectedOptions[0].text;

            var table = document.getElementById('tbodyAvis');
            var row = table.insertRow(table.length);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);

            cell1.innerHTML = AutrePartie;
            cell2.innerHTML = "<input type='hidden' value='" + CodePartie + "' name='CodeParties' class='form - control' />";           
            cell3.innerHTML = "<a name='update' onclick='DeleteTitre()'><img src='../Content/documentation/img/del.png' /></a>";
          

            //cell1.innerHTML = AutrePartie + "<input type='hidden' value='" + AutrePartie + "+" + AvisAutre + "' name='AutreP'> ";
           // cell2.innerHTML = AvisAutre;

        };

        
    });