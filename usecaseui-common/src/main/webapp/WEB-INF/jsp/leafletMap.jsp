<%--
  ================================================================================
  eCOMP Portal SDK
  ================================================================================
  Copyright (C) 2017 AT&T Intellectual Property
  ================================================================================
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
       http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ================================================================================
  --%>
<!DOCTYPE html>

<html>
<head>
    
    <meta charset="UTF-8">

    <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="app/fusion/external/leaflet-0.7.3/leaflet.js"></script>
    <link rel="stylesheet" href="app/fusion/external/leaflet-0.7.3/leaflet.css" />

    <style>
        #map { 
            height: 450px;
            width: 800px;
        }
        .animateOff {
            color: red;   
        }
        .animateOn {
            color: green;   
        }
    </style>
<!--     
    <script src="static/fusion/gis/js/local.js"></script>
 -->
    <script>

    var siteData = [
		
	];
    
    var pipeData = [
       
    ];
    </script>
   
    
</head>
<body>
  <div id="map"></div>
  <button id="forwardButton" onclick="stepForward();">Step Forward</button>
  <button id="playPause" onclick="playPause();">Play</button>
  <div>
    <table att-table table-data="tableData" view-per-page="viewPerPage" current-page="currentPage" search-category="searchCategory" search-string="searchString" total-page="totalPage">
      <thead att-table-row type="header">
        <tr>
          <th att-table-header sortable="false" key="id">Site</th>
          <th att-table-header sortable="false" key="lastName">Usage</th>        
        </tr>
      </thead>
      <tbody att-table-row type="body" id="topTenSites">
      </tbody>	  
    </table>
    <table att-table table-data="tableData" view-per-page="viewPerPage" current-page="currentPage" search-category="searchCategory" search-string="searchString" total-page="totalPage">
      <thead att-table-row type="header">
        <tr>
          <th att-table-header sortable="false" key="id">Link</th>
          <th att-table-header sortable="false" key="lastName">Usage</th>        
        </tr>
      </thead>
      <tbody att-table-row type="body" id="topTenLinks">
      </tbody>	  
    </table>
  </div>

  <script>
    var map = L.map('map').setView([40, -96], 4);
    <!-- please add your map location -->
    L.tileLayer('http://XXX/tiles-light/{z}/{x}/{y}.png', {maxZoom:18}).addTo(map);
    
    var dataLayer = addDataLayers(map, null);

    function addDataLayers(map, dataLayer) {
    	if (dataLayer!=null) {
    		map.removeLayer(dataLayer);
    	}
    	
    	dataLayer = L.layerGroup();

    	var siteInfo = [];

        var pipeLayer = L.layerGroup();
        for (var i=0; i<pipeData.length; i++) {
        	var pipe = pipeData[i];
        	
        	var usage = pipe.usage;
        	if (!usage || Math.random()<0.05) {
        		//console.log("Rerolling " + pipe.name);
	        	usage = Math.floor(Math.random()*33 + Math.random()*33 + Math.random()*34);
        	} else {
        		//console.log("Adjusting " + pipe.name);
        		usage = Math.floor(usage + Math.random()*15 - Math.random()*15);
        	}
        	if (usage<0) usage = 0;
        	while (usage>100) usage -= Math.floor(20*Math.random());
        	if (usage>90) usage -= Math.floor(20*Math.random());
        	
        	pipe.usage = usage;

        	var color = "black";
        	if (usage>60) color = "yellow";
        	if (usage>70) color = "orange";
        	if (usage>80) color = "red";
        	pipeLayer.addLayer(L.polyline([[pipe.lat_a, pipe.lon_a], [pipe.lat_z, pipe.lon_z]], {"color": color, "title": pipe.name}).bindPopup(pipe.name + "<br/>" + pipe.title + "<br/>" + usage + "% usage"));

        	var siteA = siteInfo[pipe.id_a];
        	if (siteA) {
        		siteA.usage += usage;
        		siteA.maxUsage += 100;
        		//console.log("Site a id = " + pipe.id_a + ", object existed = " + siteA + ", usage = " + siteA.usage + ", max = " + siteA.maxUsage);
        	} else {
        		siteA = {};
        		siteA.usage = usage;
        		siteA.maxUsage = 100;
        		siteInfo[pipe.id_a] = siteA;
        		//console.log("Site a id = " + pipe.id_a + ", object is new = " + siteA + ", usage = " + siteA.usage + ", max = " + siteA.maxUsage);
        	}

        	var siteZ = siteInfo[pipe.id_z];
        	if (siteZ) {
        		siteZ.usage += usage;
        		siteZ.maxUsage += 100;
        		//console.log("Site z id = " + pipe.id_z + ", object existed = " + siteZ + ", usage = " + siteZ.usage + ", max = " + siteZ.maxUsage);
        	} else {
        		siteZ = {};
        		siteZ.usage = usage;
        		siteZ.maxUsage = 100;
        		siteInfo[pipe.id_z] = siteZ;
        		//console.log("Site z id = " + pipe.id_z + ", object is new = " + siteZ + ", usage = " + siteZ.usage + ", max = " + siteZ.maxUsage);
        	}
        }
        dataLayer.addLayer(pipeLayer);

        var dataCenterLayer = L.layerGroup();
        for (var i=0; i<siteData.length; i++) {
        	var site = siteData[i];
//    		{"id": "slkut", "name": "Salt Lake City, UT", "title": "250G", "lat": 40.75, "lon": -111.88},
        	var info = siteInfo[site.id];
        	var color = "black";
        	if (info.usage/info.maxUsage>.6) color = "yellow";
        	if (info.usage/info.maxUsage>.7) color = "orange";
        	if (info.usage/info.maxUsage>.8) color = "red";
        	var pct = Math.floor(100*info.usage/info.maxUsage);
        	site.usage = pct;
//        	dataCenterLayer.addLayer(L.marker([site.lat, site.lon], {"title": site.name}).bindPopup(site.name + "<br/>" + pipe.title + "<br/>" + info.usage + "/" + info.maxUsage));
			dataCenterLayer.addLayer(L.circleMarker([site.lat, site.lon], {"color": color, "title": site.name, "fillOpacity": .5}).bindPopup(site.name + "<br/>" + pipe.title + "<br/>" + pct + "%"));
        }
        dataLayer.addLayer(dataCenterLayer);

        dataLayer.addTo(map);

        siteData.sort(function(a,b){return b.usage-a.usage});
        var topTenHtml = "";
        for (var i=0; i<10; i++) {
        	topTenHtml = topTenHtml + "<tr><td att-table-body>" + siteData[i].name + "</td><td att-table-body>" + siteData[i].usage + "%</td></tr>";
        }
        document.getElementById("topTenSites").innerHTML = topTenHtml;

        pipeData.sort(function(a,b){return b.usage-a.usage});
        topTenHtml = "";
        for (var i=0; i<10; i++) {
        	topTenHtml = topTenHtml + "<tr><td att-table-body>" + pipeData[i].name + "</td><td att-table-body>" + pipeData[i].usage + "%</td></tr>";
        }
        document.getElementById("topTenLinks").innerHTML = topTenHtml;

        return dataLayer; 
    }
    
    function stepForward() {
    	dataLayer = addDataLayers(map, dataLayer);
    }

    var intervalObj = null;    
    function playPause() {
    	if (intervalObj==null) {
    		document.getElementById('playPause').innerHTML = "Pause";
    		document.getElementById('forwardButton').disabled = true;
    		intervalObj = window.setInterval(function(){dataLayer = addDataLayers(map, dataLayer);},1500);
    	} else {
    		document.getElementById('playPause').innerHTML = "Play";
    		document.getElementById('forwardButton').disabled = false;
    		clearInterval(intervalObj);
    		intervalObj = null;
    	}
    }
    
    function onMapClick(e) {
        //alert("You clicked the map at " + e.latlng);
        dataLayer = addDataLayers(map, dataLayer);
    }

    map.on('click', onMapClick);
  </script>

</body>
</html>