$(document).ready(function() { 
    $("select#lang_switch_select").change(function(){ 
        var selected_value = $('option:selected', this).attr("value");
        // var current_url = document.URL;
		//console.log(lang_switch_url);
		$.ajax({ url: lang_switch_url,
					 cache: false,
					 data: {"lang": selected_value},
					 type: 'post',
					 dataType: 'json',
					 success: function(response) {
					 	if(response.status == "Success"){
					 		location.reload() ;
					 	}
					 },
					 error: function(data, status, e){
					 	alert("轉換失敗 請稍後再試 ");
					 }
			});		
    });
});
