function initCompetition(radar_data,radar_data_taiwan,cat_name,product_name){
	//隱藏指標數據
	$('#indicator_info').hide();
	$('#indicator_info_taiwan').hide();
	$('#hide_indicator_info').hide();
	$('#show_indicator_info').show();
	showData('all');//顯示全淘寶的好壞評
	spider_web('spider_web',cat_name,product_name,radar_data);//全淘寶雷達圖
	spider_web('spider_web_taiwan',cat_name,product_name,radar_data_taiwan);//台灣區雷達圖
}

function showData(area){
	$('#pos_tags').hide();
	$('#nag_tags').hide();
	$('#pos_tags_taiwan').hide();
	$('#nag_tags_taiwan').hide();
	$('#indicator_info').hide();
	$('#indicator_info_taiwan').hide();
	$('#location_tradeNum').hide();
	$('#location_tradeNum_taiwan').hide();
	now_show = area;
	if(area == 'all'){
		$('#pos_tags').show();
		$('#nag_tags').show();
		$('#location_tradeNum').show();
		if(displaying == true){
			$('#indicator_info').show();
		}
	}else{
		$('#pos_tags_taiwan').show();
		$('#nag_tags_taiwan').show();
		$('#location_tradeNum_taiwan').show();
		if(displaying == true){
			$('#indicator_info_taiwan').show();
		}
	}

}

/**
*記錄分類
*/
function recordCategory(cat_lv, cat_name){
	$('#cat_lv').val(cat_lv);
	$('#cat_name').val(cat_name);
}

/**
*送出表單前置檢察
*/
function checkForm(){
	$('#warning_msg').html('');
	$('#warning').hide();
	var cat_lv = $('#cat_lv').val();
	var cat_name = $('#cat_name').val();
	var startDate = $('#startDate').val();
	var product_keyword = $('#product_keyword').val();
	if(cat_name.length <= 0 ||cat_lv.length <= 0 ||startDate.length <= 0 ||product_keyword.length <= 0  ){
		$('#warning_msg').html('資訊不完整');
		$('#warning').show();
		return;
	}

	document.getElementById("input_form").submit();
}
function spider_web(id,cat_name, product_name,radar_data){
	$('#'+id).highcharts({

	    chart: {
	        polar: true,
	        type: 'line'
	    },
	    credits:{
			enabled : false
		},
	    title: {
	        text: product_name,
	        x: -80
	    },

	    pane: {
	    	size: '80%'
	    },

	    xAxis: {
	        categories: ['獨特性', '熱門性', '熱賣性','價格', '評論'],
	        tickmarkPlacement: 'on',
	        lineWidth: 0
	    },

	    yAxis: {
	        gridLineInterpolation: 'polygon',
	        lineWidth: 0,
	        min: 0,
	        max:10
	    },

	    tooltip: {
	    	shared: true,
	      	//pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
	    },

	    legend: {
	        align: 'right',
	        verticalAlign: 'top',
	        y: 70,
	        layout: 'vertical'
	    },

	    series: [{
	        name: cat_name,
	        data: radar_data,
	        //pointPlacement: 'on'
	    }]

	});
}

//顯示大陸售價(RMB)/每一規格售價
function show_price_detail(block_id,  show_id , hide_id){
	$('#'+block_id).show();
	$('#'+show_id).show();
	$('#'+hide_id).hide();
}

//隱藏大陸售價(RMB)/每一規格售價
function hide_price_detail(block_id,  show_id , hide_id){
	$('#'+block_id).hide();
	$('#'+show_id).show();
	$('#'+hide_id).hide();
}

//開啟大陸售價(RMB)/每一規格售價的詳細價格商品清單
function showItemDetail(price_detail_class_name , price_range , block_id){
	$('.'+price_detail_class_name).hide();
	$('.'+price_detail_class_name+'.'+price_range).show();
	$('#'+block_id).show();
}

//關閉大陸售價(RMB)/每一規格售價的詳細價格商品清單
function closePriceDetailBlock(block_id){
	$('#'+block_id).hide();
}

//呼叫價格區間內某一商品的雷達圖API
function getCompetitionRateApi(item_id , tr_id ,block_id){
	var product_info_id;
	if(block_id == 'comparison_spider_web'){
		//將選擇的商品的底色改變
		$('.unitPrice-item-detail').removeClass('on');
		$('.price-item-detail').removeClass('on');
		product_info_id = 'comparison_info';
	}else{
		$('.unitPrice-item-detail-taiwan').removeClass('on');
		$('.price-item-detail-taiwan').removeClass('on');
		product_info_id = 'comparison_info_taiwan';
	}
	$('#'+tr_id).addClass('on');
	$('#lightbox_BG').show();
	$('#loading_excel').show();

	//取得商品資訊
	getProductInfoApi(item_id , 'showProductInfo' , product_info_id ,null , null);
	//取得雷達圖
	getCompetitionRadarInfoApi(item_id , 'showCompetitionRate' , block_id ,'loading_excel' , 'lightbox_BG');
}

//顯示價格區間內某一商品的雷達圖
function showCompetitionRate(rs ,block_id){
	if(rs.result == false){
		return;
	}else{
		var radar_data = rs.taobao_data.radar_data;
		var product_name = rs.product_name;
		spider_web(block_id,'競品資訊', product_name ,radar_data);
		$('#'+block_id).show();
		//創造一個a DOM , 自動移到競品雷達圖位置
		var a = document.createElement('a');
		a.href = "#"+block_id;
		a.id =  "spider_web_point";
		document.body.appendChild(a);
		a.click();
		var a_tag = document.getElementById('spider_web_point');
		a_tag.parentNode.removeChild(a_tag);

	}
}

function showProductInfo(rs ,product_info_id){
	if(rs.result == false){
		return;
	}
	var item_info = rs.item_info;
	var table_head = [
		'日期',
		'商品',
		'品牌',
		'價格',
		'單價',
		'上海運費',
		'總價',
		'銷量',
		'評論數',
		'',
	];

	var table_content = '<thead><tr>';
	$.each(table_head,function(key,title){
		table_content += '<th>'+title+'</th>';
	});
	table_content += '</tr></thead><tbody>';
	table_content += '<td>'+item_info.date+'</td>';
	table_content += '<td><a href=\''+item_info.url+'\' target=\'_blank\'>'+item_info.title+'</a></td>';
	table_content += '<td>'+item_info.brand+'</td>';
	table_content += '<td>'+item_info.price+'</td>';
	table_content += '<td>'+item_info.unitPrice+'</td>';
	table_content += '<td>'+item_info.shanghai_express+'</td>';
	table_content += '<td>'+item_info.total_price+'</td>';
	table_content += '<td>'+item_info.tradeNum+'</td>';
	table_content += '<td>'+item_info.comments+'</td>';
	table_content +='<td><div class="btn-group btn-group-xs "><button type="button" class="btn btn-default" onclick="getSellerCommentsApi(\'item_'+item_info.item_id+'\' , \'resetCommentsTable\' ,false)">詳細評論</button></div></td>';
	table_content += '</tbody>';
	$("#"+product_info_id).empty();
	$('#'+product_info_id).append(table_content);
}