
$("body").on("click", "#ButtonSubmitStatutPUP", function () {
    var Statut = {};
    var StatutName = $('input[name="StatutName"]').val();
    var StatutDescription = $('textarea[name="StatutDescription"]').val();
    Statut.StatutName = StatutName;
    Statut.StatutDescription = StatutDescription;
    //alert(ModuleName+"  "+ModuleDescription);
    $.ajax({
        type: "POST",
        url: "/Home/AddStatutPartiale",
        data: JSON.stringify(Statut),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("record inserted.");
            $('input[name="StatutName"]').val(''); $('textarea[name="StatutDescription"]').val('');
            $(".close").click();
            $('#StatutId').empty();
            $('#StatutId').append("<option value=''>--- Sélectionner un Statut ---</option>")
            $.each(data.statutss, function (i, item) {
                $('#StatutId').append("<option value='" + item.StatutId + "'>" + item.StatutName + "</option>")
            });
            //$('#ListOfModulesId').val(data.petitID);
            $('#StatutId').trigger("liszt:updated");
        },
        error: function () {
            alert("error !!");
        }
    });
});
