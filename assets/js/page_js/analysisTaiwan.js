function initAnalysisTaiwan(){
	$('#lightbox_BG').show();
	$('#loading_excel').show();
	var changeToFamous = false;
	var current_date = $.datepicker.formatDate('yymmdd', new Date());//找出目前時間
	var limit_cat = true;
	getTaiwanTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,'loading_excel' ,'lightbox_BG' ,limit_cat);//類別台灣商品銷售排行
}


/*
*更新台灣TOP10
*result:API回傳的資料
*changeToFamous:是否切換為人氣排行
*/
function resetTaiwanTopProducts(result,changeToFamous){
	if(result.result == false){
		alert(result.error_msg);
		return;
	}
	//更新台灣top10
	$('#taiwan_tops').empty();//清空台灣top10資訊
	var str = '';
	//台灣top10 資料組成
	for(var count = 0; count < 10; count ++){
		var url = result.top_products[count].url;
		var title = result.top_products[count].title;
		var tradeNum = result.top_products[count].tradeNum;
		str += "<tr>";
		str += "<td>"+(count+1)+"</td>";
		str += "<td><a href=\""+url+"\" target=\"blank\">"+title+"</a></td>";
		str += "<td>"+tradeNum+"</td>";
		//str += "<td><a href=\""+url+"\" target=\"blank\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-down\"></i></a></td>";
		//str += "<td><a href=\"\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-up\"></i></a></td>";
		str += "</tr>";
	}

	$('#taiwan_tops').append(str);
}
