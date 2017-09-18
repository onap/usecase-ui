

//$(document).ready( function() {
//
//	// sidebar menu click
//	$('.templatemo-sidebar-menu li.sub a').click(function(){
//		if($(this).parent().hasClass('open')) {
//			$(this).parent().removeClass('open');
//		} else {
//			$(this).parent().addClass('open');
//		}
//	});  // sidebar menu click
//
//
//
//    $("#list>li:gt(2)").hide();
//
//    $(".more").click(
//        e=>{if($(e.target).html()=="more"){
//        $("#list>li:gt(2)")
//            .siblings()
//            .show();
//        $(e.target).html("close")
//    }else{
//        $("#list>li:gt(2)")
//            .hide();
//        $(e.target).html("more")
//    };
//});
//$("#bb").click(function(){
//    //���ͼƬ������ת��ָ��ҳ����¼���
//    window.location.href="data-visualization.html"
//})
//}); // document.ready

var app = angular.module('uui', ['ng', 'ngRoute','ui.bootstrap','ui.grid','ngTouch','ngAnimate',
  'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection',
  'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping','ui.grid.pagination'
    ,'ui.grid.autoResize']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/alarm', {
            templateUrl: 'app/uui/fusion/scripts/view-models/alarm.html'
        })
        .when('/pre', {
            templateUrl: 'app/uui/fusion/scripts/view-models/performance.html'
        })
        .when('/pre-details', {
            templateUrl: 'app/uui/fusion/scripts/view-models/performance-details.html'
        })
      .when('/common', {
        templateUrl: 'app/uui/fusion/scripts/view-models/left-menu.html'
      })
        .otherwise({redirectTo: '/common'})
});
