$(document).ready(function () {
    $("#ListOfModulesId").chosen({
        disable_search: false,
        create_option: true,
        persistent_create_option: true,
        skip_no_results: true,
        placeholder_text_single: "-------- Indice --------",
        no_results_text: "Aucun résultat ne correspond"
    });
    $("#submoduleSelectedId").chosen({
        disable_search: false,
        create_option: true,
        persistent_create_option: true,
        skip_no_results: true,
        placeholder_text_single: "-------- Indice --------",
        no_results_text: "Aucun résultat ne correspond"
    });
    $("#tacheSelectedId").chosen({
        disable_search: false,
        create_option: true,
        persistent_create_option: true,
        skip_no_results: true,
        placeholder_text_single: "-------- Indice --------",
        no_results_text: "Aucun résultat ne correspond"
    });

    $('#ListOfModulesId').change(function () {

        var e = document.getElementById("ListOfModulesId");
        var choix = e.options[e.selectedIndex].value;
        var Modulee = $(this).val();
        var com = $("#submoduleSelectedId > option");
        $("#submoduleSelectedId")[0].selectedIndex = 0;
        $("#tacheSelectedId")[0].selectedIndex = 0;
        var a = com[0].getAttribute("name");
        for (var i = 0; i < com.length; i++) {
            if (com[i].getAttribute("name") == Modulee || a == choix || a == -11) {
                com[i].style.display = "block";
            }
            else {
                com[i].style.display = "none";
            }
        }
        $('#submoduleSelectedId').trigger("liszt:updated");

    });

    $('#submoduleSelectedId').change(function () {

        var e = document.getElementById("submoduleSelectedId");
        var choix = e.options[e.selectedIndex].value;
        var SubModulee = $(this).val();
        var com = $("#tacheSelectedId > option");
        $("#tacheSelectedId")[0].selectedIndex = 0;
        var a = com[0].getAttribute("name");
        for (var i = 0; i < com.length; i++) {
            if (com[i].getAttribute("name") == SubModulee || a == choix || a == -111) {
                com[i].style.display = "block";
            }
            else {
                com[i].style.display = "none";
            }
        }
        $('#tacheSelectedId').trigger("liszt:updated");

    });

});

$("body").on("click", "#buttonSubmitModule", function () {
    var module = {};
    var ModuleName = $('input[name="ModuleName"]').val();
    var ModuleDescription = $('textarea[name="ModuleDescription"]').val();
    module.ModuleName = ModuleName;
    module.ModuleDescription = ModuleDescription;
    //alert(ModuleName+"  "+ModuleDescription);
    $.ajax({
        type: "POST",
        url: "/Home/AddModulePartiale",
        data: JSON.stringify(module),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("record inserted.");
            $('input[name="ModuleName"]').val(''); $('textarea[name="ModuleDescription"]').val('');
            $(".close").click();
            $('#ListOfModulesId').empty();
            $('#ListOfModulesId').append("<option value=-1>--- Sélectionner un module ---</option>")
            $('#submodulemodulepopup').empty();
            $('#submodulemodulepopup').append("<option value=-1>--- Sélectionner un module ---</option>")
            $.each(data.mdles, function (i, item) {
                $('#ListOfModulesId').append("<option value='" + item.ModuleId + "'>" + item.ModuleName + "</option>")
                $('#submodulemodulepopup').append("<option value='" + item.ModuleId + "'>" + item.ModuleName + "</option>")
            });
            //$('#ListOfModulesId').val(data.petitID);
            $('#ListOfModulesId').trigger("liszt:updated");
            $('#submodulemodulepopup').trigger("liszt:updated");
        },
        error: function () {
            alert("error.");
        }
    });
});

$("body").on("click", "#buttonSubmitSubModule", function () {
    var sousmodule = {};
    var SousModuleName = $('input[name="SousModuleName"]').val();
    var SousModuleDescription = $('textarea[name="SousModuleDescription"]').val();
    var ModuleId = $('#submodulemodulepopup').children("option:selected").val();
    sousmodule.SousModuleName = SousModuleName;
    sousmodule.SousModuleDescription = SousModuleDescription;
    sousmodule.ModuleId = ModuleId;
    //alert(ModuleName+"  "+ModuleDescription);
    $.ajax({
        type: "POST",
        url: "/Home/AddSubModulePartiale",
        data: JSON.stringify(sousmodule),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("record inserted.");
            $('input[name="SousModuleName"]').val('');
            $('textarea[name="SousModuleDescription"]').val('');
            $(".close").click();
            $('#submoduleSelectedId').empty();
            $('#submoduleSelectedId').append("<option value=-11>--- Sélectionner un Sous module ---</option>");
            $('#ListOfSubModulesIdPopup').empty();
            $('#ListOfSubModulesIdPopup').append("<option value=-11>--- Sélectionner un Sous module ---</option>");
            $.each(data.smdles, function (i, item) {
                $('#submoduleSelectedId').append("<option value='" + item.SousModuleId + "'  name='" + item.ModuleId + "'  style='display:none'>" + item.SousModuleName + "</option>");
                $('#ListOfSubModulesIdPopup').append("<option value='" + item.SousModuleId + "'  name='" + item.ModuleId + "'>" + item.SousModuleName + "</option>");
            });
            //$('#ListOfModulesId').val(data.petitID);
            $('#submoduleSelectedId').trigger("liszt:updated");
            $('#ListOfSubModulesIdPopup').trigger("liszt:updated");
        },
        error: function () {
            alert("error.");
        }
    });
});

$("body").on("click", "#buttonSubmitTache", function () {
    var role = {};
    var Name = $('input[name="Name"]').val();
    var RoleDescription = $('textarea[name="RoleDescription"]').val();
    var SouModuleId = $('#ListOfSubModulesIdPopup').children("option:selected").val();
    role.Name = Name;
    role.RoleDescription = RoleDescription;
    role.SouModuleId = SouModuleId;
    //alert(ModuleName+"  "+ModuleDescription);
    $.ajax({
        type: "POST",
        url: "/Home/AddTachePartiale",
        data: JSON.stringify(role),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("record inserted.");
            $('input[name="Name"]').val('');
            $('textarea[name="RoleDescription"]').val('');
            $(".close").click();
            $('#tacheSelectedId').empty();
            $('#tacheSelectedId').append("<option value=-111>--- Sélectionner une tâche ---</option>");
            $.each(data.roles, function (i, item) {
                $('#tacheSelectedId').append("<option value='" + item.Id + "'  name='" + item.SouModuleId + "'  style='display:none'>" + item.Name + "</option>");
            });
            //$('#ListOfModulesId').val(data.petitID);
            $('#tacheSelectedId').trigger("liszt:updated");
        },
        error: function () {
            alert("error.");
        }
    });
});




function LireCheckBox(checkbox, iden) {
    if (checkbox.checked == false) {
        document.getElementById("Cree_" + iden).checked = false;
        document.getElementById("Modifier_" + iden).checked = false;
        document.getElementById("Supprimer_" + iden).checked = false;

        document.getElementById("Read_" + iden).value = false;
        document.getElementById("Create_" + iden).value = false;
        document.getElementById("Update_" + iden).value = false;
        document.getElementById("Delete_" + iden).value = false;
    }
    else {
        document.getElementById("Read_" + iden).value = true;

    }

}

function cudCheckBox(checkbox, iden, action) {
    if (checkbox.checked == true) {

        var checkread = document.getElementById("Lire_" + iden);
        checkread.checked = true;
        document.getElementById("Read_" + iden).value = true;

        document.getElementById(action + iden).value = true;

    }
    else {
        document.getElementById(action + iden).value = false;
    }
}

function deleteRow(id) {
    if (confirm("Volez vous vraiment revoquer le role!")) {
        var element = document.getElementById("row" + id);
        element.parentNode.removeChild(element);
    }
    return true;
}

function returnLab() {
    var labe = document.createElement("LABEL");
    labe.className = "be-checkbox custom-control custom-checkbox";
    return labe;
}

function returnSPAN() {
    var spanne = document.createElement("SPAN");
    spanne.className = "custom-control-label";
    return spanne;
}

function explodeString(chaine, sep) {
    var newStr = chaine.split(sep);
    var stinng = "";
    for (i = 0; i < newStr.length; i++) {
        stinng += newStr[i];
    }
    return stinng;

}

function returnHidden(id, name, value) {

    var elmnt = document.createElement("INPUT");
    elmnt.setAttribute("id", id);
    elmnt.setAttribute("name", name);
    elmnt.setAttribute("value", value);
    elmnt.setAttribute("type", "hidden");
    return elmnt;
}
