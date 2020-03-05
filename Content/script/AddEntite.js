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


        document.getElementById('Comm').onchange = function () {
            console.log(this);

            //document.getElementById('TxtCodeCommune').value = this.selectedOptions(0);
        };

        document.getElementById('idNat').onchange = function () {

            if (this.value == 5) {
                document.getElementById('DivNbNiveau').style.display = 'block';

            }
            else {
                document.getElementById('DivNbNiveau').style.display = 'none';

            }


            if (this.value == 'Autres(A Préciser)') {

                document.getElementById('PrecAutre').style.display = 'block';
            }
            else {
                document.getElementById('PrecAutre').style.display = 'none';
            }


            //document.getElementById('TxtCodeCommune').value = this.selectedOptions(0);
        };

        //document.getElementById('btnArchitecte').onclick = function () {
        //    var btnValue = document.getElementById('btnArchitecte').value;

        //    if (btnValue == 1) {
        //        document.getElementById('divArchitecte').style.display = "none";
        //        document.getElementById('btnArchitecte').value = 0;
        //        document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/plusicon.png');
        //    } else if (btnValue == 0) {
        //        document.getElementById('divArchitecte').style.display = "block";
        //        document.getElementById('btnArchitecte').value = 1;
        //        document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/minusicon.png');
        //    }
        //};

        document.getElementById('btnPetitionnaire').onclick = function () {
            var btnValue = document.getElementById('btnPetitionnaire').value;
            if (btnValue == 1) {
                document.getElementById('divPetitionnaire').style.display = "none";
                document.getElementById('btnPetitionnaire').value = 0;
                document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/plusicon.png');
            } else if (btnValue == 0) {
                document.getElementById('divPetitionnaire').style.display = "block";
                document.getElementById('btnPetitionnaire').value = 1;
                document.getElementById('imgbtnPetitionnaire').setAttribute('src', '../Content/documentation/img/minusicon.png');
            }
        };

        document.getElementById('btnTopo').onclick = function () {
            var btnValue = document.getElementById('btnTopo').value;
            if (btnValue == 1) {
                document.getElementById('divTopo').style.display = "none";
                document.getElementById('btnTopo').value = 0;
                document.getElementById('imgbtnTopo').setAttribute('src', '../Content/documentation/img/plusicon.png');
            } else if (btnValue == 0) {
                document.getElementById('divTopo').style.display = "block";
                document.getElementById('btnTopo').value = 1;
                document.getElementById('imgbtnTopo').setAttribute('src', '../Content/documentation/img/minusicon.png');
            }
        };





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
        var arrayArch = [];
        $("#btnArchitecte").click(function () {
            var value = $("#ArchLIST").val();
            var cinArchitect = $('#ArchLIST option:selected').attr('cin');
            var nomArchitect = $('#ArchLIST option:selected').attr('nom');
            var prenomArchitect = $('#ArchLIST option:selected').attr('prenom');
            var table = document.getElementById('tableArch');
            if (value != "") {
                arrayArch.push(value);
                var row = table.insertRow(table.length);
                row.setAttribute("id", value)
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                cell1.innerHTML = arrayArch.length + "<input type='hidden' value='" + value + "' name='ListArch'/>";
                cell2.innerHTML = nomArchitect;
                cell3.innerHTML = prenomArchitect;
                cell4.innerHTML = cinArchitect;

                var btn = document.createElement("input");
                btn.setAttribute("id", value);
                btn.setAttribute("nom", nomArchitect);
                btn.setAttribute("prenom", prenomArchitect);
                btn.setAttribute("src", "../Content/documentation/img/del.png");
                btn.setAttribute("type", "image");
                // btn.setAttribute("alt", "button");
                btn.setAttribute("name", "update");
                btn.onclick = function () {
                    $("#ArchLIST").append("<option value='" + value + "' cin='" + cinArchitect + "' nom = '" + nomArchitect + "' prenom = '" + prenomArchitect + "'>" + cinArchitect + " " + nomArchitect + " " + prenomArchitect + "</option>")
                    $("#ArchLIST").trigger("liszt:updated");
                    $(this).closest('tr').remove();
                }
                cell5.appendChild(btn);
                $("#ArchLIST option[value='" + value + "']").remove();
                $("#ArchLIST").trigger("liszt:updated");

            } else {
                alert("Merci de selectionner un Architect");
            }
        });

        var arrayTopo = [];
        $("#btnTopo").click(function () {
            var value = $("#topoLIST1").val();
            var cinTopo = $('#topoLIST1 option:selected').attr('cin');
            var nomTopo = $('#topoLIST1 option:selected').attr('nom');
            var prenomTopo = $('#topoLIST1 option:selected').attr('prenom');
            var table = document.getElementById('tableTopo');
            if (value != "") {
                arrayTopo.push(value);
                var row = table.insertRow(table.length);
                row.setAttribute("id", value)
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);

                cell1.innerHTML = arrayTopo.length + "<input type='hidden' value='" + value + "' name='ListTopo'/>";
                cell2.innerHTML = nomTopo;
                cell3.innerHTML = prenomTopo;
                cell4.innerHTML = cinTopo;

                var btn = document.createElement("input");
                btn.setAttribute("id", value);
                btn.setAttribute("nom", nomTopo);
                btn.setAttribute("prenom", prenomTopo);
                btn.setAttribute("src", "../Content/documentation/img/del.png");
                btn.setAttribute("type", "image");
                // btn.setAttribute("alt", "button");
                btn.setAttribute("name", "update");
                btn.onclick = function () {
                    $("#topoLIST1").append("<option value='" + value + "' cin='" + cinTopo + "' nom = '" + nomTopo + "' prenom = '" + prenomTopo + "'>" + cinTopo + " " + nomTopo + " " + prenomTopo + "</option>")
                    $("#topoLIST1").trigger("liszt:updated");
                    $(this).closest('tr').remove();
                }
                cell5.appendChild(btn);

                $("#topoLIST1 option[value='" + value + "']").remove();
                $("#topoLIST1").trigger("liszt:updated");

            } else {
                alert("Merci de selectionner un Topographe");
            }
        });

        var arrayPet = [];
        $("#btnPetitionnaire").click(function () {
            var value = $("#Pet").val();
            var cinPetit = $('#Pet option:selected').attr('cin');
            var nomPetit = $('#Pet option:selected').attr('nom');
            var prenomPetit = $('#Pet option:selected').attr('prenom');
            var table = document.getElementById('tablePetit');
            if (value != "") {
                arrayPet.push(value);
                var row = table.insertRow(table.length);
                row.setAttribute("id", value)
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                cell1.innerHTML = arrayPet.length + "<input type='hidden' value='" + value + "' name='ListPetit'/>";
                cell2.innerHTML = nomPetit;
                cell3.innerHTML = prenomPetit;
                cell4.innerHTML = cinPetit;

                var btn = document.createElement("input");
                btn.setAttribute("id", value);
                btn.setAttribute("nom", nomPetit);
                btn.setAttribute("prenom", prenomPetit);
                btn.setAttribute("src", "../Content/documentation/img/del.png");
                btn.setAttribute("type", "image");
                btn.setAttribute("name", "update");
                btn.onclick = function () {
                    $("#Pet").append("<option value='" + value + "' cin='" + cinPetit + "' nom = '" + nomPetit + "' prenom = '" + prenomPetit + "'>" + cinPetit + " " + nomPetit + " " + prenomPetit + "</option>")
                    $("#Pet").trigger("liszt:updated");
                    $(this).closest('tr').remove();
                }
                cell5.appendChild(btn);
                $("#Pet option[value='" + value + "']").remove();
                $("#Pet").trigger("liszt:updated");

            } else {
                alert("Merci de selectionner un Topographe");
            }
        });

    }
);