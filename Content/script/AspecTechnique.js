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

        //document.getElementById('AjouterSurface').onclick = function () {
        //    var Niveau = document.getElementById('TxtSurface').value;
        //    var Surface = document.getElementById('Comm').selectedOptions[0].text;

        //    var table = document.getElementById('tbodySurface');
        //    var row = table.insertRow(table.length);
        //    var cell1 = row.insertCell(0);
        //    var cell2 = row.insertCell(1);

        //    cell1.innerHTML = Surface;
        //    cell2.innerHTML = Niveau;

        //};


        var arrayNivSuper = [];
        $("#AjouterSurface").click(function () {
            var value = $("#Comm").val();
            var Niveau = document.getElementById('Comm').selectedOptions[0].text;
            var Surface = document.getElementById('TxtSurface').value;
            var table = document.getElementById('tbodySurface');
            if (value != "") {
                arrayNivSuper.push(value);
                var row = table.insertRow(table.length);
                row.setAttribute("id", value)
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML = Niveau + "<input type='hidden' value='" + Niveau + "+" + Surface + "' name='ListNivSup'/>";
                cell2.innerHTML = Surface;

                var btn = document.createElement("input");
                btn.setAttribute("id", value);
                btn.setAttribute("niv", Niveau);
                btn.setAttribute("sup", Surface);
                btn.setAttribute("src", "../Content/documentation/img/del.png");
                btn.setAttribute("type", "image");
                btn.setAttribute("name", "update");
                btn.onclick = function () {
                    $("#TxtSurface").append("<option value='" + value + "' niv='" + Niveau + "' sup = '" + Surface + "' >" + Niveau + " " + Surface + "</option>")
                    $("#TxtSurface").trigger("liszt:updated");
                    $(this).closest('tr').remove();
                }
                cell3.appendChild(btn);
                $("#TxtSurface option[value='" + value + "']").remove();
                $("#TxtSurface").trigger("liszt:updated");

            } else {
                alert("Merci de selectionner un niveau");
            }
        });


    }
);