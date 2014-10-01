var API_url = 'http://127.0.0.1/srank_dashboard/index.php/ec_system_api/'; //API網址
//var API_url = 'http://srm.ideas.iii.org.tw/srank_dashboard_dev/index.php/ec_system_api/';//API網址

/*
*獲取淘寶類別成長燈號
*current_date:時間區間,格式:yymmdd
*function_name:AJAX執行完成後呼叫的function name
*loading_id:loading 圖 id
*loadingBG_id:loading 時,灰階背景圖 id
*/
/*
function getTradeNumGrowthRateApi(current_date, function_name , loading_id , loadingBG_id ){
	$.ajax({
		url: API_url+'getTradeNumGrowthRateApi',
		global: false,
		cache: false,
		type: "get",
		data: ({'current_date':current_date}),
		dataType: "jsonp",
		jsonpCallback:"TradeNumGrowthRateCallback",
		success: function(rs){
			window[function_name](rs);
			//eval(function_name + "()");
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
		}
	});
}
*/
/*
*更新淘寶類別成長燈號
*high_rate:最高範圍
*low_rate:最低範圍
*account:帳號 id
*cat_id:類別 id
*function_name:AJAX執行完成後呼叫的function name
*/
function getUpdateGrowthRateApi(high_rate , low_rate , account , cat_id , function_name){
	$.ajax({
		url: API_url+'getUpdateGrowthRateApi',
		global: false,
		cache: false,
		type: "get",
		data: ({'high_rate':high_rate,'low_rate':low_rate,"cat_id":cat_id,"account":account}),
		dataType: "jsonp",
		//jsonpCallback:"TopProductsCallback",
		success: function(rs){
			window[function_name](rs);
		}
	});
}

/*
*獲取Top 10/100商品資訊
*current_date:時間區間,格式:yymmdd
*function_name:AJAX執行完成後呼叫的function name
*changeToFamous:是否切換成人氣排行
*loading_id:loading 圖 id
*loadingBG_id:loading 時,灰階背景圖 id
*limit_cat:是否鎖定三大類-true/false
*cat_id:cat id
*location_taiwan:是否限制為台灣地區
*/
function getTopProductsApi(current_date , function_name, changeToFamous, loading_id , loadingBG_id , cat_id ,location_taiwan){
	$.ajax({
		url: API_url+'getTopProductsApi',
		global: false,
		cache: false,
		type: "get",
		data: ({'current_date':current_date,'changeToFamous':changeToFamous,"cat_id":cat_id,"location_taiwan":location_taiwan}),
		dataType: "jsonp",
		//jsonpCallback:"TopProductsCallback",
		success: function(rs){
			window[function_name](rs,changeToFamous);
			//eval(function_name + "()");
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
		}
	});
}

/*
*獲取新進百大排行榜
*current_date:時間區間,格式:yymmdd
*function_name:AJAX執行完成後呼叫的function name
*changeToFamous:是否切換成人氣排行
*loading_id:loading 圖 id
*loadingBG_id:loading 時,灰階背景圖 id
*limit_cat:是否鎖定三大類-true/false
*cat_id:cat id
*location_taiwan:是否限制為台灣地區
*/
function getNewTopProductsApi(current_date , function_name, changeToFamous, loading_id , loadingBG_id , cat_id ,location_taiwan){
    $.ajax({
        url: API_url+'getNewTopProductsApi',
        global: false,
        cache: false,
        type: "get",
        data: ({'current_date':current_date,'changeToFamous':changeToFamous,"cat_id":cat_id,"location_taiwan":location_taiwan}),
        dataType: "jsonp",
        //jsonpCallback:"TopProductsCallback",
        success: function(rs){
            window[function_name](rs,changeToFamous);
            //eval(function_name + "()");
            if(loading_id != null){
                $('#'+loading_id).hide();
            }
            if(loadingBG_id != null){
                $('#'+loadingBG_id).hide();
            }
        }
    });
}
/*
*取得食品類分類
*function_name:AJAX執行完成後呼叫的function name
*/
function getFoodsCategoryApi(function_name){
	$.ajax({
		url: API_url+'getFoodsCategoryApi',
		global: false,
		cache: false,
		type: "get",
		data: ({}),
		dataType: "jsonp",
		jsonpCallback:"foodsCategorysCallback",
		success: function(rs){
			window[function_name](rs);
			//eval(function_name + "()");
		}
	});
}

/*
*取得  line plot 折線圖-以月為單位
*selected_month:時間區間,格式:yy-mm
*function_name:AJAX執行完成後呼叫的function name
*loading_id:loading 圖 id
*loadingBG_id:loading 時,灰階背景圖 id
*/
function getLinePlotForHomeApi(selected_month , function_name , loading_id , loadingBG_id){
	$.ajax({
		url: API_url+"getLinePlotForHomeApi",
		global: false,
		cache: false,
		type: "get",
		data: ({'selected_month':selected_month}),
		dataType: "jsonp",
		jsonpCallback:"HomeLinePlotCallback",
		success: function(rs){
			window[function_name](rs);
			//eval(function_name + "()");
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
		}
	});
}
/*
*取得  line plot 折線圖
*selected_date:時間區間,格式:yy/mm/dd-yy/mm/dd
*function_name:AJAX執行完成後呼叫的function name
*category_name:分類中文名稱
*category_id:分類id
*loading_id:loading 圖 id
*loadingBG_id:loading 時,灰階背景圖 id
*/
function getLinePlot(category_id , category_name, selected_date , keyword , function_name , loading_id , loadingBG_id){
	$.ajax({
		url: API_url+"getLinePlotApi",
		global: false,
		cache: false,
		type: "get",
		data: ({'category_id':category_id,'category_name':category_name,'selected_date':selected_date,'keyword':keyword}),
		dataType: "jsonp",
		jsonpCallback:"LinePlotCallback",
		success: function(rs){
			window[function_name](rs);
			//eval(function_name + "()");
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
		}
	});
}

/**
*取得某一段時間區間的賣家清單
*/
function getRangeDaysSellerList(category_id , selected_date , keyword , category_name ,function_name , loading_id , loadingBG_id){
	$.ajax({
		url: API_url+"getRangeDaysSellerListApi",
		global: false,
		cache: false,
		type: "get",
		data: ({'category_id':category_id,'selected_date':selected_date , 'keyword':keyword,'category_name':category_name}),
		dataType: "jsonp",
		jsonpCallback:"SellerListForDaysCallback",
		success: function(rs){
			window[function_name](rs);
			//eval(function_name + "()");
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
		}
	});
}
/*
*顯示 line plot 折線圖
*/
function showLinePlot(line_plot_id , line_plot_title , line_plot_x_axis , line_plot_data , line_plot_unit){
	$('#'+line_plot_id).highcharts({
		credits:{
			enabled : false
		},
		title: {
			text: line_plot_title,
			x: -20 //center
		},
		xAxis: {
			categories:line_plot_x_axis,
			labels: {enabled:true,y : 20, rotation: -45, align: 'right' }
		},
		yAxis: {
			title: {
				text: line_plot_title
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: line_plot_unit,

		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		plotOptions: {
			series: {
				cursor: 'pointer',
				point: {
					events: {
						click: function() {
							//alert('第幾周:'+this.category+',價位:'+this.y);
							//alert('id:'+this.id);

							//showTable(this.id);
						}
					}
				},
				marker: {
				lineWidth: 2
				}
			}
		},
		series: line_plot_data
	});
}

/**監控區 function**/
/**
*暫停/啟動排程
*selected_schedule_id:排程id
*type:暫停排程或啟動排程
*function_name:AJAX執行完成後呼叫的function name
*/
function runOrPauseSchedule(selected_schedule_id, type, function_name){
	$.ajax({
		url: API_url+"runOrPauseScheduleApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'selected_schedule_id':selected_schedule_id,'type':type,'max_schedules':max_schedules,'owner':owner}),
		dataType: "jsonp",
		jsonpCallback:"ScheduleCallback",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				alert(result.error_msg);
				return;
			}else{
				window[function_name](selected_schedule_id,result,type);
			}
		}
	});
}

/**
*刪除排程
*/
function deleteScheduleApi(){

	$('#lightbox_BG').hide();
	$('#del_schedule_lightbox').hide();
	//AJAX刪資料,刪除完重新整理,顯示schedule_msg
	$.ajax({
		url:  API_url+"deleteScheduleApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'selected_schedule_id':selected_schedule_id}),
		dataType: "jsonp",
		jsonpCallback:"deleteScheduleCallback",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				alert(result.error_msg);
				return;
			}
			if(result.result == 0){
				alert(result.error_msg);
				location.reload();
			}
		}
	});
}

/**
*新增/編輯同義字
*similar_word:同意字
*/
function updateSimilarWordApi(similar_word){

	$.ajax({
		url: API_url+"updateSimilarWordApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'selected_schedule_id':selected_schedule_id,'similar_word':similar_word}),
		dataType: "jsonp",
		jsonpCallback:"updateSimilarWordCallback",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				alert(result.error_msg);
				return;
			}
			if(result.result == 0){
				//alert(result.error_msg);
				//location.reload();
				window.location="schedule?msg="+ result.error_msg;
			}
		}
	});
}



/**
*刪除同義字
*/
function deleteScheduleSimilarApi(){
	$('#lightbox_BG').hide();
	$('#del_similar_lightbox').hide();
	//AJAX刪資料,刪除完重新整理,顯示schedule_msg
	$.ajax({
		url: API_url+"deleteSimilarWordApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'selected_schedule_id':selected_schedule_id}),
		dataType: "jsonp",
		jsonpCallback:"deleteScheduleSimilarCallback",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				alert(result.error_msg);
				return;
			}
			if(result.result == 0){
				window.location="schedule?msg="+ result.error_msg;
			}
		}
	});
}

/**
*取得一天的賣家清單
*/
function getSellerListPerDayApi(id , selected_keyword , selected_cat_lv , line_plot_id ,loading_id , loadingBG_id , function_name){
	$.ajax({
		url: API_url+"getOneDaySellerListApi",
		global: false,
		cache: false,
		type: "get",
		data: ({'id':id,'selected_keyword':selected_keyword,'selected_cat_lv':selected_cat_lv}),
		dataType: "jsonp",
		jsonpCallback:"SellerListPerDayCallback",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				alert(result.error_msg);
				return;
			}
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
			if(result.result == true){
				window[function_name](result,line_plot_id);
			}
		}
	});
}


/*
	顯示單一商品評論
	item_id:商品id
	get_all:true/false-是否要抓取所有資訊,false-只顯示500筆
*/
function getSellerCommentsApi(item_id ,function_name ,get_all){
	alert('無資料');
	return;
	/*
	$.ajax({
		url: API_url+"getSellerCommentsApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'item_id':item_id , 'get_all':get_all}),
		dataType: "jsonp",
		jsonpCallback:"SellerCommentsCallback",
		success: function(rs){
			var result = rs;
			if(result.tag == false){
				alert(result.error_msg);
				return;
			}
			else{
				window[function_name](result ,item_id);
			}
		}
	});
	*/
}

/*
*查詢某日銷量前10大商品資訊
*/
function getLinePlotToolTipTop10ForHomeApi(function_name ,date_id , cat_name){
	$.ajax({
		url: API_url+"getLinePlotToolTipTop10ForHomeApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'date_id':date_id,"cat_name":cat_name}),
		dataType: "jsonp",
		success: function(rs){
			var result = rs;
			window[function_name](result);
		}
	});
}

/*
*取得競品分析雷達圖資訊
*product_key: 商品id
*record_obj: 本頁面搜尋資訊
*block_id:要顯示雷達圖的DOM id
*/
function getCompetitionRadarInfoApi(product_key , function_name , block_id , loading_id, loadingBG_id){

	$.ajax({
		url: API_url+"getCompetitionRadarInfoApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'product_key':product_key,"cat_lv": record_obj.cat_lv,"cat_name": record_obj.cat_name,"startDate": record_obj.startDate}),
		dataType: "jsonp",
		success: function(rs){
			var result = rs;
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
			if(result.result == false){
				alert(result.error_msg);
				return;
			}
			if(result.result == true){
				window[function_name](result ,block_id);
			}
		}
	});
}

/*
*取得商品資訊
*product_id:商品 id
*product_info_id:要顯示的table id
*/
function getProductInfoApi(product_id, function_name , product_info_id, loading_id, loadingBG_id){
	$.ajax({
		url: API_url+"getProductInfoApi",
		global: false,
		cache: false,
		type: "GET",
		data: ({'product_id':product_id}),
		dataType: "jsonp",
		success: function(rs){
			var result = rs;
			if(loading_id != null){
				$('#'+loading_id).hide();
			}
			if(loadingBG_id != null){
				$('#'+loadingBG_id).hide();
			}
			if(result.result == false){
				alert(result.error_msg);
				return;
			}
			if(result.result == true){
				window[function_name](result,product_info_id);
			}
		}
	});
}