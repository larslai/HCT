/*
*HOME 初始
*/
function initHome(){

	$('#lightbox_BG').show();
	$('#loading_excel').show();
	$('#line_plot_tool_tip_top_block').hide();//隱藏Line plot 商品前10 區塊
	var date = new Date();
	var current_date = $.datepicker.formatDate('yymmdd', date);
	var current_year = date.getFullYear();
	var current_month = ('0'+(date.getMonth()+1)).slice(-2);
	var current_yesterday = (date.getDate()-1).toString();
	current_yesterday = paddingLeft( current_yesterday , 2 );

	var yesterday = current_year+current_month+current_yesterday;

	//成長燈號
	//getTradeNumGrowthRateApi(current_date, 'resetTradeNumGrowthRate' ,null ,null );

	//chart
	var selected_month = $('#startDate').val();
	if(selected_month == null){
		alert('日期尚未輸入');
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		return;
	}

	getLinePlotForHomeApi(selected_month, 'resetLinePlot' ,null ,null);

	//Top100
	var changeToFamous = false;
	var cat_id = 'three_cat2';
	var location_taiwan = false;
	//找出今天與昨天top100資訊
	getTopProductsApi(yesterday, 'recordYesterdayTopProducts' , changeToFamous , null ,null ,cat_id ,location_taiwan);
	//找出今天top100資訊
	getTodayTopProducts(current_date,changeToFamous,cat_id,location_taiwan);

	//Top10
	//limit_cat = false;
	var cat_id = null;
	getTopProductsApi(current_date, 'resetTop10Products' , changeToFamous , 'loading_excel' , 'lightbox_BG' ,cat_id ,location_taiwan);
	//var chart_line_plots = getLinePlotApi(selected_month);
	//resetLinePlot(chart_line_plots);

	//$('#loading_excel').hide();
	//$('#lightbox_BG').hide();

    //new top 100
    changeToFamous = false;
    cat_id = 'three_cat2';
    location_taiwan = false;
    getNewTopProductsApi(current_date, 'resetNewTopProducts' , changeToFamous, null ,null ,cat_id ,location_taiwan);
}

/*
*重設淘寶類別成長燈號
*result:AJAX JSON 資料
*/
function resetTradeNumGrowthRate(result){
	if(result.result == false){
		alert(result.error_msg);
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		return;
	}
	$('#tradeNum_growth_rate_one').empty();
	$('#tradeNum_growth_rate_two').empty();
	$('#tradeNum_growth_rate_three').empty();
	var str = '';
	var tradeNum_growth_rate = result.tradeNum_growth_rate;

	$.each(tradeNum_growth_rate,function(cat_id,growth_rate){
		str = '';
		str += '<div class="light-block" title="~'+growth_rate.low_rate+'"><span class="light red"></span><span class="ui-tooltip" data-toggle="tooltip" data-placement="top" >'+growth_rate.growth_rate_num.low+'</span></div>';
		str += 	'<div class="light-block"  title="'+growth_rate.low_rate+'~'+growth_rate.high_rate+'"><span class="light yellow"></span><span class="ui-tooltip" data-toggle="tooltip" data-placement="top" >'+growth_rate.growth_rate_num.middle+'</span></div>';
		str += 	'<div class="light-block" title="'+growth_rate.high_rate+'~"><span class="light green"></span><span class="ui-tooltip" data-toggle="tooltip" data-placement="top"  >'+growth_rate.growth_rate_num.high+'</span></div>';
		var cat_growth_question_sign = '今日銷量與30天前銷量相減,小於'+growth_rate.low_rate+'為紅燈,大於'+growth_rate.high_rate+'為綠燈';
		if(growth_rate.cat_name == '糧油米面') {
			$('#tradeNum_growth_rate_one').append(str);
			$('#cat1_growth_question_sign').attr('title',cat_growth_question_sign);
		}else{
			if(growth_rate.cat_name == '休閑零食'){
				$('#tradeNum_growth_rate_two').append(str);
				$('#cat2_growth_question_sign').attr('title',cat_growth_question_sign);
			}else{
				$('#tradeNum_growth_rate_three').append(str);
				$('#cat3_growth_question_sign').attr('title',cat_growth_question_sign);
			}
		}
	})
}

/*
*檢查是否要開始抓淘寶三大類TOP100銷售商品
*/
function getTodayTopProducts(current_date,changeToFamous,cat_id,location_taiwan){
	//若是昨天的百大還沒抓,先等3秒後再偵測一次
	if(get_yesterday_top_products_tag == false){
		setTimeout(function(){ getTodayTopProducts(current_date,changeToFamous,cat_id,location_taiwan) }, 3000);
	}else{
		//開始抓今天百大
		getTopProductsApi(current_date, 'resetTopProducts' , changeToFamous , null ,null ,cat_id ,location_taiwan);
	}
}

/*
*記錄昨天的Top100資訊
*/
function recordYesterdayTopProducts(result,changeToFamous){
	if(result.result != false){
		$.each(result.top_products,function(key,product){
			yesterday_top_products[product.item_id] = key+1;
		});
	}
	get_yesterday_top_products_tag = true;
	return;
}

function getTopRankGrowth(item_id , today_no){
	var rank_info = new Object();

	if(yesterday_top_products[item_id] == null || yesterday_top_products[item_id] > today_no){
		rank_info['growth_rate'] = 'up';
		if(yesterday_top_products[item_id] == null){
			rank_info['growth_num'] = 'new';
		}else{
			rank_info['growth_num'] = yesterday_top_products[item_id] - today_no;
		}

	}else{
		if(yesterday_top_products[item_id] == today_no){
			rank_info['growth_rate'] = 'draw';
			rank_info['growth_num'] = 0;
		}else{
			rank_info['growth_rate'] = 'down';
			rank_info['growth_num'] = today_no - yesterday_top_products[item_id];
		}
	}
	return rank_info;
}

/*
*更新Top100
*result:API JSON資料
*changeToFamous:是否切換為人氣排行
*/
function resetTopProducts(result,changeToFamous){
	if(result.result == false){
		alert(result.error_msg);
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		return;
	}

	//更新top100
	$('#top_hundreds').empty();//清空top100資訊
	var str = '';
	//top100 資料組成
	$.each(result.top_products,function(key,product){
		var no = key+1;
		var url = product.url;
		var title = product.title;
		var tradeNum = product.tradeNum;
		str += "<tr>";
		str += "<td>"+no+"</td>";
		str += "<td><a href=\""+url+"\" target=\"_blank\">"+title+"</a></td>";
		str += "<td>"+tradeNum+"</td>";
		var top_rank = getTopRankGrowth(product.item_id , no);
		str += "<td><em>"+top_rank['growth_num']+"</em><i class=\"top-rank "+top_rank['growth_rate']+"\"></i></td>";
		//str += "<td><a href=\""+url+"\" target=\"blank\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-down\"></i></a></td>";
		//str += "<td><a href=\"\" class=\"btn btn-xs btn-danger\"><i class=\"btn-icon-only icon-chevron-up\"></i></a></td>";
		str += "</tr>";
	});
	$('#top_hundreds').append(str);
	$('#top100_cat_name').attr('title',result.cat_name);

}
/**
 * 設定本周新進百大排行榜
 * @param  object result
 * @return
 */
function resetNewTopProducts(result,changeToFamous){
    if(result.result == false){
        alert(result.error_msg);
        $('#lightbox_BG').hide();
        $('#loading_excel').hide();
        return;
    }

    //更新top100
    $('#new_top_hundreds').empty();//清空top100資訊
    var str = '';
    //top100 資料組成
    $.each(result.new_top_products,function(key,product){
        var url = product.url;
        var title = product.title;
        str += "<tr>";
        str += "<td><a href=\""+url+"\" target=\"_blank\">"+title+"</a></td>";
        str += "</tr>";
    });
    $('#new_top_hundreds').append(str);
}

/*
*更新Top10
*result:API JSON資料
*changeToFamous:是否切換為人氣排行
*/
function resetTop10Products(result,changeToFamous){
	if(result.result == false){
		alert(result.error_msg);
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		return;
	}

	//更新top10
	$('#top_tens').empty();//清空top10資訊
	var str = '';
	//top10 資料組成
	for(var count = 0; count < 10; count ++){
		var url = result.top_products[count].url;
		var title = result.top_products[count].title;
		var image = result.top_products[count].image;
		str += "<a href=\""+url+"\" target=\"_blank\" class=\"products ui-tooltip\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+title+"\" data-original-title=\""+title+"\">";
		str += "<img class=\"top-pic\" src=\""+image+"\">";
		str += "<span class=\"shortcut-label\">"+title+"</span>";
		str += "</a>";
	}
	$('#top_tens').append(str);
	$('#top10_cat_name').attr('title',result.cat_name);
}

/*
*更新 Chart line plot
*result:API JSON資料
*/
function resetLinePlot(result){
	if(result.result == false){
		alert(result.error_msg);
		$('#loading_excel').hide();
		$('#lightbox_BG').hide();
		return;
	}

	$('#line_plot').empty();//清空目前的line plot

	line_plot.products.axis =  result.line_plot.products.axis;//chart x軸資訊指定
	line_plot.products.data =result.line_plot.products.data;//chart data資訊指定
	//line_plot.products.data = JSON.parse('['+result.line_plot.products.data+']');
	line_plot.products.unit = result.line_plot.products.unit;//單位指定
	show_line_plot = result.line_plot.show_line_plot;//是否顯示 line plot 折線圖

	if(show_line_plot != 1){
		$('#loading_excel').hide();
		$('#lightbox_BG').hide();
		return;
	}

	showLinePlotForHome('line_plot' , line_plot.products.title , line_plot.products.axis , line_plot.products.data, line_plot.products.unit);//顯示折線圖
}

/*
*更新CHART
*/
function reflashLinePlot(){
	$('#lightbox_BG').show();
	$('#loading_excel').show();
	//chart
	var selected_month = $('#startDate').val();
	if(selected_month == null){
		alert('日期尚未輸入');
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		return;
	}

	getLinePlotForHomeApi(selected_month, 'resetLinePlot' ,'loading_excel' ,'lightbox_BG');
}
/*
*顯示 line plot 折線圖
*/
function showLinePlotForHome(line_plot_id , line_plot_title , line_plot_x_axis , line_plot_data , line_plot_unit){
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
			useHTML: true,
			headerFormat: '<small>{point.key}</small><table><tr><td>點擊觀看本日前10大銷量商品</td></tr>',
			footerFormat: '</table>',
			valueDecimals: 2,
			//
/*
			 positioner: function(boxWidth, boxHeight, point) {
			 	if(point.plotX < 300){
			 		//return {x: 400,y: 10};
			 	}else{
			 		return {x: 30,y: 10};
			 	}
			},
			useHTML: true,
			headerFormat: '<small>{point.key}</small><table><tr><td style="color: {series.color}">{series.name}: </td><td style="text-align: right"><b>{point.y}'+line_plot_unit+'</b></td></tr></table><table border="1" id="line_plot_tool_tip_table" class="line-plot-tool-tip-table">',
			pointFormat: '<thead><tr><th>{point.series.name}</th></tr></thead>',
			footerFormat: '</table>',
			valueDecimals: 2,
*/
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
							//alert('id:'+this.id+'_name:'+this.series.name);
							$('#lightbox_BG').show();
							$('#loading_excel').show();
							getLinePlotToolTipTop10ForHomeApi('resetLinePlotToolTipTop10Table', this.id , this.series.name);
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
/*
*顯示折線圖每日都top10
*/
function resetLinePlotToolTipTop10Table( data){
	var result = data.result;
	var error_msg =  data.error_msg;
	$('#line_plot_tool_tip_top_block').hide();
	$('#line_plot_tool_tip_top_table').empty();
	if(result == false){
		$('#lightbox_BG').hide();
		$('#loading_excel').hide();
		alert(error_msg);
		return;
	}
	var top_list = data.top10;
	var search_info = data.search_info;
	var table_str;
	$.each(top_list ,function(key,info){
		table_str += '<tr>';
		table_str += '<th>'+key+'</th>';
		table_str += '<th><a target="_blank" href="'+info['url']+'">'+info['title']+'</a></th>';
		table_str += '<th>'+info['tradeNum']+'</th>';
		table_str += '</tr>';
	});

	$('#line_plot_tool_tip_top_table').append(table_str);
	$('#line_plot_tool_tip_top_title').html('-'+search_info['date']+'/'+search_info['cat_name']);
	$('#line_plot_tool_tip_top_block').show();

	$('#lightbox_BG').hide();
	$('#loading_excel').hide();

	$('#go_to_line_plot_tool_tip_top_block').click();

	/*
	$('#line_plot_tool_tip_table').empty();
	var str = '<thead><tr><th>1</th></tr></thead>';
	 str += '<tbody><tr><td>1</td></tr></tbody>';
	$('#line_plot_tool_tip_table').append(str);
	*/
}

/*
*字串左邊補零
*/
function paddingLeft(str,lenght){
	if(str.length >= lenght)
	return str;
	else
	return paddingLeft("0"+str,lenght);
}

/**
*更新成長燈號
*/
function showUpdateGrowthRate(cat_id , account , low_rate, high_rate){
	$('#growthRate_high_rate').val(high_rate);
	$('#growthRate_low_rate').val(low_rate);
	$('#growthRate_account').val(account);
	$('#growthRate_id').val(cat_id);
	$('#lightbox_BG').show();
	$('#growthRate_lightbox').show();
}
/*
	light box 取消按鈕 function
	id:light box id
*/
function lbRemove(id){
	$('#'+id).fadeOut(300);
	$('#'+id).css("display","none");
	$('#lightbox_BG').fadeOut(300);
	$('#lightbox_BG').css("display","none");
}
/*
*更新淘寶類別成長燈號
*/
function updateGrowthRate(){
	var high_rate = $('#growthRate_high_rate').val();
	var low_rate = $('#growthRate_low_rate').val();
	var account = $('#growthRate_account').val();
	var cat_id = $('#growthRate_id').val();
	if( account.length <= 0 || cat_id.length <= 0){
		alert('資料錯誤');
		return;
	}
	if(high_rate.length <= 0 || low_rate.length <= 0 ){
		alert('請正確輸入資訊');
		return;
	}
	getUpdateGrowthRateApi(high_rate , low_rate , account , cat_id ,'completeUpdateGrowthRate');
}
/*
*顯示更新淘寶類別成長燈號狀況
*/
function completeUpdateGrowthRate(rs){
	if(rs.result == false){
		alert(rs.error_msg);
	}else{
		alert('資料更新完成,明天將會採用新數據設定');
		lbRemove('growthRate_lightbox');
	}

}