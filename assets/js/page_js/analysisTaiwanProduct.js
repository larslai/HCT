function initAnalysisTaiwanProduct(){
	$('#lightbox_BG').show();
	$('#loading_excel').show();
	$('#sell_top').hide();
	$('#taiwan_sell_top').hide();
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
		var famous = result.top_products[count].famous;
		str += "<tr>";
		str += "<td>"+(count+1)+"</td>";
		str += "<td><a href=\""+url+"\" target=\"blank\">"+title+"</a></td>";
		if(changeToFamous == true){
			str += "<td>"+famous+"</td>";
		}else{
			str += "<td>"+tradeNum+"</td>";
		}
		//str += "<td><a href=\""+url+"\" target=\"blank\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-down\"></i></a></td>";
		//str += "<td><a href=\"\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-up\"></i></a></td>";
		str += "</tr>";
	}

	$('#taiwan_tops').append(str);
}

/*
*台灣TOP10 切換人氣/銷售排行
*/
function reflashTaiwanTop(changeToFamous){
	if(changeToFamous == true){
		$('#taiwan_famous_top').hide();
		$('#taiwan_sell_top').show();
		var str = "<tr>";
		str += "<th>名次</th>";
		str += "<th>商品</th>";
		str += "<th>人氣</th>";
		str += "</tr>";
	}else{
		$('#taiwan_famous_top').show();
		$('#taiwan_sell_top').hide();
		var str = "<tr>";
		str += "<th>名次</th>";
		str += "<th>商品</th>";
		str += "<th>銷售量</th>";
		str += "</tr>";
	}
	$('#lightbox_BG').show();
	$('#loading_excel').show();

	//更新table header 資訊
	$('#taiwan_top_head').empty();
	$('#taiwan_top_head').append(str);

	var current_date = $.datepicker.formatDate('yymmdd', new Date());//找出目前時間
	var limit_cat = true;
	getTaiwanTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,'loading_excel' ,'lightbox_BG' ,limit_cat);//類別台灣商品銷售排行
}
