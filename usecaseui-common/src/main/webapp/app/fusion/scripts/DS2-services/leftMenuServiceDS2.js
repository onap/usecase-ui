function isRealValue(obj){
	return obj && obj !== "null" && obj!== "undefined";
}
appDS2.factory('LeftMenuServiceDS2', function ($http,$log, $q) {
	return {
		getLeftMenu: function() {
			return $http.get('get_menu')
			.then(function(response) {
					if (typeof response.data === 'object') {
						return response.data;
					} else {
						return $q.reject(response.data);
					}
			}, function(response) {
				// something went wrong
				return $q.reject(response.data);
			});
		},
		getAppName: function() {
			return $http.get('get_app_name')
			.then(function(response) {
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
		
	};
});

/* check if the body height has changed */
function onElementHeightChange(elm, callback){
	if (!elm) {
		console.log('onElementHeightChange: null element!');
		return;
	}
    var lastHeight = elm.clientHeight, newHeight;
    (function run(){
        newHeight = elm.clientHeight;
        if( lastHeight != newHeight )
            callback();
        lastHeight = newHeight;

        if( elm.onElementHeightChangeTimer )
            clearTimeout(elm.onElementHeightChangeTimer);
        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

/*adjust height of left menu*/
function adjustLeftMenuHeight() {
	
	try{
		var footerTop = $('.footer-container').offset().top;
		var scrollTop = $(window).scrollTop();
		$(".menu-container").css({
			"height" : footerTop- scrollTop,
		});
	}catch(err){
		console.log('adjustLeftMenuHeight failed', err)
	}
}
/* adjust left menu height on scroll */
window.onscroll = function (e) {  
	adjustLeftMenuHeight();
} 

/* adjust left menu height on page load */
$(function() {
	adjustLeftMenuHeight();
});


onElementHeightChange(document.body, function(){
	adjustLeftMenuHeight();
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
