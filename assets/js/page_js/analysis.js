/*
*初始
*/
function initAnalysis(){

	$('#lightbox_BG').show();
	$('#loading_excel').show();
	$('#sell_top').hide();
	$('#taiwan_sell_top').hide();
	var changeToFamous = false;
	var current_date = $.datepicker.formatDate('yymmdd', new Date());//找出目前時間
	getFoodsCategoryApi('resetCategory');//類別查詢
	//var limit_cat = true;//是否只鎖定三大類
	/*
	var top_cat = $('#top_cat').find(":selected").val();
	var top_cat_taiwan = $('#top_cat_taiwan').find(":selected").val();
	getTaiwanTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,null ,null,limit_cat,top_cat);//類別台灣商品銷售排行
	getTopProductsApi(current_date,'resetTopProducts' , changeToFamous, 'loading_excel' ,'lightbox_BG' ,limit_cat,top_cat_taiwan);//Top10
	*/

	//台灣TOP10
	var top_cat_taiwan = $('#top_cat_taiwan').find(":selected").val();
	var location_taiwan = true;
	//getTaiwanTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,null ,null,limit_cat,top_cat_taiwan , location_taiwan);//類別台灣商品銷售排行
	getTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,null ,null,top_cat_taiwan , location_taiwan);//類別台灣商品銷售排行
	//全淘寶TOP10
	var top_cat = $('#top_cat').find(":selected").val();
	location_taiwan = false;
	getTopProductsApi(current_date,'resetTopProducts' , changeToFamous, 'loading_excel' ,'lightbox_BG',top_cat , location_taiwan);//Top10

}

/*
*更新Top10
*result:API回傳的資料
*changeToFamous:是否切換為人氣排行
*/
function resetTopProducts(result,changeToFamous){
	if(result.result == false){
		alert(result.error_msg);
		return;
	}
	//更新top10
	$('#top_tens').empty();//清空top10資訊
	var str = '';
	//top10 資料組成
	for(var count = 0; count < 10; count ++){
		var url = result.top_products[count].url;
		var title = result.top_products[count].title;
		var tradeNum = result.top_products[count].tradeNum;
		var famous = result.top_products[count].famous;
		str += "<tr>";
		str += "<td>"+(count+1)+"</td>";
		str += "<td><a href=\""+url+"\" target=\"_blank\">"+title+"</a></td>";
		//要顯示銷售數字或排行數字
		if(changeToFamous == true){
			str += "<td>"+famous+"</td>";
		}else{
			str += "<td>"+tradeNum+"</td>";
		}

		//str += "<td><a href=\""+url+"\" target=\"blank\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-down\"></i></a></td>";
		//str += "<td><a href=\"\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-up\"></i></a></td>";
		str += "</tr>";
	}
	$('#top_tens').append(str);
}

/*
*更新台灣TOP100
*result:API回傳的資料
*changeToFamous:是否切換為人氣排行
*/
function resetTaiwanTopProducts(result,changeToFamous){
	if(result.result == false){
		alert(result.error_msg);
		return;
	}
	//更新台灣top100
	$('#taiwan_tops').empty();//清空台灣top100資訊
	var str = '';
	//台灣top100 資料組成
	$.each(result.top_products,function(key,value){
		var url = value.url;
		var title = value.title;
		var tradeNum = value.tradeNum;
		var famous = value.famous;
		str += "<tr>";
		str += "<td>"+(key+1)+"</td>";
		str += "<td><a href=\""+url+"\" target=\"_blank\">"+title+"</a></td>";
		//要顯示銷售數字或排行數字
		if(changeToFamous == true){
			str += "<td>"+famous+"</td>";
		}else{
			str += "<td>"+tradeNum+"</td>";
		}
		//str += "<td><a href=\""+url+"\" target=\"blank\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-down\"></i></a></td>";
		//str += "<td><a href=\"\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-up\"></i></a></td>";
		str += "</tr>";
	});

	$('#taiwan_tops').append(str);
}

/*
*Top10 切換類別
*/
function reflashTopByCat(){
	//找出是人氣/銷售
	reflashTopByType(top_type);
}
/*
*TOP10 切換人氣/銷售排行
*/
function reflashTopByType(changeToFamous){
	if(changeToFamous == true){
		$('#famous_top').hide();
		$('#sell_top').show();
		top_type = true;
		var str = "<tr>";
		str += "<th>名次</th>";
		str += "<th>商品</th>";
		str += "<th>人氣</th>";
		str += "</tr>";
	}else{
		top_type = false;
		$('#famous_top').show();
		$('#sell_top').hide();
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
	$('#top_head').empty();
	$('#top_head').append(str);

	var current_date = $.datepicker.formatDate('yymmdd', new Date());//找出目前時間
	//var limit_cat = true;
	var top_cat = $('#top_cat').find(":selected").val();
	var location_taiwan = false;
	getTopProductsApi(current_date,'resetTopProducts' , changeToFamous,'loading_excel' ,'lightbox_BG' ,top_cat,location_taiwan);//Top10
}
/*
*Top10 切換類別
*/
function reflashTopTaiwanByCat(){
	//找出是人氣/銷售
	reflashTaiwanTopByType(taiwan_top_type);
}
/*
*台灣TOP100 切換人氣/銷售排行
*/
function reflashTaiwanTopByType(changeToFamous){
	if(changeToFamous == true){
		$('#taiwan_famous_top').hide();
		$('#taiwan_sell_top').show();
		taiwan_top_type = true;
		var str = "<tr>";
		str += "<th>名次</th>";
		str += "<th>商品</th>";
		str += "<th>人氣</th>";
		str += "</tr>";
	}else{
		taiwan_top_type = false;
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
	//var limit_cat = true;
	var top_cat_taiwan = $('#top_cat_taiwan').find(":selected").val();
	var location_taiwan = true;
	getTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,'loading_excel' ,'lightbox_BG' ,top_cat_taiwan,location_taiwan);//類別台灣商品銷售排行
	//getTaiwanTopProductsApi(current_date,'resetTaiwanTopProducts' , changeToFamous,'loading_excel' ,'lightbox_BG' ,limit_cat ,top_cat_taiwan);//類別台灣商品銷售排行
}

/*
*類別選項組成
*/
function resetCategory(result){
	//alert(result);
	$('#food_categorys').empty;
	var str = '';
	//開始抓取第一層資訊
	$.each(result.first,function(cat1_key,cat1_value){
		//如果此分類只有第一層
		if(result.second[cat1_key] == null){
			str += '<li><a href="javascript:void(0);" onclick=\"recordCategory(\''+cat1_value+'\',\''+cat1_key+'\');\">'+cat1_value+'</a></li>';
		}
		else{
			str += '<li class="dropdown-submenu">';
			str += '<a tabindex="-1" href="javascript:void(0);" onclick=\"recordCategory(\''+cat1_value+'\',\''+cat1_key+'\');\">'+cat1_value+'</a>';
			str += '<ul class="dropdown-menu">';
			//開始抓第二層資訊
			$.each(result.second[cat1_key],function(cat2_key,cat2_value){
				//如果此選項只有到第二層
				if(result.third[cat2_key] == null){
					str += '<li><a href="javascript:void(0);" onclick=\"recordCategory(\''+cat2_value+'\',\''+cat2_key+'\');\">'+cat2_value+'</a></li>';
				}
				else{
					str += '<li class="dropdown-submenu">';
					str += '<a tabindex="-1" href="javascript:void(0);" onclick=\"recordCategory(\''+cat2_value+'\',\''+cat2_key+'\');\">'+cat2_value+'</a>';
					str += '<ul class="dropdown-menu">';
					//開始抓第三層資訊
					$.each(result.third[cat2_key],function(cat3_key,cat3_value){
						str += '<li><a href="javascript:void(0);" onclick=\"recordCategory(\''+cat3_value+'\',\''+cat3_key+'\');\">'+cat3_value+'</a></li>';
					})
					str += '</ul>';
					str += '</li>';
				}
			})
			str += '</ul>';
			str += '</li>';
		}
	})
	$('#food_categorys').append(str);
}

/*
*記錄使用者查詢的資訊
*cat_name:分類中文
*cat_id:分類id
*/
function recordCategory(cat_name, cat_id){
	$('#category').val(cat_name);
	$('#category_id').val(cat_id);
}

/*
*更新折線圖
*/
function reflashChart(){
	$('#lightbox_BG').show();
	$('#loading_excel').show();
	//隱藏警告用語
	$('#warning_category_search').hide();
	$('#chart_search_warning').html('');

	var category_id = $('#category_id').val();
	var category_name = $('#category').val();
	var selected_date = $('#startDate').val();
	var keyword = $('#keyword').val();
	if(category_id.length <= 0 || category_name.length <= 0 || selected_date.length <= 0){
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		$('#chart_search_warning').html('資訊不完整,請確實選擇類別與日期');
		$('#warning_category_search').fadeIn();
		return;
	}

	$('#category_head').html(category_name);

	//找出目前所要分析的折線圖種類
	var active_type_id = $('#myTab').find(".active").attr('id');
	var active_types = active_type_id.split('_');
	var active_type = active_types[0];

	getRangeDaysSellerList(category_id , selected_date , keyword , category_name , 'resetSellerListTable' ,null ,null);//賣家清單
	getLinePlot(category_id , category_name, selected_date , keyword , 'resetLinePlot' ,'loading_excel' ,'lightbox_BG');

	//記錄資訊
	$('#record_category_id').val(category_id);
	$('#record_category_name').val(category_name);
	$('#record_keyword').val(keyword);
	$('#record_date').val(selected_date);


}

/**
*匯出賣家清單
*/
function exportSellerList(){
	var category_id = $('#record_category_id').val();
	var category_name = $('#record_category_name').val();
	var keyword = $('#record_keyword').val();
	var selected_date = $('#record_date').val();

	if(category_id.length <= 0 || category_name.length <= 0 || selected_date.length <= 0){
		$('#chart_search_warning').html('尚未選擇資訊');
		$('#warning_category_search').fadeIn();
		return;
	}
	alert('即將匯出報表');
	document.getElementById("export_form").submit();
}
/*
*Top100 賣家清單 table 組成
*/
function resetSellerListTable(data){
	var titles =data.title;
	var urls = data.sellers.url;
	var sellers = data.sellers.seller;
	if(data.result == false){
		$('#chart_search_warning').html(data.error_msg);
		$('#warning_category_search').fadeIn();
		return;
	}
	$('#seller_list').empty();
	var table_str = '';
	table_str += '<table class="table-sortable" border="1" width=100% id="top_seller_list">';
	table_str += '<thead><tr>';
	$.each(titles, function(key, value) {
		table_str += '<th><span>'+value+'</span></th>';
	})
	table_str += '</tr></thead>';
	table_str += '<tbody>';
	if(sellers != null){
		$.each(sellers, function(item_id, td_datas) {

			table_str += '<tr>';
			$.each(td_datas, function(key, value) {
				table_str += '<td>';
				if(key == 'title'){
					table_str += '<a href="'+urls[item_id]+'" target="_blank">'+value+'</a>';
				}else{
					table_str += value;
				}
				table_str += '</td>';
			})
			table_str += '</tr>';
		})
	}
	table_str += '</tbody>';
	table_str += '</table>';
	$('#seller_list').append(table_str);
	if(sellers != null){
		resetSallerListTheader();
		tableSort('top_seller_list');
	}
}

/**
* table 表頭寬度調整
*/
function resetSallerListTheader(){
	$("#top_seller_list").children("thead").find("th").each(function(){
		var idx = $(this).index();
		var td = $(this).closest("table").children("tbody").children("tr:first").children("td").eq(idx);
		//alert(idx+'__'+td.width());
		$(this).width(td.width());
		//  $(this).width() > td.width() ? td.width($(this).width()) : $(this).width(td.width());
	});
}

/**
* table 可排序
*/
function tableSort(table_id){

	$('#'+table_id).tablesorter({
		sortInitialOrder: 'desc',
		sortList: [[7,1]],
		headers: {
			13:{sorter:false} ,
			14:{sorter:false} ,
			}
	});
}

/*
*重畫趨勢圖
*result:ajax回傳的資料
*/
function resetLinePlot(result){
	if(result.result == false){
		$('#chart_search_warning').html(result.error_msg);
		$('#warning_category_search').fadeIn();
		return;
	}

	//銷售額走勢資料設定
	var line_plot_title = $('#category').val();
	var line_plot_x_axis = result.line_plot_data.tradePrice.axis;
	var line_plot_data = result.line_plot_data.tradePrice.data;
	//var line_plot_data = JSON.parse('['+result.line_plot_data.tradePrice.data+']');
	var line_plot_id = 'tradePrice_line_plot';
	$('#'+line_plot_id).removeClass('close');
	var line_plot_unit = '元';
	showLinePlot(line_plot_id , line_plot_title , line_plot_x_axis , line_plot_data , line_plot_unit);

	//銷售量走勢資料設定
	var line_plot_x_axis = result.line_plot_data.tradeNum.axis;
	var line_plot_data = result.line_plot_data.tradeNum.data;
	//var line_plot_data = JSON.parse('['+result.line_plot_data.tradeNum.data+']');
	var line_plot_id = 'tradeNum_line_plot';
	$('#'+line_plot_id).removeClass('close');
	var line_plot_unit = '量';
	showLinePlot(line_plot_id , line_plot_title , line_plot_x_axis , line_plot_data , line_plot_unit);
}