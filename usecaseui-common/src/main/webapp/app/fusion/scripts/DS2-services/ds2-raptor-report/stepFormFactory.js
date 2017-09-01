(function(){
   var stepFormFactory = function($http, $compile, $q, $log) {   
           
        var factory = {};
        
		factory.getStepJSONData = function(jsonSrcName) {			
			$http({
				method: "GET",
                url: jsonSrcName,			
			}).then(function(response) {
				if (typeof response.data === 'object') {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});			
		}					
		
		
		factory.renderColumnForm = function(scope) {
			
		}
        factory.renderForm = function(jsonSrcName, elem, scope) {
                let defer = $q.defer();
                var divStepForm = document.getElementById('stepView'); 
                var textStyle = "width:300px"
                var textAreaStyle = "width:300px"
                if(divStepForm) 
                while(divStepForm && divStepForm.firstChild){
                    divStepForm.removeChild(divStepForm.firstChild);
                }
                    $http({
                    method: 'GET',
                    url: jsonSrcName
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                    	if (typeof response.data === 'object') {
	                        var json = response.data;
	                        var step = json.step;
	                        var div =d3.select(elem[0]);
	                        var modelNameDict = {};
	                        
	                        div.append("h1").attr({"class":"font-color:blue"}).text(json.content.title);
	                        div.append("div").html(json.content.contentHtml);
	                        var sections = json.content.sections;
	                        sections.forEach(function(d, i) {
	                            var sectionDiv = div.append("div");
	                            sectionDiv.attr("id", "section_"+i);
	                            if(d.title != "finalButton")
	                                sectionDiv.append("h4").text(d.title);
	                            var proj_id_hidden = sectionDiv.append("input");
	                            proj_id_hidden.attr({"type":"hidden", "value":"", "name": "proj_id", "ng-model":"proj_id", "style": "" });
	
	                            var elements = d.elements;
	                            var buttons = d.buttons;
	                            var elementTable ;
	                            if(elements) {
	                            elements.forEach(function(element, elementIndex) {
	                            	
	                                var elementBody ;
	                                if(elementIndex == 0) {
	                                    elementTable = sectionDiv.append("table").attr({"border":"0", "cellpadding":"4", "cellspacing":"0"});   
	                                    elementBody = elementTable.append("tbody");
	                                } else {
	                                    elementBody = elementTable = sectionDiv.select("tbody");
	                                }
	                                if(element.input == 'hidden') {
	                                    
	                                } else {
	                                var tr = elementBody.append("tr")
	                                var cellWidthStyle = {"width":"50%"}
	
	                                if (!(element.spanOverTwoColumns)){
	                                    var td = tr.append("td").attr({"width":"30%","class":"tdLeftColumn"});                                	
		                                if (element.input=="checkboxGroup") {
		                                	td = td.attr({"rowspan":element.checkboxes.length})
		                                }
	                                	td.text(element.displayName);
	                                	var cellWidthStyle = {"width":"500px;"}
	                                }
	                                td = tr.append("td").attr(cellWidthStyle); 
	                                var model_name_appendix='';
	                                    if (element.name in modelNameDict) {
	                                        modelNameDict[element.name]=modelNameDict[element.name]+1
	                                        model_name_appendix ='_'+modelNameDict[element.name]
	                                    } else {
	                                        modelNameDict[element.name]=0
	                                    } 
	                                if(element.input == 'text') {
	                                    var inp_text = td.append("input");
	                                    inp_text.attr({"type":"text", "value":element.defaultValue, "name": element.name, "ng-model":element.name+model_name_appendix, "style": (element.style?element.style:textStyle) });
	                                    }
	                                else if(element.input === 'checkbox') {
	                                	var temptd= td.append("label").attr({"class":"checkbox"});
	                            		var temptd2= temptd.append("input").attr({"type":"checkbox", "ng-model": element.checkbox.value});
	                            		var temptd3= temptd.append("i").attr({"class":"skin"})
	                            		var temptd3= temptd.append("span").text(element.checkbox.text);
	                                    
	                                } else if (element.input === 'radio') {
	                                        element.options.forEach(function(d,i) {
	                                            td.append("input").attr({"type":"radio", "id":element.name+"_"+d.id, "ng-model":element.name+model_name_appendix, "name": element.name, "value": d.id});
	                                            td.append("label").text(d.name); 
	                                        })
	                                } else if (element.input === 'checkboxGroup') {
	                                	
	                                	element.checkboxes.forEach(function(d,i) {
	                                		if (i==0) {
	                                		var temptd= td.append("label").attr({"class":"checkbox"});
	                                		var temptd2= temptd.append("input").attr({"type":"checkbox", "ng-model": d.value});
	                                		var temptd3= temptd.append("i").attr({"class":"skin"})
	                                		var temptd3= temptd.append("span").text(d.text);
	                                		} else {
	                                            var tr = elementBody.append("tr")
	                                            td = tr.append("td").attr({"width":"50%"}); 
	                                            var temptd= td.append("label").attr({"class":"checkbox"});
	                                    		var temptd2= temptd.append("input").attr({"type":"checkbox", "ng-model": d.value});
	                                    		var temptd3= temptd.append("i").attr({"class":"skin"})
	                                    		var temptd3= temptd.append("span").text(d.text);                                            
	                                		}
	                                	})
	                                } else if (element.input === 'textarea') {
	                                            td.append("textarea").attr({"rows":"4", "cols":"50", "ng-model":element.name+model_name_appendix, "name": element.name, "style": (element.style?element.style:textAreaStyle)});                          
	                                } 
	                                else if (element.input === 'select') {
	                                    var select = td.append("select");
	                                    // need to store options into element name;
	                                    select
	                                    .attr({"name": element.name,"b2b-dropdown":"","ng-model":element.ngModelName,"style":"width:300px"})
	                                    .attr("placeholder-text","Select");
	                                    
	                                    
	/*                                    var data = ["Option 1", "Option 2", "Option 3"]*/
	                                    var options = select
	                                        .selectAll('option')
	                                        .data(element.options).enter()
	                                        .append('option').attr("value", function(d) {return d.value})
	                                        	.attr("b2b-dropdown-list","")
	                                            .text(function (d) { return d.text; })
	                                            ;
	                                } else if (element.input === 'tabletext') {
	                                    var colArray = element.columns.split(',');
	                                    var table = td.append("table");
	                                    table.attr("border", "1");
	
	                                    colArray.forEach(function(d) {
	                                        table.append("th").text(d);
	                                    }) 
	
	                                }
	                               }
	                            })
	                            if (buttons) {
	                            		buttons.forEach(function(button, buttonIndex) {
	                                        sectionDiv.append("input").attr({"type":"button", "value": button.text, "ng-click":button.ngFunction,"class":"btn btn-alt btn-small"});
	                                    })
	                                    sectionDiv.append("br");
	                            	}
	                            } 
	                            	else { //if elements
	                                if((json.step != "1")&&(!json.hideBackButton))
	                                    sectionDiv.append("input").attr({"type":"button", "value": "Back", "ng-click":"previous()","class":"btn btn-alt btn-small"});
	                            	if((d.title == "finalButton")&(!json.hideSaveButton)) 
	                                    sectionDiv.append("input").attr({"type":"button", "value": "Save", "ng-click":"save()", "class":"btn btn-alt btn-small"});
	                                if(!json.last_step)
	                                    sectionDiv.append("input").attr({"type":"button", "value": "Next", "ng-click":"next()", "class":"btn btn-alt btn-small"});
	
	                            }
	                        })
	                        elem.html(div.html());
	                        elem.removeAttr("step-form");
	                        $compile(elem.contents())(scope);
	                        defer.resolve();
	                 } else {
	                	$log.error
                    	return $q.reject(response.data);
                    }
                   }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                	    $log.error("reponse data is not a valid JSON object");
                        defer.resolve();        
                    });
                //}
                return defer.promise;
        };
       
        return factory;
   };
   
    stepFormFactory.$inject = ['$http', '$compile', '$q'];
    
    appDS2.factory('stepFormFactory', stepFormFactory);
    
}())
