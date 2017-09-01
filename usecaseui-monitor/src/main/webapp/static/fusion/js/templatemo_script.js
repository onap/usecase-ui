
    
$(document).ready( function() {
	// sidebar menu click
	$('.templatemo-sidebar-menu li.sub a').click(function(){
		if($(this).parent().hasClass('open')) {
			$(this).parent().removeClass('open');
		} else {
			$(this).parent().addClass('open');
		}
	});  // sidebar menu click
	
  $("#list>li:gt(2)").hide();
 
  $(".more").click(
    e=>{if($(e.target).html()=="more"){
      $("#list>li:gt(2)")        
        .siblings()
        .show();
      $(e.target).html("close")
    }else{    
      $("#list>li:gt(2)")
        .hide();
      $(e.target).html("more")
    };
  });
$("#bb").click(function(){
     //点击图片后发送跳转到指定页面的事件。
    window.location.href="data-visualization.html"
})
}); // document.ready
