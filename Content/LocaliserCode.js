
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


