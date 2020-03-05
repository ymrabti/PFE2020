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
  "esri/geometry/Polygon",
  "esri/geometry/Point",
  "esri/dijit/HomeButton",   
  "dojo/domReady!"
  ],
  function(
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
      Polygon,
      Point,
      HomeButton
  ) {

/*
      var map = new Map("map", {
      basemap: "streets",
      autoResize: "autoResize",
      center: [-7, 35.6122],
      zoom: 5
      });*/
      
      var map ;
      var array = []; 
       arcgisUtils.arcgisUrl = "https://portal.geomatic-online.ma/arcgis/sharing/content/items";
       arcgisUtils.createMap("4b5e81bda0c44c34b94007ace884bfc2", "map").then(function (response) {
       //update the app
       // dom.byId("title").innerHTML = response.itemInfo.item.title;
       // dom.byId("subtitle").innerHTML = response.itemInfo.item.snippet;

        map = response.map;
        //add the scalebar
        /* var scalebar = new Scalebar({
          map: map,
          scalebarUnit: "english"
        });

        //add the legend. Note that we use the utility method getLegendLayers to get
        //the layers to display in the legend from the createMap response.
        var legendLayers = arcgisUtils.getLegendLayers(response);
        var legendDijit = new Legend({
          map: map,
          layerInfos: legendLayers
        }, "legend");
        legendDijit.startup();*/
      });

  /****************************************************************
   * Add feature layer - A FeatureLayer at minimum should point
   * to a URL to a feature service or point to a feature collection 
   * object.
   ***************************************************************/

  // Carbon storage of trees in Warren Wilson College.   
      var xCenteroidF;
      var yCenteroidF;
       
      document.getElementById('selRef').onchange = function(){
         
          var typeFonc = document.getElementById('selRef').value;
          var numFonc = document.getElementById('numfonc').value;
          var indice = document.getElementById('indice').value; 
          document.getElementById('indice').disabled = false;         
          if(typeFonc == 'TI'){              
              document.getElementById('coordInputs').style.display = 'none';
              document.getElementById('refInputs').style.display = 'block';
              
          }else if(typeFonc == 'R'){
              document.getElementById('coordInputs').style.display = 'none';
              document.getElementById('refInputs').style.display = 'block';
              document.getElementById('indice').disabled = true;
              document.getElementById('indice').value = "";

          }else if(typeFonc == 'TNI'){
              document.getElementById('coordInputs').style.display = 'block';
              document.getElementById('refInputs').style.display = 'none';
          }
      }

      document.getElementById('localiser').onclick = function()
      {       
          var typeFonc = document.getElementById('selRef').value;
          var numFonc = document.getElementById('numfonc').value;
          var indice = document.getElementById('indice').value; 
          map.graphics.clear();
          if(typeFonc != ""){
                  if(array.length!=0){
                      if(array.length == 1){
                          var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                              new Color([255,0,0]), 1),
                              new Color([0,255,0,0.25]));
                          map.graphics.clear();
                          var pt = new Point(array[0][0],array[0][1]);                
                          var graphic2 = new Graphic(pt,sym);
                          map.graphics.add(graphic2);
                      // var extent = pt.getExtent().expand(2);
                          map.centerAndZoom(pt,17);

                      }else{
                          var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                          new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                          new Color([255,0,0]), 2),new Color([255,255,255,0.15])
                          );
                          map.graphics.clear();                          
                          var pol = new Polygon(array);     
                          gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");              
                          var wkid = new SpatialReference(4326);
                          pt = new Point(pol.getCentroid().x,pol.getCentroid().y,wkid);
                          var wkid1 = new SpatialReference(26191);
                          gsvc.project([pt],wkid1,function(projectPoint)
                          { 
                            var p = projectPoint[0];
                            var xCenteroid = p.x.toFixed(3); 
                            var yCenteroid = p.y.toFixed(3);
                            xCenteroidF = p.x.toFixed(3); 
                            yCenteroidF = p.y.toFixed(3);
                            var graphic2 = new Graphic(pol,sym);
                            map.graphics.add(graphic2);
                            var extent = pol.getExtent().expand(2);
                            map.setExtent(extent);
                            q_parcellaire = new QueryTask("https://portal.geomatic-online.ma/arcgis2/rest/services/MODAURS/FeatureServer/0");
                            q_p = new Query();
                            q_p.outFields = ["*"];
                            q_p.returnGeometry = true;
                            q_p.where = "typefoncier = '"+typeFonc+"' AND xCenteroid = "+xCenteroid+" AND yCenteroid ="+yCenteroid; //+" AND yCenteroid = "+pol.getCentroid().y;alert(pol.getCentroid().x);alert(pol.getCentroid().y);
                            q_parcellaire.execute(q_p,result);
                            
                            function result(featureSet)
                            {
                                var features_parcellaire = featureSet.features;
                                if(features_parcellaire.length != 0)
                                {    
                                    var graphic2 = new Graphic(features_parcellaire[0].geometry,sym);
                                    map.graphics.add(graphic2);
                                    var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                                    map.setExtent(extent);
                                    document.getElementById('alimBD').style.display = 'none';
            
                                }else{
                                    document.getElementById('alimBD').style.display = 'inline';
                                    document.getElementById('coordInputs').style.display = 'block';
                                    document.getElementById('error').style.display = 'block';
                                }
                            }                        
                          });                                       
                      }                                              
              }else{
                  var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                      new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                      new Color([255,0,0]), 2),new Color([255,255,255,0.15])
                      );
                  q_parcellaire = new QueryTask("https://portal.geomatic-online.ma/arcgis2/rest/services/MODAURS/FeatureServer/0");
                  q_p = new Query();
                  q_p.outFields = ["*"];
                  q_p.returnGeometry = true;
                  q_p.where = "typefoncier = '"+typeFonc+"' AND numfoncier = '"+numFonc+"' AND indice = '"+indice+"'";
                  q_parcellaire.execute(q_p,result);

                  function result(featureSet)
                  {
                      var features_parcellaire = featureSet.features; 
                      if(features_parcellaire.length != 0)
                      {    
                          var graphic2 = new Graphic(features_parcellaire[0].geometry,sym);
                          map.graphics.add(graphic2);
                          var extent = features_parcellaire[0].geometry.getExtent().expand(2);
                          map.setExtent(extent);

                      }else{
                          document.getElementById('alimBD').style.display = 'inline';
                          document.getElementById('coordInputs').style.display = 'block';
                          document.getElementById('error').style.display = 'block';
                      }
                  }
              } 
          }else{
             document.getElementById('error').innerHTML = "Merci de choisir une reference fonciere"
          }                
      }
     
    
      document.getElementById('addCoord').onclick = function(){
          gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");      
          var x = document.getElementById('xx');
          var y = document.getElementById('yy');   

          var wkid = new SpatialReference(26191);
          pt = new Point(x.value.replace(",","."),y.value.replace(",","."),wkid);
          var wkid1 = new SpatialReference(4326);
          gsvc.project([pt],wkid1,function(projectPoint)
            { 
                var p = projectPoint[0];
                array.push([p.x,p.y]);
                var table = document.getElementById('tbodyCoord');
                var row = table.insertRow(table.length);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = "B"+table.rows.length;
                cell2.innerHTML = x.value.replace(",",".");
                cell3.innerHTML = y.value.replace(",",".");
                 var btn = document.createElement("input"); 
                  btn.setAttribute("id",table.rows.length);
                  btn.setAttribute("src","./documentation/img/modif.png");
                  btn.setAttribute("type","image");
                  btn.setAttribute("name","update");
                  btn.onclick = function(){
                    var id = this.id;
                    cell2.innerHTML = "<input type='text' class='form-control' id='new_lon' value='"+table.rows[id-1].cells[1].innerHTML+"'/>";
                    cell3.innerHTML = "<input type='text' class='form-control' id='new_lat' value='"+table.rows[id-1].cells[2].innerHTML+"'/>";


                    var valider = document.createElement('input');
                    valider.setAttribute('src',"./documentation/img/valid.png");
                    valider.setAttribute('id',table.rows.length);
                    valider.setAttribute('type',"image");                      
                    valider.onclick = function(){
                          var a = document.getElementById('new_lon').value.replace(",",".");
                          var b = document.getElementById('new_lat').value.replace(",",".");
                          cell2.innerHTML= document.getElementById('new_lon').value.replace(",",".");
                          cell3.innerHTML= document.getElementById('new_lat').value.replace(",",".");
                          var pt2 = new Point(a,b,wkid);
                          gsvc.project([pt2],wkid1,function(projectPoint){
                            var p2 = projectPoint[0];
                            array[id-1] = [p2.x,p2.y];
                          });
                        cell4.removeChild(valider);cell4.removeChild(btn1);
                        cell4.appendChild(btn);
                    }


                    var btn1 = document.createElement('input');
                    btn1.setAttribute("src","./documentation/img/del.png");
                    btn1.setAttribute("type","image");
                    btn1.setAttribute("id",id);
                    btn1.setAttribute("name","delete");
                    btn1.onclick = function(){
                      if(table.rows.length>btn1.getAttribute('id'))
                      {
                        table.deleteRow(id-1);
                        array.splice(id-1,1);
                        var x1 = parseInt(id)-1;
                        for(var i=x1;i<table.rows.length+1;i++)
                        {
                          var j = document.getElementsByName("update")[i].getAttribute('id');
                          var k = i+1;
                          table.rows[i].cells[0].innerHTML = "B"+k;
                          document.getElementsByName("update")[i].setAttribute('id',j-1);
                        }
                      }
                     if(table.rows.length<=btn1.getAttribute('id')&&table.rows.length>1){table.deleteRow(id-1);array.splice(id-1,1);}
                     if(table.rows.length<=btn1.getAttribute('id')&&table.rows.length==1)
                      {                          
                        table.deleteRow(id-1);array.splice(id-1,1);
                        document.getElementById('vider').disabled=true;
                      }
                    }
                    cell4.removeChild(btn);
                    cell4.appendChild(valider);
                    cell4.appendChild(btn1);
                  }
                  cell4.appendChild(btn);
                  x.value="";
                  y.value="";
                  x.style.boxShadow="";
                  y.style.boxShadow="";                 
            });                      
      }

      document.getElementById('alimBD').onclick = function(){
           
          var typeFonc = document.getElementById('selRef').value;
          var numFonc = document.getElementById('numfonc').value;
          var indice = document.getElementById('indice').value; 
          var sym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
            new Color([255,0,0]), 2),new Color([255,255,255,0.15])
            );
        if(typeFonc == 'TNI'){            
            var pol = new Polygon(array);
            gsvc = new GeometryService("https://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");              
            var wkid = new SpatialReference(4326);
            pt = new Point(pol.getCentroid().x,pol.getCentroid().y,wkid);
            var wkid1 = new SpatialReference(26191);
            gsvc.project([pt],wkid1,function(projectPoint)
               { 
                var p = projectPoint[0];
                var f = new FeatureLayer("https://portal.geomatic-online.ma/arcgis2/rest/services/MODAURS/FeatureServer/0");
                var xCenteroid = p.x.toFixed(3).replace(".",",");
                var yCenteroid = p.y.toFixed(3).replace(".",",");
                attr = {"typefoncier":typeFonc,"xCenteroid":xCenteroid,"yCenteroid":yCenteroid};
                var graphic = new Graphic(pol,sym,attr);
                f.applyEdits([graphic],null,null);
               });            
        }else{
            
            var pol = new Polygon(array);
            var f = new FeatureLayer("https://portal.geomatic-online.ma/arcgis2/rest/services/MODAURS/FeatureServer/0");
            attr = {"typefoncier":typeFonc,"numfoncier":numFonc,"indice":indice};
            var graphic = new Graphic(pol,sym,attr);
            f.applyEdits([graphic],null,null);
        }         
      }

      document.getElementById('vider').onclick = function(){
          
          document.getElementById('error').style.display = 'none'
          document.getElementById('xx').value = "";
          document.getElementById('yy').value = "";
          document.getElementById('numfonc').value = "";
          document.getElementById('indice').value = "";
          document.getElementById('selRef').selectedIndex = "0";
          array = [];
          map.graphics.clear();
          var table = document.getElementById('tbodyCoord');
          var rowCount = table.rows.length;
          while(rowCount > 0)
          {table.deleteRow(0);}
      }

      document.getElementById('nvDemande').onclick = function(){
          var typeFonc = document.getElementById('selRef').value;
          var numFonc = document.getElementById('numfonc').value;
          var indice = document.getElementById('indice').value; 
          document.getElementById('')
          sessionStorage.setItem("typeFoncier",typeFonc);
          if(typeFonc == 'TNI'){
            sessionStorage.setItem("xCenteroid",xCenteroidF);alert(xCenteroidF);
            sessionStorage.setItem("yCenteroid",yCenteroidF);
            location.replace("http://localhost/aurs/pages/cards.html");            
          }else{
            sessionStorage.setItem("numFoncier",numFonc);
            sessionStorage.setItem("indice",indice);
            location.replace("http://localhost/aurs/pages/cards.html");

          }
          
      }
  

});