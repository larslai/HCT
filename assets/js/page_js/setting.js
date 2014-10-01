$(document).ready(function() {
    $('#setting_li').addClass('active');
    //$(".alert").alert();
        
    $("#revoke_confirm").click(function () {            
          $.ajax({ url: 'https://api.weibo.com/oauth2/revokeoauth2',
               cache: false,
               data: {"access_token": token},
               type: 'get',
               crossDomain: true,
               dataType: 'jsonp',
               success: function(response) {
                  logout();
               },
               error: function(data, status, e){
                  //alert("ajax error:"+ e);
                  logout();
               }
          });           
        // WB2.anyWhere(function(W){

        //     W.parseCMD("/oauth2/revokeoauth2", function(sResult, bStatus){
        //         if(sResult.result == "true"){                   
        //             $.ajax({ url: 'index/logout',
        //                  cache: false,
        //                  data: {'logout': '1'},
        //                  type: 'post',
        //                  dataType: 'json',
        //                  success: function(response) {
        //                     //location.href = "<?php echo site_url("/index");?>";
        //                     alert("成功取消授權, 2秒後自動導向首頁");
        //                     setTimeout(function() {
        //                       window.location.href = "<?php echo base_url();?>";
        //                     }, 2000);                                
        //                  },
        //                  error: function(data, status, e){
        //                     //alert("ajax error:"+ e);
        //                  }
        //             });                          

        //         }
                
        //     },{
        //         access_token: <?php echo json_encode($token);?>,
        //     },{
        //         method: 'GET'
        //     });
        // });             
    });      
});  
function logout(){
    $.ajax({ url: 'index/logout',
         cache: false,
         data: {'logout': '1'},
         type: 'post',
         dataType: 'json',
         success: function(response) {
            //location.href = "<?php echo site_url("/index");?>";
            alert("成功取消授權, 2秒後自動導向首頁");
            setTimeout(function() {
              window.location.href = "campaign_status";
            }, 2000);                                
         },
         error: function(data, status, e){
            //alert("ajax error:"+ e);
         }
    });       
}