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
    "esri/SpatialReference",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/toolbars/draw",
    "esri/symbols/SimpleFillSymbol",
    "esri/dijit/Scalebar",
    "esri/geometry/Polygon",
    "esri/geometry/Point",
    "esri/dijit/HomeButton",
    "dojo/promise/all",
    "esri/dijit/editing/AttachmentEditor",
    "esri/dijit/Print",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "esri/tasks/PrintTemplate",
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
        SpatialReference,
        Graphic,
        SimpleMarkerSymbol,
        SimpleLineSymbol,
        Color,
        Draw,
        SimpleFillSymbol,
        Scalebar,
        Polygon,
        Point,
        HomeButton,
        all,
        AttachmentEditor,
        Print,
        PrintTask,
        PrintParameters,
        PrintTemplate
    ) {

        var scale;
        var mapp1;
        arcgisUtils.arcgisUrl = "http://geomatic.maps.arcgis.com/sharing/content/items";
        //var test = arcgisUtils.createMap("853c2cda0c1b4473a8fa93582305ca2d", "map").then(function (response) {
        var test = arcgisUtils.createMap("b2e943035d39479686312e65b0632b06", "map").then(function (response) {
            mapp1 = response.map;
            var scalebar = new Scalebar({
                map: mapp1,
                scalebarUnit: "english"
            });

            var sym2 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 0, 0]), 2), new Color([255, 255, 255, 0.15])
            );
            featureLayer_parcel = new FeatureLayer("https://localhost:6443/arcgis/rest/services/MODAURS/FeatureServer/0");
            q_parcel = new Query();
            q_parcel.outFields = ["*"];
            q_parcel.returnGeometry = true;
            q_parcel.where = 'objectid = ' + idParcel;
            featureLayer_parcel.queryFeatures(q_parcel, result_parcel);
            mapp1.graphics.clear();
            function result_parcel(featureSet_parc) {
                var featuresparcel = featureSet_parc.features;
                var graphic3 = new Graphic(featuresparcel[0].geometry, sym2);
                mapp1.graphics.add(graphic3);
                var extent = featuresparcel[0].geometry.getExtent().expand(5);
                mapp1.setExtent(extent);

                featureLayer_zonage = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/2", {
                    outFields: ["*"],
                    supportsAttachmentsByUploadId: true
                });

                q_zonage = new Query();

                featureLayer_secteur = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/1", {
                    outFields: ["*"],
                    supportsAttachmentsByUploadId: true
                });
                q_secteur = new Query();

                featureLayer_pa = new FeatureLayer("https://localhost:6443/arcgis/rest/services/NRUAURS/MapServer/0", {
                    outFields: ["*"],
                    supportsAttachmentsByUploadId: true
                });


                q_pa = new Query();
                q_zonage.outFields = q_secteur.outFields = q_pa.outFields = ["*"]
                q_zonage.returnGeometry = q_secteur.returnGeometry = q_pa.returnGeometry = true;
                q_zonage.geometry = q_secteur.geometry = q_pa.geometry = featuresparcel[0].geometry;
                var aZone = featureLayer_zonage.queryFeatures(q_zonage);
                var bSecteur = featureLayer_secteur.queryFeatures(q_secteur);
                var cPa = featureLayer_pa.queryFeatures(q_pa);
                var promisee = all([aZone, bSecteur, cPa]);
                promisee.then(resultZoneSecteur);
                function resultZoneSecteur(featureSetZS) {
                    var textZS = '';
                    var zoneText = '';
                    var secteurText = '';
                    var paText = '';
                    var features_Zone = featureSetZS[0].features;
                    var features_Secteur = featureSetZS[1].features;
                    var features_Pa = featureSetZS[2].features;
                    if (features_Pa.length == 1) { paText += features_Pa[0].attributes['nom']; }
                    if (features_Zone.length == 1) {
                        zoneText += 'en zone ' + features_Zone[0].attributes['zone'] + ',';
                    } else if (features_Zone.length > 1) {
                        zoneText += 'en zones ';
                        for (var i = 0; i < features_Zone.length - 1; i++) {
                            zoneText += features_Zone[i].attributes['zone'] + 'et';
                        }
                        zoneText += features_Zone[i].attributes['zone'] + ',';
                    }

                    if (features_Secteur.length == 1) {
                        secteurText += 'secteur ' + features_Secteur[0].attributes['secteur'] +
                            ' ( ' + features_Secteur[0].attributes['occupation_permise'] +
                            ' ;la hauteur et le nombre de niveaux applicables sont de ' + features_Secteur[0].attributes['hauteur_max'] +
                            ' et ' + features_Secteur[0].attributes['niveau_etage'] + ' ;la superficier et la largeur minimales des lots étant de ' +
                            features_Secteur[0].attributes['surface_mini'] + ' et ' + features_Secteur[0].attributes['largeur_min'] + ' ;';
                    } else if (features_Secteur.length > 1) {
                        secteurText += 'secteurs ';
                        for (var i = 0; i < features_Secteur.length - 1; i++) {
                            secteurText += features_Secteur[i].attributes['zone'] + 'et';
                        }
                        secteurText += features_Secteur[i].attributes['zone'] + ',';
                    }
                    document.getElementById('textDescript').value = secteurText;
                    document.getElementById('SaveModif').onclick = function () {
                        text1 = $("#textArea").val();
                        alert(secteurText);
                        var url = "https://portal.geomatic-online.ma/arcgis2/rest/services/MohcineNRU/ExportWebMapNRU/GPServer/Exporter%20une%20carte%20Web";
                        var printer = new PrintTask(url);
                        var params = new PrintParameters();
                        var template = new PrintTemplate();
                        //var params = new PrintParameters(); alert(mapp1);
                        //params.map = mapp1;
                        template.layout = "impression1";
                        // template.format = "PNG";   
                        template.preserveScale = true;
                        template.outScale = 900;
                        params.map = mapp1;
                        params.template = template;
                        printer.execute(params, function (result) {
                            var doc = new jsPDF();
                            var lineHeight = doc.getLineHeight(secteurText) / doc.internal.scaleFactor
                            var splittedText = doc.splitTextToSize(secteurText, 300)
                            var lines = splittedText.length  // splitted text is a string array
                            var blockHeight = lines * lineHeight
                            //doc.addImage(image1, 'PNG', 5, 5);
                            //doc.addImage(image, 'PNG', 80, 4);
                            //var date = new Date();
                            //var d = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                            //doc.setFontSize(8);
                            //doc.setFontType('bold');
                            //doc.text("N° " + NDemande + "/DPGU/DAJT/DATV", 20, 35);
                            //doc.text("Rabat, le " + d, 150, 35);
                            doc.setFont("times");
                            //doc.setFontSize(15);
                            //doc.setFontType("bolditalic");
                            //doc.text("A", 105, 55);
                            //doc.text(sexe + " " + nomPet, 75, 60);      
                            doc.setFontSize(10);
                            ////doc.text(features_view[0].attributes['nomPetitionnaireFrance'] ,90,65);
                            //doc.text('OBJET :', 25, 70);
                            //doc.setFontType("");
                            //doc.text('Note de renseignements urbanistiques relative au terrain objet du TF ' + typTerrain + ' sis .\n' + features_Pa[0].attributes['type_arrondissement'] + ' ' + features_Pa[0].attributes['arrondissement'] + ', Préfecture de ' + features_Pa[0].attributes['prefecture'], 45, 70);
                            //doc.setFontType("bolditalic");
                            //doc.text('REF     :', 25, 80);
                            //doc.setFontType("");
                            //doc.text('Votre demande en date du ' + d + ' du (R.N° ' + NDemande + ' ). ', 45, 80);
                            //doc.text('En réponse à votre demande citée en référence, j’ai l’honneur de vous faire connaître que d’après les', 45, 90, { maxWidth: 100, align: "justify" });
                            //doc.text('dispositions du plan d’aménagement communal de ' + paText + ', approuvé par décret n° 2-98-358 du 16 novembre \n1998 publié au Bulletin Officiel n° 4642 du 26 novembre 1998. le terrain en question est affecté ' + zoneText, 20, 94, { maxWidth: 100, align: "justify" }); doc.internal.write(0, "Tw");
                            //doc.text(splittedText, 20, 102, { maxWidth: 100, align: "justify" });
                            var text2 = "";
                            var k = 0;
                            var z = 0;
                            var ypos = 65;
                            for (var i = 0; i < text1.length; i++) {
                                if (text1[i] == "\n" && text1[i + 1] == "\n") {
                                    z = 0;
                                    doc.text(text2, 15, ypos, { maxWidth: 100, align: "justify" });
                                    text2 = "";
                                    k = 1;
                                } else {
                                    if (z == 0) {
                                        if (i == (text1.length - 1)) {
                                            doc.text(text2, 45, ypos, { maxWidth: 100, align: "justify" });
                                        } else {
                                            if (text2.length > 100 && text1[i] == " ") {
                                                z++;
                                                doc.text(text2, 45, ypos, { maxWidth: 100, align: "justify" });
                                                if (k == 1) {
                                                    ypos += 13;
                                                    k = 0;
                                                } else {
                                                    ypos += 5;
                                                }

                                                text2 = ""
                                            }
                                        }
                                    } else {
                                        if (i == (text1.length - 1)) {
                                            doc.text(text2, 15, ypos, { maxWidth: 100, align: "justify" });
                                        } else {
                                            if (text2.length > 120 && text1[i] == " ") {
                                                doc.text(text2, 15, ypos, { maxWidth: 100, align: "justify" });
                                                ypos += 5;
                                                text2 = ""
                                            }
                                        }
                                    }
                                }

                                text2 += text1[i]
                            }
                            //var ypos = 100 + blockHeight;
                            //doc.text('Ainsi, vous trouverez ci-joint une copie de la réglementation urbanistique et un extrait du plan', 45, 100 + blockHeight, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight - 2;
                            //doc.text('d’aménagement du terrain considéré.', 20, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight;
                            //doc.text('De même, il convient de signaler que le nouveau projet de plan d’aménagement unifié de Rabat a été ', 45, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight - 2;
                            //doc.text('soumis à l’examen du Comité Local, dans le cadre des consultations interservices, conformément aux dispositions de \nl’article 20 du décret n° 2-92-832 du 14 octobre 1993 pris pour l’application de la loi n° 12-90 relative à l’Urbanisme.', 20, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight + 5;
                            //doc.text('Par ailleurs, il est à préciser que la présente note de renseignements est délivrée sur la base des données', 45, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight - 2;
                            //doc.text('disponibles à cette Agence Urbaine et ne peut, donc attester de leur véracité et n’équivaut, en aucun cas, à un accord de \nprincipe pour la réalisation d’un quelconque projet, lequel doit respecter :', 20, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight + 5;
                            //doc.text('-Les dispositions de loi n° 12-90 relative à l’Urbanisme, promulguée par le dahir n° 1-92-31 \ndu 15 hija 1412 (17 juin 1992) et son décret d’application ;', 55, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight + 3;
                            //doc.text('-Les dispositions de la loi n° 25-90 relative aux lotissements, groupes d’habitations et \nmorcellements, promulguée par le dahir n° 1-92-7 du 15 hija 1412 (17 juin 1992) et son \ndécret d’application ;', 55, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight + 6;
                            //doc.text('-Les alignements communaux ;', 55, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight;
                            //doc.text('-Les lotissements et les groupes d’habitations approuvés et leurs cahiers des charges.', 55, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight;
                            //doc.text('-et de manière générale, satisfaire aux lois et règlements en vigueur.', 55, ypos, { maxWidth: 100, align: "justify" });
                            //ypos += lineHeight;
                            //doc.text('Veuillez agréer l’expression de mes salutations distinguées.', 45, ypos, { maxWidth: 100, align: "justify" });
                            //doc.setFontType("bold");
                            //ypos += lineHeight;
                            //doc.text('Pour La Directrice Générale et P.O', 140, ypos, { maxWidth: 100, align: "justify" });
                            //doc.text('EN-PR-R3B-00-05', 200, 240, null, -90);
                            //doc.addImage(image, 'PNG', 40, 280);
                            //string = doc.output('datauristring');                        
                            ////document.getElementById("NRUDiv").innerHTML = '<div><object style="height:780px; width:100%; !important;" type="text/html" data="' + string + '" ></object></div>';
                            //document.getElementById("NRUDiv").innerHTML = '<div><iframe style="height:780px; width:100%; !important;" type="text/html" src="' + string + '" ></iframe></div>';
                            var img = new Image;
                            img.onload = function () {
                                doc.addPage();//doc.addImage(image1, 'PNG', 5, 5);
                                //doc.addImage(image, 'PNG', 80, 4);
                                doc.addImage(this, 0, 2);
                                //doc.setFontSize(14);
                                //doc.setFontType('bold');
                                //doc.text("Carte de situation", 90, 60);
                                // doc.save('Informations_urbanistiques.pdf');
                                // string = doc.output('datauristring');
                                var blob = doc.output("blob");
                                console.log(blob);
                                // window.open(URL.createObjectURL(blob));
                                //var img = "<img src='" + string + "' />";
                                //console.log(string);
                                document.getElementById("NRUDiv").innerHTML = '<div><object style="height:780px; width:100%" type="application/pdf" data="' + URL.createObjectURL(blob) + '" ></object></div>';
                                // document.getElementById("NRUDiv").innerHTML = '<div><iframe style="height:780px; width:100%"  src="C:/Users/user/Downloads/SGIPM_PV2_(11_12-2018).doc" ></iframe></div>';
                            }
                            img.crossOrigin = "";
                            img.src = result.url;
                        }, function (error) {
                            alert(22);
                            console.log('error: ', error);
                        });
                    }

                    var url = "https://portal.geomatic-online.ma/arcgis2/rest/services/MohcineNRU/ExportWebMapNRU/GPServer/Exporter%20une%20carte%20Web";
                    var printer = new PrintTask(url);
                    var params = new PrintParameters();
                    var template = new PrintTemplate();
                    //var params = new PrintParameters(); alert(mapp1);
                    //params.map = mapp1;
                    template.layout = "impression1";
                    // template.format = "PNG";   
                    template.preserveScale = true;
                    template.outScale = 900;
                    params.map = mapp1;
                    params.template = template;
                    console.log(printer);
                    printer.execute(params, function (result) {
                        var doc = new jsPDF();
                        var lineHeight = doc.getLineHeight(secteurText) / doc.internal.scaleFactor
                        var splittedText = doc.splitTextToSize(secteurText, 300)
                        var lines = splittedText.length; // splitted text is a string array
                        var blockHeight = lines * 10;
                        var text1 = "Ainsi, vous trouverez ci-joint une copie de la réglementation urbanistique et un extrait du plan d’aménagement du terrain considéré \n\n De même, il convient de signaler que le nouveau projet de plan d’aménagement unifié de Rabat a été" +
                            " soumis à l’examen du Comité Local, dans le cadre des consultations interservices, conformément aux dispositions de l’article 20 du décret n° 2-92-832 du 14 octobre 1993 pris pour l’application de la loi n° 12-90 relative à l’Urbanisme." +
                            "\n\n Par ailleurs, il est à préciser que la présente note de renseignements est délivrée sur la base des données disponibles à cette Agence Urbaine et ne peut, donc attester de leur véracité et n’équivaut, en aucun cas, à un accord de principe pour la réalisation d’un quelconque projet, lequel doit respecter : " +
                            "- Les dispositions de loi n° 12 - 90 relative à l’Urbanisme, promulguée par le dahir n° 1 - 92 - 31 \ndu 15 hija 1412(17 juin 1992) et son décret d’application;";
                        $("#textArea").val(text1);
                        var splittedText1 = doc.splitTextToSize(text1, 300);
                        doc.setFont("times");
                        doc.setFontSize(10);
                        //doc.text(text1, 45, 45, { maxWidth: 100, align: "justify" });
                        var text2 = "";
                        var k = 0;
                        var z = 0;
                        var ypos = 65;
                        for (var i = 0; i < text1.length; i++) {
                            if (text1[i] == "-") {
                                text2 += text1[i]
                            }
                            if (text1[i] == "\n" && text1[i + 1] == "\n") {
                                z = 0;
                                doc.text(text2, 15, ypos, { maxWidth: 100, align: "justify" });
                                text2 = "";
                                k = 1;
                            } else {
                                if (z == 0) {
                                    if (i == (text1.length - 1)) {
                                        doc.text(text2, 45, ypos, { maxWidth: 100, align: "justify" });
                                    } else {
                                        if (text2.length > 100 && text1[i] == " ") {
                                            z++;
                                            doc.text(text2, 45, ypos, { maxWidth: 100, align: "justify" });
                                            if (k == 1) {
                                                ypos += 13;
                                                k = 0;
                                            } else {
                                                ypos += 5;
                                            }

                                            text2 = ""
                                        }
                                    }
                                } else {
                                    if (i == (text1.length - 1)) {
                                        doc.text(text2, 15, ypos, { maxWidth: 100, align: "justify" });
                                    } else {
                                        if (text2.length > 120 && text1[i] == " ") {
                                            doc.text(text2, 15, ypos, { maxWidth: 100, align: "justify" });
                                            ypos += 5;
                                            text2 = ""
                                        }
                                    }
                                }
                            }

                            text2 += text1[i]
                        }



                        //doc.addImage(image1, 'PNG', 5, 5);
                        //doc.addImage(image, 'PNG', 80, 4);
                        //var date = new Date();
                        //var d = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                        //doc.setFontSize(8);
                        //doc.setFontType('bold');
                        //doc.text("N° " + NDemande + "/DPGU/DAJT/DATV", 20, 35);
                        //doc.text("Rabat, le " + d, 150, 35);
                        //doc.setFont("times");
                        //doc.setFontSize(15);
                        //doc.setFontType("bolditalic");
                        //doc.text("A", 105, 55);
                        //doc.text(sexe+" "+nomPet, 75, 60);                        
                        //doc.setFontSize(10);                        
                        //doc.text('OBJET :', 25, 70);
                        //doc.setFontType("");
                        //doc.text('Note de renseignements urbanistiques relative au terrain objet du TF ' + typTerrain + ' sis .\n' + features_Pa[0].attributes['type_arrondissement'] + ' ' + features_Pa[0].attributes['arrondissement'] + ', Préfecture de ' + features_Pa[0].attributes['prefecture'], 45, 70);
                        //doc.setFontType("bolditalic");
                        //doc.text('REF     :', 25, 80);
                        //doc.setFontType("");
                        //doc.text('Votre demande en date du ' + d + ' du (R.N° ' + NDemande + ' ). ', 45, 80);
                        //doc.text('En réponse à votre demande citée en référence, j’ai l’honneur de vous faire connaître que d’après les', 45, 90, { maxWidth: 100, align: "justify" });
                        //doc.text('dispositions du plan d’aménagement communal de ' + paText + ', approuvé par décret n° 2-98-358 du 16 novembre \n1998 publié au Bulletin Officiel n° 4642 du 26 novembre 1998. le terrain en question est affecté ' + zoneText, 20, 94, { maxWidth: 100, align: "justify" }); doc.internal.write(0, "Tw");
                        //doc.text(splittedText, 20, 102);
                        //var ypos = 100 + blockHeight;
                        //var dd = doc.text(splittedText1, 45, ypos, { maxWidth: 100, align: "justify" });
                        //alert(dd);
                        //console.log(dd);
                        //ypos += lineHeight - 2;
                        //doc.text('d’aménagement du terrain considéré.', 20, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight;
                        //doc.text('De même, il convient de signaler que le nouveau projet de plan d’aménagement unifié de Rabat a été ', 45, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight - 2;
                        //doc.text('soumis à l’examen du Comité Local, dans le cadre des consultations interservices, conformément aux dispositions de \nl’article 20 du décret n° 2-92-832 du 14 octobre 1993 pris pour l’application de la loi n° 12-90 relative à l’Urbanisme.', 20, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight + 5;
                        //doc.text('Par ailleurs, il est à préciser que la présente note de renseignements est délivrée sur la base des données', 45, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight - 2;
                        //doc.text('disponibles à cette Agence Urbaine et ne peut, donc attester de leur véracité et n’équivaut, en aucun cas, à un accord de \nprincipe pour la réalisation d’un quelconque projet, lequel doit respecter :', 20, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight + 5;
                        //doc.text('-Les dispositions de loi n° 12-90 relative à l’Urbanisme, promulguée par le dahir n° 1-92-31 \ndu 15 hija 1412 (17 juin 1992) et son décret d’application ;', 55, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight + 3;
                        //doc.text('-Les dispositions de la loi n° 25-90 relative aux lotissements, groupes d’habitations et \nmorcellements, promulguée par le dahir n° 1-92-7 du 15 hija 1412 (17 juin 1992) et son \ndécret d’application ;', 55, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight + 6;
                        //doc.text('-Les alignements communaux ;', 55, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight;
                        //doc.text('-Les lotissements et les groupes d’habitations approuvés et leurs cahiers des charges.', 55, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight;
                        //doc.text('-et de manière générale, satisfaire aux lois et règlements en vigueur.', 55, ypos, { maxWidth: 100, align: "justify" });
                        //ypos += lineHeight;
                        //doc.text('Veuillez agréer l’expression de mes salutations distinguées.', 45, ypos, { maxWidth: 100, align: "justify" });
                        //doc.setFontType("bold");
                        //ypos += lineHeight;
                        //doc.text('Pour La Directrice Générale et P.O', 140, ypos, { maxWidth: 100, align: "justify" });
                        //doc.text('EN-PR-R3B-00-05', 200, 240, null, -90);
                        //doc.addImage(image, 'PNG', 40, 280);
                        //string1 = doc.output('datauristring');                       

                        //myBlob = doc.output('blob');
                        //var myFile = new File([myBlob], "NRU.pdf");
                        //const dT = new ClipboardEvent('').clipboardData || new DataTransfer();
                        //dT.items.add(myFile);
                        //document.getElementById("fileNRU").files = dT.files;
                        //document.getElementById("NRUDiv").innerHTML = '<div><object style="height:780px; width:100%" type="text/html" data="' + string + '" ></object></div>';
                        var img = new Image;
                        img.onload = function () {
                            doc.addPage();
                            doc.addImage(this, 0, 2);
                            var blob = doc.output("blob");
                            console.log(blob);
                            document.getElementById("NRUDiv").innerHTML = '<div><object style="height:780px; width:100%" type="application/pdf" data="' + URL.createObjectURL(blob) + '" ></object></div>';
                        }
                        img.crossOrigin = "";
                        img.src = result.url;
                    }, function (error) {
                        alert(22);
                        console.log('error: ', error);
                    });
                }
            }

        });



        //test.then(function () {
        //    alert(mapp1);

        //    var printUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
        //    var printTask = new PrintTask(printUrl);
        //    var params = new PrintParameters();
        //    //console.log(mapp1);
        //    //console.log(mapp1.type);
        //    // alert(test);
        //    console.log(mapp1);
        //    params.map = mapp1;

        //    printTask.execute(params, printResult, printError); alert(1);
        //    function printResult(result) {
        //        alert(555);
        //    }

        //    function printError(e) {
        //        console.log(e);
        //    }
        //})

    });

