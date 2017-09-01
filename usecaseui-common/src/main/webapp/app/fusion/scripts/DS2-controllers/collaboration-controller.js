

appDS2.controller('collaborationControllerDS2', function ($scope,$http, $modal) { 
	console.log("modal", $modal);
	var popupModalService;
		   
		});
	

	$(document).ready(function () {

		// OUTER-LAYOUT
		panelLayout = $('body').layout({
			center__paneSelector:	".outer-center"
		,	west__paneSelector:		".outer-west"
		,	east__paneSelector:		".outer-east"
		//,	west__size:				800
		//,	east__size:				125
		,	spacing_open:			8  // ALL panes
		,	spacing_closed:			12 // ALL panes
	
		,	center__childOptions: {
			center__paneSelector:	".inner-center"
		,	west__paneSelector:		".inner-west"
		,	east__paneSelector:		".inner-east"
		,	west__size:				75
		,	east__size:				75
		,	spacing_open:			8  // ALL panes
		,	spacing_closed:			8  // ALL panes
		,	west__spacing_closed:	12
		,	east__spacing_closed:	12
		}

		 

		
		});
		
	
		function initializeConnections() {
	    	
	    	var channelId = null;
			channelId = location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');
			var videoChannelId = channelId.concat("video");
			var screenChannelId = channelId.concat("screen");
			
			videoConnection = new RTCMultiConnection(videoChannelId);
			screenConnection = new RTCMultiConnection(screenChannelId);
			
			configConnection(videoConnection,true,true,false,true,false);
		    configConnection(screenConnection,false,false,true,false,true);
	    	
	    };
	    
	    function configConnection(_connection, _audio, _video, _screen, _data, _oneway) {
	    	 _connection.session = {
	                 audio:     _audio, // by default, it is true
	                 video:     _video, // by default, it is true
	                 screen:    _screen,
	                 data:      _data,
	                 oneway:    _oneway,
	                 broadcast: false
	            };
	    	 
	    	 _connection.direction = "one-to-one";
	    	 
	    	 if( _data == true ) {
	    	 _connection.onmessage = function(e) {
	             appendDIV(e.data);

	             console.debug(e.userid, 'posted', e.data);
	             console.log('latency:', e.latency, 'ms');
	         };
	    	 }
	    
	     
	    }; 
	    
	    function assignStreamToDom() {
	    	
	    	
	    	screenConnection.screenbody = document.querySelector('.screenContainer1'); 
	    	screenConnection.videobody = document.querySelector('.videoContainer2'); 
	    	
	    	videoConnection.screenbody = document.querySelector('.screenContainer2'); 
	    	videoConnection.videobody = document.querySelector('.videoContainer1'); 
	    };
	    
		function maximizeLayout() {
	    	
			// open the panes and maximize the window.
		     top.window.resizeTo(screen.availWidth,screen.availHeight);
		     panelLayout.open('west');
		     // panelLayout.open('south'); is not working due to state initialization problem; debug to find out. so replacing the call with work around below - hack.
	    	 $(".ui-layout-toggler-south-closed").first().click();
		     
		 };
	    
	   function minimizeLayout() {
	    	
			// close the panes and minimize the window.
		     top.window.resizeTo(screen.availWidth - 2*screen.availWidth/3, screen.availHeight - screen.availHeight/2);
		     panelLayout.close('west');
		     // panelLayout.close('south'); is not working due to state initialization problem; debug to find out. so replacing the call with work around below - hack.
	    	 $(".ui-layout-toggler-south-opened").first().click();
	    };
	    
	    function emptyContainers() {
	    	 $('.screenContainer1').empty(); 
		     $('.videoContainer2').empty(); 
		    	
		     $('.screenContainer2').empty();  
		     $('.videoContainer1').empty(); 
	    };
	    
	    function appendDIV(div, parent) {
	        if (typeof div === 'string') {
	            var content = div;
	            div = document.createElement('div');
	            div.innerHTML =  content;
	          };
	          
	          var chatOutput = document.getElementById('chat-output'),
	            fileProgress = document.getElementById('file-progress');
	    
	          if (!parent) chatOutput.insertBefore(div, chatOutput.firstChild);
	            else fileProgress.insertBefore(div, fileProgress.firstChild);

	            div.tabIndex = 0;
	            $('#chat-input').focus();
	     };
	     
	     function confirmClose() {
	    	 var message = "Are you sure you want to close the session?";
	    	 
	    	/* if(popupModalService != undefined) {
	    		 popupModalService.popupConfirmWin("Confirm", message, function(){ location.reload();});
	    	 }
	    	 
	    	 else */
	    	 if (confirm(message) == true) {
	    		     location.reload();
	    		    //window.opener.location.reload(); // go to the parent window
	    			//close();
	    	    } else {
	    	        // do nothing
	    	    }
	    	 
	     };
	     
	     function notifyOthers() {
	    	 
	    	// var websocket = localStorage.getItem('notifySocket');
	    	 //if( websocket != null) {
	    		 // handling websocket peer broadcast session 
	    		 var currentUser = "${sessionScope.user.sbcid}";
	    		 var initialPageVisit = "${sessionScope.initialPageVisit}";
	    		 var remoteUser = '';
	    		 
	    		 var userList = location.search.split('chat_id=')[1].split('-');
	    		 for(var i=0;i<userList.length;i++) {
	    			 if(userList[i] !== currentUser) {
	    				 remoteUser = userList[i];
	    				 break;
	    			 }
	    		 }
	    		
	    		socketSetup(initialPageVisit, currentUser, remoteUser,"socketSend");
	    		
	    		 
	    		 
	    		 
	    	
	    	 
	     };
	     
	     function makeChatVisible() {
	    	 
	    	 $('#chat-input').css("visibility", 'visible');    	 
	     };
	    
	    
	    
	     /* on click button enabled*/
	     window.onload = function () {
	     document.getElementById('share-screen').onclick = function() {
	    
	     emptyContainers();	 
	     videoConnection.close();
		 screenConnection.close();	 
	     
	     maximizeLayout();
	     emptyContainers();
	     makeChatVisible();
	     
	     videoConnection.open();
	     screenConnection.open();
	     
	     
	     notifyOthers();
	     
	    
	    
		};
	     };

		 document.getElementById('stop-share-screen').onclick = function() {
		 
		 emptyContainers();
		 
		 videoConnection.close();
		 screenConnection.close();
		 
		 confirmClose();
		 
		};

		 document.getElementById('view-screen').onclick = function() {
		
		 maximizeLayout();
		 emptyContainers();
		 makeChatVisible();
		 
		 // timeout is required for the sharing to properly work
		 setTimeout(function() { 
			 screenConnection.connect();
		 },2000);
		 setTimeout(function() { 
			 videoConnection.connect();
		 },1000);
		
		 
		};
		
		document.getElementById('chat-input').onkeypress = function(e) {
	        if (e.keyCode !== 13 || !this.value) return;
	        var message = "<b>${model.name}</b>: " + this.value;
	        appendDIV(message);

	        // sending text message
	        videoConnection.send(message);

	        this.value = '';
	    };
	    
	    /*
	    document.getElementById('file').onchange = function() {
	    	videoConnection.send(this.files[0]);
        };
		*/
		
		
		//document.querySelector('.screenContainerPane').appenChild(document.querySelector('.screenContainer'));
		//document.querySelector('.videoContainerPane').appendChild(document.querySelector('.videoContainer'));
		
		//panelLayout.bindButton($('#share-screen'), 'open', 'outer-west');
		//panelLayout.bindButton($('#stop-share-screen'), 'close', 'outer-west');
		var videoConnection = null, screenConnection = null;
		initializeConnections();
		assignStreamToDom();
		
		// start the share
		//document.getElementById('share-screen').click();
		//
		});
	
