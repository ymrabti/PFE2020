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





            document.getElementById('RefFon').onchange = function () {
                if (this.value == 'TNI') {
                    document.getElementById('addCoord').style.display = 'none';
                    document.getElementById('TableXY').style.display = 'none';
                    var x = document.getElementById('txtFraction').value;
                    var y = document.getElementById('RefFon').selectedOptions[0].text;
                    var refFonc = $('#RefFon').val();

                    if (refFonc != "TNI") {
                        var table = document.getElementById('tbodyCoord');
                        var row = table.insertRow(table.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);

                        cell1.innerHTML = y + "<input type='text' value='" + refFonc + "+" + x + "' name='titreF' class='form-control' />";
                        cell2.innerHTML = x;
                    } else {
                        $('#tableRF').prepend("<center><div class= 'table-responsive'> " +
                            "<div class='row' style='width:100%'>" +
                            "<div class='col-sm-5'>" +
                            "<input type='text' placeholder='000000.000' id='x' style='width:121%' />" +
                            "</div>" +
                            "<div class='col-sm-6'>" +
                            "<input type='text' placeholder='000000.000'id='y' style='width:100%' />" +
                            "</div><br/>" +
                            "</div><br/>" +
                            "<button type = 'button' class='btn btn-primary' id='addCoord1'>Add Coord et zoomer</button><br/><br/>" +
                            "<table class= 'table table-striped table-bordered first' name='ddddd' >" +
                            "<thead>" +
                            "<tr>" +
                            "<th>X</th>" +
                            "<th>Y</th>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody name='tbodyCoord1' id='tbodyCoord1'></tbody>" +
                            "</table >" +
                            "</div><br/><br/></center>");
                    }

                }
                if (this.value != 'TNI') {
                    document.getElementById('addCoord').style.display = 'block';
                    document.getElementById('TableXY').style.display = 'block';
                }

                var sym1 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
                );

                var featureLeyr_parc = new FeatureLayer("http://localhost:6080/arcgis/rest/services/MODAURS/MapServer/0");
                var q_parc = new Query();
                q_parc.outFields = ["*"];
                q_parc.returnGeometry = true;

                q_parc.where = "parcellaire.objectid=" + this.value;



                featureLeyr_parc.queryFeatures(q_parc, function (featureSet) {

                    featuresParc = featureSet.features;
                    for (var i = 0; i < featuresParc.length; i++) {
                        //if (geometryEngine.intersects(pt, featuresParc[i].geometry) == true) {
                        var graphic2 = new Graphic(featuresParc[0].geometry, sym1);

                        // var graphic2 = new Graphic(featuresParc[0].geometry);
                        //map.graphics.add(graphic2);
                        //graphicLayer.add(graphic2);
                        // }


                        mapp1.graphics.add(graphic2);

                        var extent = featuresParc[0].geometry.getExtent().expand(2);
                        mapp1.setExtent(extent);




                        // mapp1.setExtent(graphic2.geometry.getExtent());
                        // mapp1.graphics.add(graphic2);
                        //mapp1.Zoom(graphic2.geometry, 4);
                        //console.log(graphic2);
                    }



                });
            };




        });

        $("#RefFon").change(function () {
            $("#numFonc").find('option:eq(0)').prop('selected', true);
            $("#indiceFonc").find('option:eq(0)').prop('selected', true);
            $("#fracFonc").find('option:eq(0)').prop('selected', true);
            $("#Comp").find('option:eq(0)').prop('selected', true);

            if ($(this).val() == "TNI") {
                $("#numFonc").attr("disabled", true);
                $("#numFonc").trigger("liszt:updated");
                $("#indiceFonc").attr("disabled", true);
                $("#indiceFonc").trigger("liszt:updated");
                $("#fracFonc").attr("disabled", true);
                $("#fracFonc").trigger("liszt:updated");
                $("#Comp").attr("disabled", true);
                $("#Comp").trigger("liszt:updated");
            } else {
                $("#numFonc").attr("disabled", false);
                $("#numFonc").trigger("liszt:updated");
                $("#indiceFonc").attr("disabled", false);
                $("#indiceFonc").trigger("liszt:updated");
                $("#fracFonc").attr("disabled", false);
                $("#fracFonc").trigger("liszt:updated");
                $("#Comp").attr("disabled", false);
                $("#Comp").trigger("liszt:updated");
            }
        });

        document.getElementById('addCoord').onclick = function () {
            if (document.getElementById("RefFon").value == "") {
                alert("Veuillez sélectionner le type foncier");
            }
            else {
                if (document.getElementById("RefFon").value != "TNI") {

                    if ($('#numFonc').val() != "" && $('#indiceFonc').val() != "") {
                        $("#TableXY").css("background", "#98e99a69");
                        var TypeFonc = $('#RefFon').val();
                        var NumFonc = $('#numFonc').val();
                        var Indice = $('#indiceFonc').val();
                        var Fraction = $('#fracFonc').val();
                        var Complement = $('#Comp').val();
                        var refFonc = TypeFonc + "+" + NumFonc + "+" + Indice + "+" + Fraction + "+" + Complement;
                        var table = document.getElementById('tbodyCoord');
                        var row = table.insertRow(table.length);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        cell1.innerHTML = TypeFonc + "<input type='hidden' value='" + refFonc + "' name='titreF' class='form - control' />";
                        cell2.innerHTML = NumFonc;
                        cell3.innerHTML = Indice;
                        cell4.innerHTML = Fraction;
                        cell5.innerHTML = Complement;
                        var btn = document.createElement("input");
                        btn.setAttribute("id", refFonc);
                        btn.setAttribute("src", "../Content/documentation/img/del.png");
                        btn.setAttribute("type", "image");
                        btn.setAttribute("name", "delete");
                        btn.onclick = function (i) {
                            $(this).closest('tr').remove();

                        }
                        cell6.appendChild(btn);
                        $("#RefFon").find('option:eq(0)').prop('selected', true);
                        $("#numFonc").find('option:eq(0)').prop('selected', true);
                        $("#indiceFonc").find('option:eq(0)').prop('selected', true);
                        $("#fracFonc").find('option:eq(0)').prop('selected', true);
                        $("#Comp").find('option:eq(0)').prop('selected', true);
                        $("#RefFon").trigger("liszt:updated");
                        $("#numFonc").trigger("liszt:updated");
                        $("#indiceFonc").trigger("liszt:updated");
                        $("#fracFonc").trigger("liszt:updated");
                        $("#Comp").trigger("liszt:updated");

                        document.getElementById("l6").innerHTML = ""
                    } else {
                        alert("Veuillez ajouter le Numéro de foncier et l'indice! ");
                    }
                } else {
                    $("#TableXY").css("background", "#98e99a69");
                    var TypeFonc = $('#RefFon').val();
                    var NumFonc = $('#numFonc').val();
                    var Indice = $('#indiceFonc').val();
                    var Fraction = $('#fracFonc').val();
                    var Complement = $('#Comp').val();
                    var refFonc = TypeFonc + "+" + NumFonc + "+" + Indice + "+" + Fraction + "+" + Complement;
                    var table = document.getElementById('tbodyCoord');
                    var row = table.insertRow(table.length);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    cell1.innerHTML = TypeFonc + "<input type='hidden' value='" + refFonc + "' name='titreF' class='form - control' />";
                    cell2.innerHTML = NumFonc;
                    cell3.innerHTML = Indice;
                    cell4.innerHTML = Fraction;
                    cell5.innerHTML = Complement;
                    var btn = document.createElement("input");
                    btn.setAttribute("id", refFonc);
                    btn.setAttribute("src", "../Content/documentation/img/del.png");
                    btn.setAttribute("type", "image");
                    btn.setAttribute("name", "delete");
                    btn.onclick = function (i) {
                        $(this).closest('tr').remove();

                    }
                    cell6.appendChild(btn);
                    $("#RefFon").find('option:eq(0)').prop('selected', true);
                    $("#numFonc").find('option:eq(0)').prop('selected', true);
                    $("#indiceFonc").find('option:eq(0)').prop('selected', true);
                    $("#fracFonc").find('option:eq(0)').prop('selected', true);
                    $("#Comp").find('option:eq(0)').prop('selected', true);
                    $("#RefFon").trigger("liszt:updated");
                    $("#numFonc").trigger("liszt:updated");
                    $("#indiceFonc").trigger("liszt:updated");
                    $("#fracFonc").trigger("liszt:updated");
                    $("#Comp").trigger("liszt:updated");

                    document.getElementById("l6").innerHTML = ""

                }
            }

        };
        $("#Valider").click(function () {
            alert(89);
        });
    });