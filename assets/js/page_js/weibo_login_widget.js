// (function($){
// 	$(function(){
// 		WB2.anyWhere(function(W){
//         	W.widget.connectButton({
// 	            id: "wb_connect_btn",   
// 	            type:"3,4",
// 	            callback : {
// 	                login:function(o){  //登录后的回调函数
// 	                	//console.log(WB2.checkLogin());
// 	                    if(token === ""){
// 	                        //location.href = "<?php echo $code_url. '&state=' . base_url(); ?>";
// 	                        window.location.reload();
// 	                    }
// 	                },  
// 	                logout:function(){  //退出后的回调函数
// 						//console.log(WB2.checkLogin());
// 	                    $.ajax({ url: "index/logout",
// 	                         cache: false,
// 	                         data: {'logout': '1'},
// 	                         type: 'post',
// 	                         dataType: 'json',
// 	                         success: function(response) {
// 	                            //location.href = "/hct/";
// 	                         },
// 	                         error: function(data, status, e){
// 	                            //alert("ajax error:"+ e);
// 	                         }
// 	                    });  
// 	                }
// 	            }
//         	});	
//         });	
// 	});
// })(jQuery);
(function($){
        $(function(){
            $("#logout_link").click(function(){
                event.preventDefault();
                WB2.logout(function(){
                    $.ajax({ url: "index/logout",
                         cache: false,
                         data: {'logout': '1'},
                         type: 'post',
                         dataType: 'json',
                         success: function(response) {
                            location.href = "campaign_status";
                         },
                         error: function(data, status, e){
                            //alert("ajax error:"+ e);
                         }
                    });                     
                });
            });
        });
})(jQuery);
