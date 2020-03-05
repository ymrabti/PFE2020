
document.getElementById("ListZonage").onchange = function () {

    featureLayer_Commune = new FeatureLayer("https://services3.arcgis.com/hjUMsSJ87zgoicvl/ArcGIS/rest/services/NRUAURS/FeatureServer/2");
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