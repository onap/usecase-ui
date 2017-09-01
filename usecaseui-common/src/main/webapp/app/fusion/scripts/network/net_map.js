var graph,paper;
var zoomIndex = 1;
var recentCallFlow;
var recentCallFlowStep;
var hash_map = new Object();
var hashVertexDomainXMap = new Object();

var globalCollapseDomanString = "";
var changeIcon = false;
var colorSet = ["#0000FF","#8A2BE2","#DEB887",
                "#5F9EA0","#7FFF00","#D2691E","#6495ED","#DC143C",
                "#000000","#A9A9A9","#BDB76B",
                "#FF1493","#48D1CC","#A52A2A","#FF7F50","#DAA520","#32CD32"];
var colorIndex = 0;
String.prototype.startsWith = function (str)
{
   return this.indexOf(str) == 0;
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
function getColor(id1,id2) {
	
    var color = colorSet[colorIndex];
    colorIndex++;
    return color;
}
/////////////////////////////////////////////////////////////////////////////////////
    $('.legend-toggle').click(function (a) {
    
        $('.legend-toggle .toggle').hasClass("on")?($('.legend-toggle .toggle').removeClass("on"),$("#legend").fadeOut(350)):($('.legend-toggle .toggle').addClass("on"),$("#legend").fadeIn(350));
        
    });
    
    $('.symbols-toggle').click(function (a) {
	
        $('.symbols-toggle .toggle').hasClass("on")?($('.symbols-toggle .toggle').removeClass("on"),$("#symbols").fadeOut(350)):($('.symbols-toggle .toggle').addClass("on"),$("#symbols").fadeIn(350));
    });
    
    
    
plotNodes = function(domain) {
	
	  if(domain.containerList) {
		  
		  var containerList = domain.containerList;
		  
		  for(var i=0; i<containerList.length; i++) {

			  var container = containerList[i];
			  plotContainer(container, 'outContainer');
		  }
		  
	  }
	  
	  if(domain.innerCList) {
		  
		  var containerList = domain.innerCList;
		  
		  for(var i=0; i<containerList.length; i++) {

			  var container = containerList[i];
			  plotContainer(container, 'insideContainer');
		  }
		  
	  }
	  
	  if(domain.elementList) {
		  var elementList = domain.elementList;
		  
		  for(var i=0; i<elementList.length; i++) {

			  var element = elementList[i];
			  plotElement(element);
		  }
		  
	  } 
}

plotNodesIcon = function(domain) {
    
	 if(domain.containerList) {
		  
		  var containerList = domain.containerList;
		  
		  for(var i=0; i<containerList.length; i++) {

			  var container = containerList[i];
			  plotContainerIcon(container, 'outContainer');
		  }
		  
	  }
	 
	 if(domain.innerCList) {
		  
		  var containerList = domain.innerCList;
		  
		  for(var i=0; i<containerList.length; i++) {

			  var container = containerList[i];
			  plotContainerIcon(container, 'insideContainer');
		  }
		  
	  }
	  
	  if(domain.elementList) {
		  var elementList = domain.elementList;
		  
		  for(var i=0; i<elementList.length; i++) {

			  var element = elementList[i];
			  plotElementIcon(element);
		  }
		  
	  } 
      
}

plotExpand = function(container) {
	attributes = container;
	$('#networkModelContainer').append('<div class="expandtri"' + 'id= "'  + attributes.name + '"' + 'title= "'+ attributes.name + '"' +  ' style="position:absolute;left:'+ (attributes.newXafterColl) +'px;top:' + (attributes.YafterColl) + 'px;width:' + 30 + 'px;height:' + 50 + 'px;z-index:200;">'  +  '<img src="static/img/map/expand-icon.png" height="42" width="42"></div>');
	
	
}

plotContainer = function(container, cssType) {
	
	attributes = container;
	//console.log(attributes);
	if(cssType === 'domain'){
	$('#networkModelContainer').append('<div class="container ' + cssType + '" style="position:absolute;left:'+ attributes.left +'px;top:' + attributes.top + 'px;width:' + attributes.width + 'px;height:' + attributes.height + 'px;z-index:-200;' + 'border:1px blue;"><p class="textconetent" style="text-align:center;margin-top:11px;color:white;font-weight:bold;font-size:24px;">' + attributes.name + '</p></div>');
	$('#networkModelContainer').append('<div class="contracttri"' + 'id= "'  + attributes.name + '"' + ' style="position:absolute;left:'+ (attributes.left+attributes.width - 40) +'px;top:' + attributes.top + 'px;width:' + 20 + 'px;height:' + (attributes.height/3) + 'px;z-index:200;">'  +    '<img src="static/img/map/contract-icon.png" height="42" width="42"></div>');
	
	
	}else if(attributes.visibilityType==='invisible'){

		$('#networkModelContainer').append('<div ' + '" style="position:absolute;left:'+ (attributes.left+14) +'px;top:' + (attributes.top-5) + 'px;width:' + attributes.width + 'px;height:' + (attributes.height-35) + 'px;' + 'border:1px blue;"><p style="font-weight:bold;font-size:10px;">' + attributes.name + '</p></div>');

	}else{

		if(!recentCallFlow){
		   $('#networkModelContainer').append('<div class="container borderContainer ' + cssType + '" style="position:absolute;left:'+ attributes.left +'px;top:' + attributes.top + 'px;width:' + attributes.width + 'px;height:' + attributes.height + 'px;z-index:-200;' + 'border:1px blue;">' + '</div>');
		//$('#networkModelContainer').append('<p class="speech"' + ' style="position:absolute;left:' + (attributes.left-20) + 'px;top:' + (attributes.top-30) + 'px;width:' + attributes.width + 'px"' + '>'+ attributes.name + '</p>');
	           plotHeader(attributes,cssType);
		}else{
		   $('#networkModelContainer').append('<div class="container ' + cssType + '" style="position:absolute;left:'+ attributes.left +'px;top:' + attributes.top + 'px;width:' + attributes.width + 'px;height:' + attributes.height + 'px;z-index:-200;' + 'border:1px blue;">' + '</div>');
		//$('#networkModelContainer').append('<p class="speech"' + ' style="position:absolute;left:' + (attributes.left-20) + 'px;top:' + (attributes.top-30) + 'px;width:' + attributes.width + 'px"' + '>'+ attributes.name + '</p>');
		   plotHeader(attributes,cssType);
		}

	}

	plotNodes(container);

	}

plotContainerIcon = function(container, cssType) {
	attributes = container;
	//console.log(attributes);
	if(cssType === 'domain'){
	    $('#networkModelContainer').append('<div class="container ' + cssType + '" style="position:absolute;left:'+ attributes.left +'px;top:' + attributes.top + 'px;width:' + attributes.width + 'px;height:' + attributes.height + 'px;z-index:-200;' + 'border:1px blue;"><p class="textconetent" style="text-align:center;margin-top:11px;color:white;font-weight:bold;font-size:24px;">' + attributes.name + '</p></div>');
	    $('#networkModelContainer').append('<div class="contracttri"' + 'id= "'  + attributes.name + '"' + ' style="position:absolute;left:'+ (attributes.left+attributes.width - 40) +'px;top:' + attributes.top + 'px;width:' + 20 + 'px;height:' + (attributes.height/3) + 'px;z-index:200;">'  +    '<img src="static/img/map/contract-icon.png" height="42" width="42"></div>');
		
	}else if(attributes.visibilityType==='invisible'){

		$('#networkModelContainer').append('<div ' + '" style="position:absolute;left:'+ (attributes.left+14) +'px;top:' + (attributes.top-5) + 'px;width:' + attributes.width + 'px;height:' + (attributes.height-35) + 'px;' + 'border:1px blue;"><p style="font-weight:bold;font-size:10px;">' + attributes.name + '</p></div>');
	}
	else{   
		if(!recentCallFlow){
			$('#networkModelContainer').append('<div class="container borderContainer ' + cssType + '" style="position:absolute;left:'+ attributes.left +'px;top:' + attributes.top + 'px;width:' + attributes.width + 'px;height:' + attributes.height + 'px;z-index:-200;' + 'border:1px blue;">' + '</div>');
			//$('#networkModelContainer').append('<p class="speech"' + ' style="position:absolute;left:' + (attributes.left-20) + 'px;top:' + (attributes.top-30) + 'px;width:' + attributes.width + 'px"' + '>'+ attributes.name + '</p>');
			plotHeader(attributes,cssType);
			}else{
			$('#networkModelContainer').append('<div class="container ' + cssType + '" style="position:absolute;left:'+ attributes.left +'px;top:' + attributes.top + 'px;width:' + attributes.width + 'px;height:' + attributes.height + 'px;z-index:-200;' + 'border:1px blue;">' + '</div>');
			//$('#networkModelContainer').append('<p class="speech"' + ' style="position:absolute;left:' + (attributes.left-20) + 'px;top:' + (attributes.top-30) + 'px;width:' + attributes.width + 'px"' + '>'+ attributes.name + '</p>');
			plotHeader(attributes,cssType);
			}
	}
	
	plotNodesIcon(container);			
	
}

joint.shapes.basic.newRect = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'basic.newRect',
        attrs: {
            'rect': { fill: 'white', stroke: 'black', 'follow-scale': true, width: 80, height: 40},
            'text': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle'}
        },
        shortname: 'Transcoder',
        description: 'Reconciles mismatched CODECs',
        longname: 'ACME SBC device providing dedicated Transcoder function',
        vendor: 'ORACLE ACME',
        primary_function: 'Allows endpoints utilizing different CODECs to communicate',
        key_interface: 'SBC, MSC',
        network_domain: 'Universal Services Platform - Access Module Group - ISA Core Office',

}, joint.shapes.basic.Generic.prototype.defaults)});

plotHeader = function(attributes,cssType){
    
    var nameLength = attributes.name.length;
    var headName;
    if (nameLength>22){
	headName = attributes.name.substring(0,12) + "-\n" + attributes.name.substring(12);
	
    }else{
	headName = attributes.name;
    }
    
    var thisElement = new joint.shapes.basic.newRect({
	     position: { x: attributes.left+10, y: attributes.top + 4 },
	     size: { width: attributes.width-20, height: 15 },
	     attrs: { 
		         rect: { fill: "gray" ,stroke: "gray",opacity:"0.8"}, 
		         text: { text: headName, fill: 'black' ,'font-size':10, 'font-weight':'700','text-transform': 'capitalize'}
		    
	     }
    });
    if(cssType==="outContainer"){
	
	thisElement.attr({
		  rect:{fill:"#e7e7e7", stroke: "#e7e7e7",opacity:"0.8"}
	      });
	
    }else{
	
	thisElement.attr({
		  rect:{fill:"ghostwhite", stroke: "ghostwhite",opacity:"0.8"}
	      });
	
	
    }
    graph.addCells([thisElement]);

}
plotElement = function(element) {
   
	if(element.left){
	  if(!element.id.startsWith("com.att.trinity.ue")){
	  left = element.left ;
	  var thisColor = element.bgColor;
	  var thisElement = new joint.shapes.basic.newRect({
	             id:element.id,
		     position: { x: element.left, y: element.top },
		     size: { width: element.width, height: element.height*2 },
		     
		     attrs: { 
			         rect: { fill: "lightgray" ,stroke: "gray"}, 
			         text: { text: element.name.replace(" ","\n"), fill: 'black' ,'font-size': 9, 'font-weight': 'bold','font-variant': 'small-caps', 'text-transform': 'capitalize'}
			        
		     }
		     
	  });
	  if(!recentCallFlow){
	      thisElement.attr({
		  rect:{fill:element.bgColor, stroke: thisColor}
	      });
	      
	  }
	  //thisElement.attr({rect:{style:{"pointer-events":"none"}}});
	  thisElement.set('bg-color', (element.bgColor!= null?element.bgColor:"blue"));
	  thisElement.set('icon_path', (element.imgFileName != null? element.imgFileName: "static/img/map/icons/sgw-icon.png"));
	  thisElement.set('shortname', element.name);
	  thisElement.set('description', element.details.description);
	  thisElement.set('longname', element.details.display_longname);
	  thisElement.set('vendor', element.details.vendor);
	  thisElement.set('primary_function', element.details.primary_function);
	  thisElement.set('key_interface', element.details.key_interfaces);
	  thisElement.set('location', element.details.location);
	  thisElement.set('network_function', (element.details.network_function=="V")? "Virtual" : "Physical" );
	  if(element.borderType == 'dashed'){
	      
	      thisElement.attr({
		        rect: {stroke: 'black','stroke-width':"2",'stroke-dasharray': "5,2" },
		  });
	      
	  }
	  
	  
	  hash_map[element.name+'']=thisElement.name;
	  graph.addCells([thisElement]);
	 
	 }else{
		 plotElementIcon(element);
	 }
	} 

}

joint.shapes.basic.DecoratedRect = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',

    defaults: joint.util.deepSupplement({

        type: 'basic.DecoratedRect',
        size: { width: 100, height: 60 },
        attrs: {
            'rect': { fill: 'lightgray', width: 100, height: 60 },
            'text': { 'font-size': 14, text: '', 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle', fill: 'black'},
            'image': { ref: 'rect', width: 35, height: 25}
        },
        shortname: 'Transcoder',
        description: 'Reconciles mismatched CODECs',
        longname: 'ACME SBC device providing dedicated Transcoder function',
        vendor: 'ORACLE ACME',
        primary_function: 'Allows endpoints utilizing different CODECs to communicate',
        key_interface: 'SBC, MSC',
        network_domain: 'Universal Services Platform - Access Module Group - ISA Core Office',

    }, joint.shapes.basic.Generic.prototype.defaults)
});

plotElementIcon = function(element) {
    
    
	if(element.left){
	  
	  left = element.left ;
	  uetop = element.top;
	  if(element.id.startsWith("com.att.trinity.ue")) {
		 uetop = element.top - 30;
	  } else {
		  uetop = element.top ;
	  }
	  var thisElement = new joint.shapes.basic.DecoratedRect({
	             id:element.id,
		     position: { x: element.left, y: uetop  },
		     size: { width:element.width, height: element.height*2 },
		    // style:{'pointer-events':'none'},
		     attrs: { 
		         //image: { 'xlink:href': 'static/img/map/icons/sgw-icon.png' 
		    	 image: { 'xlink:href': element.imgFileName}
		    	//rect:{style:{"pointer-events":"none"}}
		    	// style:{'pointer-events':'none'}
		    	// 'pointer-events':'none'
		     }
	  });
	 // thisElement.attr({rect:{style:{"pointer-events":"none"}}});
	  thisElement.set('bg-color', element.bgColor);
	  thisElement.set('icon_path', element.imgFileName);
	  thisElement.set('shortname', element.name);
	  thisElement.set('description', element.details.description);
	  thisElement.set('longname', element.details.display_longname);
	  thisElement.set('vendor', element.details.vendor);
	  thisElement.set('primary_function', element.details.primary_function);
	  thisElement.set('key_interface', element.details.key_interfaces);
	  thisElement.set('location', element.details.location);
	  thisElement.set('network_function', (element.details.network_function=="V")? "Virtual" : "Physical");
	  
	  if(!recentCallFlow ){
	      thisElement.attr({
		  rect:{fill:element.bgColor }
	      });
	      
	  }
	  if(element.borderType == 'dashed'){
	      
	      thisElement.attr({
		        rect: {stroke: 'lightskyblue','stroke-width':"2",'stroke-dasharray': "5,2" },
		  });
	      
	  }
	  if(element.id.startsWith("com.att.trinity.ue")){
	      thisElement.attr({
		       rect: {fill: 'white', style:{'pointer-events':'none'}},
		       image: { style:{'pointer-events':'none'}}
	      });
	      
	      //thisElement.css('pointer-events', 'none');
	     // paper.thisElement.css('pointer-events', 'none');
	  }
	  hash_map[element.name+'']=thisElement.name;
	  graph.addCells([thisElement]);

	} 

}


plotNetMapCallFlow = function(callFlow, callFlowStep, collapsedDomainString, expandedDomainString, icon) {
	
	 init();
     
     recentCallFlow = callFlow; //callFlow != null ? callFlow : recentCallFlow;
     recentCallFlowStep = callFlowStep; //callFlowStep != null ? callFlowStep : recentCallFlowStep;
     
     // $.get( "static/trisim_files/network_map.yml", function( data ) { 

     if(callFlow != null &&callFlow.title != null) {
     
	  $(".map-title").html(callFlow.title);
	  
     }else{
	  $(".map-title").html("Network Map");
	  
     }
     $.post('network_model.htm?action=layout', {
			collapsedDomains : collapsedDomainString,
			expandedDomains : expandedDomainString
		}, function(data)  { 
	  var yamlObject = jsyaml.load(data);
	  
	  var layout = yamlObject.domainList;
	  for(var i=0; i<layout.length; i++) {
		  domain = layout[i];
		  if(icon)
			  plotContainerIcon(domain,'domain');
		  else
			  plotContainer(domain,'domain');
		  
		  hashVertexDomainXMap[domain.name] = domain.left;
	  }
	  
	  var collapseLayout = yamlObject.collapsedDomainList;
	  globalCollapseDomanString = "";
		  for(var i=0; i<collapseLayout.length; i++) {
			  domain = collapseLayout[i];
			  globalCollapseDomanString += (domain.name + ",");
			  plotExpand(domain);
			  addExpandEvents();
			  
			  // some hardcoded hack; need to revise; if any one if these are collapsed , then we should not display hard coded links in addLinkVertices method
			  if((globalCollapseDomanString.indexOf("USP") > -1)|| (globalCollapseDomanString.indexOf("RAN") > -1)|| (globalCollapseDomanString.indexOf("EPC") > -1)) {
				  hashVertexDomainXMap["USP"] = -999;
				  hashVertexDomainXMap["RAN"] = -999;
				  hashVertexDomainXMap["EPC"] = -999;
			  }
			  
	  }
	  
	 
	  addCollapseEvents(); //onclick="alert(\'hello\')"
	  //console.log(yamlObject);
	  //addLink('EATF','SDG');
	  if(icon == false)
		  $('.icons-toggle .toggle').removeClass("on");
	  
	  
	  if(callFlow != null && callFlow.id != null) {
		  
		 // var callFlowLinkFile =   callFlow + "_" + callFlowStep + ".yml";
		  
		  $.post('network_model.htm?action=callflow', {
			  callFlowName : callFlow.id,
			  callFlowStep : callFlowStep
			}, function( data ) { 
		
			try{	  
			var yamlObject = jsyaml.load(data);
			  //addLink("EATF","MRF");
			  var layout = yamlObject.linkList;
			  
			  var hashLinkElements = new Object();
			  for(var i=0; i<layout.length; i++) {
				  domain = layout[i];
				  try {
					  if(hashLinkElements[domain.s] != undefined)
						  hashLinkElements[domain.s] +=1;
					  else  hashLinkElements[domain.s] =1;
					  if(hashLinkElements[domain.d] != undefined )
						  hashLinkElements[domain.d] +=1;
					  else  hashLinkElements[domain.d] =1;
		            } catch (exception) {}
			  }
			  
			  for(var i=0; i<layout.length; i++) {
				  domain = layout[i];
				  try {
					  addLink(domain.s,domain.d, hashLinkElements,'none');
		            } catch (exception) {}
			  }
			  
			  //console.log(yamlObject);
			}
			  catch(err) {}
			  
			  $.post('network_model.htm?action=callflowAdditional', {
				  callFlowName : callFlow.id,
				  callFlowStep : callFlowStep
				}, function( data ) { 
			
				try{	  
				var yamlObject = jsyaml.load(data);
				  //addLink("EATF","MRF");
				  var layout = yamlObject.linkList;
				  if(layout != undefined)
				  for(var i=0; i<layout.length; i++) {
					  domain = layout[i];
					  try {
						  var source = domain.s.split(",");
						  var destination = domain.d.split(",");
						  addLinkVertices(source[0],source[1],source[2], source[3], destination[0], destination[1], destination[2],'none');
						  
			            } catch (exception) {}
				  }
				  
				  //make cells active
				  var activeIds = yamlObject.activeIds;
				  if(activeIds != undefined)
				  for(var i=0; i<activeIds.length; i++) {
				         
					  var chosenElement1 = graph.getCell(activeIds[i]); 
					    chosenElement1.attr({
						      rect: { fill: chosenElement1.get('bg-color')}
					    });
				  }
				  
				  // disconnect some links
				  
				  var disconnectLinks = yamlObject.disconnectLinks;
				  if(disconnectLinks != undefined)
				  var availableLinks = graph.getLinks();
				  //var availableLinks = paper.model.getLinks();
				  for(var i=0; i<disconnectLinks.length; i++) {
					  
					  for(var j=0;j<availableLinks.length; j++) {

						  if(availableLinks[j].attributes.source.id != undefined ) {
						      
						          
						          if(disconnectLinks[i].s == availableLinks[j].attributes.source.id && disconnectLinks[i].d == availableLinks[j].attributes.target.id) {
						              
							      availableLinks[j].remove();
								  break;
							  }
							  
						  }
					  }
				  }
				  
				  
				  //console.log(yamlObject);
				}
				catch(err) {}
				finally {
					
					makeLinksVisible();
				}
				  
				 
				 });
			  
			 
			 });
		  
		  
		  
		  
			
		  
	  }
			
	 
	 });
	  
	  
	  
	  
	 
	
};


makeLinksVisible = function() {
	
	 var linkElements = $(".link");
	 
	 for(var i= 0;i<linkElements.length;i++) {
		var pathElement =  linkElements[i].childNodes[0];
	    pathElement.attributes.display.value = 'inline';
	 }
	 
	
};

parseYaml = function(callFlow, callFlowStep, collapsedDomainString, expandedDomainString) {
	$('#containerScrollDiv').css("z-index",0);
	plotNetMapCallFlow(callFlow, callFlowStep, collapsedDomainString, expandedDomainString,false);
	     
};


parseYamlIcon = function(callFlow, callFlowStep, collapsedDomainString, expandedDomainString){
	$('#containerScrollDiv').css("z-index",0);
	plotNetMapCallFlow(callFlow, callFlowStep, collapsedDomainString, expandedDomainString,true);             

};

addLinkVertices = function(sourceX,sourceY, sourceDomain, sourceLabel, destinationX, destinationY, destinationDomain, display){
	
	if(Number(hashVertexDomainXMap[sourceDomain]) == -999)
		return ;
    
    var link = new joint.dia.Link({
    	source: { x: Number(hashVertexDomainXMap[sourceDomain]) + Number(sourceX), y: Number(sourceY)},
        target: { x: Number(hashVertexDomainXMap[destinationDomain]) + Number(destinationX), y: Number(destinationY)},
        attrs: {
            '.connection': {
                stroke: '#b5af4c',
        	//stroke:getColor(id1,id2),
                'stroke-width': 2,
                'display' : (display == undefined ? 'block' : display)
            }
        }
       
    });
    
    if(sourceLabel != "-" ) {
    	
    	link.label(0, {
    	    position: .5,
    	    attrs: {
    	        text: { fill: 'black', text: sourceLabel.replace(" ","\n") }
    	    }
    	});
    	
    }
    
    graph.addCells([link]);
    link.toBack();
    
}

addLink = function(id1,id2, hashLinkElements, display){
	
	var elementId1 = graph.getCell(id1);
	var elementId2 = graph.getCell(id2);
	var elementId1x = elementId1.attributes.position.x;
	var elementId1y = elementId1.attributes.position.y;
	var elementId2x = elementId2.attributes.position.x;
	var elementId2y = elementId1.attributes.position.y;
	
    
    var link = new joint.dia.Link({
    	source: { id: elementId1.id},
    	target: { id: elementId2.id},
    	//source: { x: elementId1.attributes.position.x+10, y: elementId1.attributes.position.y+10},
        //target: { x: elementId2.attributes.position.x+10, y: elementId2.attributes.position.y+10},
        router: { name: 'manhattan' },
        connector: { name: 'normal' },
        attrs: {
            '.connection': {
                //stroke: '#333333',
        	stroke:getColor(id1,id2),
                'stroke-width': 2,
                'z-index' :-300,
                'display' : (display == undefined ? 'block' : display)
            },
            
        },
    });

    graph.addCells([link]);
    link.toBack();
    //link.set('vertices', [{ x: (elementId1x + elementId2x)/2 , y: (elementId1y + elementId2y)/2 }]);
    //link.translate(10, 10);

   
    var chosenElement1 = graph.getCell(id1); 
    chosenElement1.attr({
	      rect: { fill: chosenElement1.get('bg-color')}
    });
    var chosenElement2 = graph.getCell(id2); 
    chosenElement2.attr({
	      rect: { fill: chosenElement2.get('bg-color')}
    });
    
    // logic to avoid overlapping links ; create dummy hidden objects at the vertices so that smart routing will avoid these obstacle when plotting the link
    if(hashLinkElements[id1]> 0 || hashLinkElements[id2] >0) {
	    var linkElement = $("[model-id^=" + link.id +"]");
	    var pathElement = linkElement.children("path")[0];
	    var pathCoordinates = pathElement.attributes.d.value.split(" ");
	    for(var i = 1; i<pathCoordinates.length/2 ;i+=2) {
	    	
	    	try{
	    		// plot an element on the starting points
	    	plotHiddenDummyElement(link.id+"-"+i,Number(pathCoordinates[i]), Number(pathCoordinates[i+1]) );
	    	}catch(err){
	    		console.log(err);
	    	}
	    	
	    	try{
	    		// plot half way on the edge too
	    		plotHiddenDummyElement(link.id+"--"+i,(Number(pathCoordinates[i])+Number(pathCoordinates[i+2]))/2, (Number(pathCoordinates[i+1])+Number(pathCoordinates[i+3]))/2 );
	    	}catch(err){}
	    	
	    } 
	    var newPathCoordinates = "M";
	    // in IE every XandY coordinates pair is delimited with L; so two x coordinates are 2 elements apart. In firefox and chrome, they are one element apart. For more clarification, 
	    // check the pathCoordinates in debug window 
	    var nextIndex = Browser.isIE == true ? 3 : 2;
	    for(var i = 1; i<pathCoordinates.length ;i++) {
	    	if( i == 1 ) {
	    		if(pathCoordinates[i] == pathCoordinates[i+nextIndex]) {// x coordinates are the same
	    			var originalI = Number(pathCoordinates[i]);
	    			var newI = originalI + (Number(hashLinkElements[id1])*2);
	    			
	    			// iteratively change the x coordinates for all the segments
	    			for(var j = i; j<pathCoordinates.length; j+=nextIndex) {
	    				if(pathCoordinates[j] == originalI)
	    					pathCoordinates[j] = newI;
	    			}
	    			
	    		}
	    		else if(pathCoordinates[i+1] == pathCoordinates[i+1+nextIndex]) {// y coordinates are the same
	    			
	    			var originalI = Number(pathCoordinates[i+1]);
	    			var newI = originalI - (Number(hashLinkElements[id1])*2);
	    			
	    			// iteratively change the y coordinates for all the segments
	    			for(var j = i+1; j<pathCoordinates.length; j+=nextIndex) {
	    				if(pathCoordinates[j] == originalI)
	    					pathCoordinates[j] = newI;
	    			}
	    			
	    		}
	    		
	    		hashLinkElements[id1]-=1;
	    	}
	    	newPathCoordinates += " "+ pathCoordinates[i];
	    }
	    
	    pathElement.attributes.d.value = newPathCoordinates;
	    
    }
    //
    
};

plotHiddenDummyElement = function(dummyId, left, top) {
	
	var thisElement = new joint.shapes.basic.newRect({
        id:dummyId,
    position: { x: left-5, y: top-5 },
    size: { width: 10, height: 10 }
	});
	
	thisElement.attr('./display', 'none');
	graph.addCells([thisElement]);
	
};


////////////////////////////////////////////////////////////////////////////////////////////
init = function() {

        $('.close-btn').click(function (a) {
            $('#popup').fadeOut();
        });
        
       
        if ( window.name === tsWindow.detailWindow && tsWindow.newWindow !== null ) {
            $("#map-controls").fadeOut();
        } else {
        	$("#map-controls").fadeIn();
		}
        colorIndex= 0;
        
        if(!changeIcon){
        //$('.legend-toggle .toggle').addClass("on");
        //$("#legend").fadeIn(350);
        }
        
        if(typeof graph!=='undefined'){
              graph.clear();
              $('#networkModelContainer').empty();
        }
        graph = new joint.dia.Graph;
        
        paper = new joint.dia.Paper({
            interactive: false,
            el: $('#networkModelContainer'),
            width: "1400",
            height: 1000,
            model: graph,
            gridSize: 1
        });
        
        //paper.setOrigin(100,100);
        
        // paper.$el.css('pointer-events', 'none');
        paper.on('cell:pointerdown', 
        	    function(cellView, evt, x, y) { 
                    
                        var clickedElement = graph.getCell(cellView.model.id); 
                        if(clickedElement.get('icon_path')!=null){
                          
                        //	if (clickedElement.get('description') != '') {
	                            
                        		$('#popupImg').attr('src',clickedElement.get('icon_path'));
	                            $("#popupImg").css("background-color",clickedElement.get('bg-color'));
	                            $('#shortname').text(clickedElement.get('shortname'));
	                            $('#longname').text(clickedElement.get('longname'));
	                            $('#name').text(clickedElement.get('longname'));
	                            $('#description').text(clickedElement.get('description'));
	                            $('#vendor').text(clickedElement.get('vendor'));
	                            $('#primary_function').text(clickedElement.get('primary_function'));
	                            $('#key_interface').text(clickedElement.get('key_interface'));
	                            $('#location').text(clickedElement.get('location'));
	                            $('#network_function').text(clickedElement.get('network_function'));
	                            $('#popup').fadeIn();
                      //  	}
                        } 
                        	
                    
        	    }
        	
        
        );
        
 /**
         * Zoom In/Out Button 
         */
   	   	var w = $("#networkModelContainer").css("width");
   	   	var h = $("#networkModelContainer").css("height");
        $('#btn-zoom-in').unbind("click");
        $('#btn-zoom-in').click(function (a) {
               zoomIndex+=0.04;
               //$("#containerScrollDiv").css("transform",'scale('+ zoomIndex + ')');
               //$("#containerScrollDiv").css("transform-origin",'top left');
               $("#networkModelContainer").css("transform",'scale('+ zoomIndex + ')');
               $("#networkModelContainer").css("transform-origin",'top left');
           	   $("#networkModelContainer").css("width",w);
        	   $("#networkModelContainer").css("height",h);
               $("#containerScrollDiv").mCustomScrollbar('update');
               //$("#containerScrollDiv").mCustomScrollbar({
          	//		axis:"yx" //horizontal scrollbar
          	//	});
                  
               
        });
        $('#btn-zoom-out').unbind("click");

        $('#btn-zoom-out').click(function (a) {
           
           if(zoomIndex > 0.9){
        	   zoomIndex-=0.04;
	           //$("#containerScrollDiv").css("transform",'scale('+ zoomIndex + ')');
	           //$("#containerScrollDiv").css("transform-origin",'top left');
	    	   $("#networkModelContainer").css("transform",'scale('+ zoomIndex + ')');
	           $("#networkModelContainer").css("transform-origin",'top left');
	    	   $("#networkModelContainer").css("width",w);
	    	   $("#networkModelContainer").css("height",h);
	           
	           //$("#containerScrollDiv").mCustomScrollbar('update');
	           $("#containerScrollDiv").mCustomScrollbar('destroy');
	           $("#containerScrollDiv").mCustomScrollbar({
	      			axis:"yx", //horizontal scrollbar
					theme:"3d-thick-dark",
					scrollButtons:{enable:true},
					alwaysShowScrollbar:2
	           });
           }
     
        });
        
        
        $('.icons-toggle').unbind("click");
        $('.icons-toggle').click(function (a) {

             if($('.icons-toggle .toggle').hasClass("on")){
        	    
        	   changeIcon = true;
        	   $("#networkModelContainer").empty();
                   parseYamlIcon(recentCallFlow, recentCallFlowStep, globalCollapseDomanString);
                   
            }else{
        	   
        	   changeIcon = true;
                   $("#networkModelContainer").empty();
                   parseYaml(recentCallFlow, recentCallFlowStep, globalCollapseDomanString);
                   
            }
                
        });
        
        paper.$el.addClass('connecting');

        
};



	addCollapseEvents = function() {
		
		/*$(document).on("click",".contract",function() {
	        alert("click bound to document listening for #test-element");
	    });
		*/
		var contractElement =$('.contracttri');
		
		contractElement.unbind("click");
		contractElement.css('cursor', 'pointer');
		contractElement.click(function() {

			 if($('.icons-toggle .toggle').hasClass("on")){
	        	    
	        	   $("#networkModelContainer").empty();
	                   parseYamlIcon(recentCallFlow, recentCallFlowStep, (globalCollapseDomanString + this.id));
	                   
	            }else{
	        	   
	                   $("#networkModelContainer").empty();
	                   parseYaml(recentCallFlow, recentCallFlowStep, (globalCollapseDomanString + this.id));
	                   
	            }
			
		});
		
	};
	
	
	addExpandEvents = function() {
		
		/*$(document).on("click",".contract",function() {
	        alert("click bound to document listening for #test-element");
	    });
		*/
		var contractElement =$('.expandtri');
		
		contractElement.unbind("click");
		contractElement.css('cursor', 'pointer');
		contractElement.click(function() {

			 if($('.icons-toggle .toggle').hasClass("on")){
	        	    
	        	   $("#networkModelContainer").empty();
	                   parseYamlIcon(recentCallFlow, recentCallFlowStep, globalCollapseDomanString, (this.id));
	                   
	            }else{
	        	   
	                   $("#networkModelContainer").empty();
	                   parseYaml(recentCallFlow, recentCallFlowStep, globalCollapseDomanString, (this.id));
	                   
	            }
			
		});
		
};
