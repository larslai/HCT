function init_schedule_analysis(){
	$('#hide_comment_tag_info').hide();//賣家清單-關鍵字收起符號隱藏
	$('#comment_tag_all').hide();//賣家清單-關鍵字全列表隱藏
	$('#seller_table').hide();//賣家清單table隱藏
	showLinePlotForSchedule('line_plot_1',line_plot.product_price.title , line_plot.product_price.axis , line_plot.product_price.data, line_plot.product_price.unit);
	showLinePlotForSchedule('line_plot_2',line_plot.product_unitPrice.title , line_plot.product_unitPrice.axis , line_plot.product_unitPrice.data, line_plot.product_price.unit);
	showLinePlotForSchedule('line_plot_3',line_plot.product_sale.title , line_plot.product_sale.axis , line_plot.product_sale.data , line_plot.product_sale.unit);
	resetSallerListTheader();
	tableSort('saller_list_sort_table','seller_list');
}

/*
	動態調整賣家清單excel的table欄位width
*/
function resetSallerListTheader(){
	$("#saller_list_sort_table").children("thead").find("th").each(function(){
		var idx = $(this).index();
		var td = $(this).closest("table").children("tbody").children("tr:first").children("td").eq(idx);
		//alert(idx+'__'+td.width());
		$(this).width(td.width());
		//  $(this).width() > td.width() ? td.width($(this).width()) : $(this).width(td.width());
	});
}

/*
	商品價格,商品銷量,商品單價 table sortable
	table_id:table id
	remote_category:sort 欄位
*/
function tableSort(table_id , remote_category){
	switch(remote_category){
		case 'product_price_li':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[4,1]]
			});
			break;
		case 'product_unitPrice_li':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[7,1]]
			});
			break;
		case 'product_sale_li':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[6,1]]
			});
			break;
		case 'seller_list':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[7,1]],
				headers: {
						13:{sorter:false} ,
						14:{sorter:false} ,
						}
			});
			break;
		default:
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
			});
			break;
	}
}
/*
	顯示 line plot 折線圖
*/
function showLinePlotForSchedule(id, line_plot_title , line_plot_x_axis , line_plot_data , line_plot_unit){
	$('#'+id).highcharts({
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
			headerFormat: '<small>{point.key}</small><table><tr><td>點擊觀看本日商品資訊</td></tr>',
			footerFormat: '</table>',
			valueDecimals: 2,
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
							$('#lightbox_BG').show();
							$('#loading').show();
							getSellerListPerDay(this.id , id);
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
	//關掉loding圖
	//$('#loading_excel').css('display','none');
}

/**
*送出表單前置檢察
*/
function checkForm(){
	$('#warning_msg').html('');
	$('#warning').hide();
	var c_id = $('#record_c_id').val();
	var c_name = $('#record_c_name').val();
	var start_date = $('#startDate').val();
	var keyword = $('#keyword').val();
	if(start_date.length <= 0 ){

		$('#warning_msg').html('日期尚未選取');
		$('#warning').show();
		return;
	}
	if(c_id.length <= 0 && c_name.length <= 0 && keyword.length <= 0){
		$('#warning_msg').html('類別/關鍵字請擇一');
		$('#warning').show();
		return;
	}
	document.getElementById("input_form").submit();
}

/**
*記錄分類
*/
function recordCategory(cat_lv, cat_name){
	$('#record_c_id').val(cat_lv);
	$('#record_c_name').val(cat_name);
	$('#cat_name').val(cat_name);
}

function showSellerListTable(id){
	if(id == 'saller_list'){
		$('#seller_table').show();
	}else{
		$('#seller_table').hide();
	}
}
/*
	賣家清單 filter
	type:filter 種類
	btn_id: filter buttom id
*/
function showSellerList(type,btn_id){
	//按鈕顯示調整
	var btn_class_name = $('#'+btn_id).attr('class');

	if(btn_class_name == 'saller-filter-btn on'){
		$('#'+btn_id).removeClass('on');
	}else{

		$('#saller_btn_all').removeClass('on');
		if(btn_id == 'saller_btn_upper_back' || btn_id == 'saller_btn_upper_front'){
			$('#saller_btn_upper_back').removeClass('on');
			$('#saller_btn_upper_front').removeClass('on');
		}
		if(btn_id == 'saller_btn_lower_back' || btn_id == 'saller_btn_lower_front'){
			$('#saller_btn_lower_back').removeClass('on');
			$('#saller_btn_lower_front').removeClass('on');
		}
		if(btn_id == 'saller_btn_all'){
			$('.saller-filter-btn').removeClass('on');
		}

		$('#'+btn_id).addClass('on');
	}

	startFilter(btn_id);//開始篩選
}

/*
	開始進行按鈕篩選
*/
function startFilter(btn_id){
	//開始篩選
	$('#export_type').val('');
	if(btn_id == 'saller_btn_all'){
		$('.seller-list').show();
		startPriceFilter();
		return;
	}
	$('.seller-list').hide();

	//找出有哪些是 on 的
	var stuff = [];
	var 	class_name1 = '',
		class_name2 = '';
	$('.saller-filter-btn.on').each(function() {
		stuff.push(this.id);
	});
	if(stuff == ''){
		$('.seller-list').show();
		startPriceFilter();
		return;
	}
	$('#export_type').val(stuff);
	var in_range = jQuery.inArray( 'saller_btn_in_range', stuff );
	$.each(stuff, function(key, value) {
		switch(value){
			case 'saller_btn_upper_front':
				if(in_range != -1){
					class_name1 +='.seller-list.instandard.upper.front' ;
				}else{
					class_name1 +='.seller-list.upper.front' ;
				}
				break;
			case 'saller_btn_upper_back':
				if(in_range != -1){
					class_name1 +='.seller-list.instandard.upper' ;
				}else{
					class_name1 +='.seller-list.upper' ;
				}
				break;
			case 'saller_btn_lower_front':
				if(in_range != -1){
					class_name2 +='.seller-list.instandard.lower' ;
				}else{
					class_name2 +='.seller-list.lower' ;
				}
				break;
			case 'saller_btn_lower_back':
				if(in_range != -1){
					class_name2 +='.seller-list.instandard.lower.back' ;
				}else{
					class_name2 +='.seller-list.lower.back' ;
				}
				break;
			case 'saller_btn_all':
				$('.seller-list').show();
				break;
			default:
				break;
		}
	});
	if(class_name1 == '' && class_name2 == ''){
		if(in_range != -1){
			$('.seller-list.instandard' ).show();
		}
	}else{
		if(class_name1 != ''){
			$(class_name1).show();
		}
		if(class_name2 != ''){
			$(class_name2).show();
		}
	}
	startPriceFilter();
}

/*
	價格區間篩選
*/
function startPriceFilter(){
	$("#saller_list_sort_table tbody tr:visible").each(function(){
		var tds = $(this).find('td');
		var price = parseInt(tds[7].innerHTML);
		if(max_price >= price && price >= min_price){
			$(this).show();
		}
		else{
			$(this).hide();
		}
	});
}


/**
*展開/關閉評論關鍵字
*should_hide_id:要隱藏的div id
*should_show_id:要顯示的div id
*/
function filterCommentTags(should_hide_id,should_show_id){
	$('#'+should_hide_id).hide();
	$('#'+should_show_id).show();
	if(should_hide_id == 'show_comment_tag_info'){
		$('#comment_tag_all').show();
		$('#comment_tag_top').hide();
		//$('.tag.hide').show();
	}else{
		$('#comment_tag_all').hide();
		$('#comment_tag_top').show();
		//$('.tag.hide').hide();
	}
}

/**
*	商品價格,商品銷量,商品單價 table 重整
*	id:line plot id,內容包含哪一天,以什麼單位排序
*/
function getSellerListPerDay(id, line_plot_id){

	//ajax
	if(selected_keyword == ''  && selected_cat_lv == ''){
		$('#loading').css('display','none');
		alert('無法取得之前搜尋的資料');
		return;
	}

	getSellerListPerDayApi(id , selected_keyword , selected_cat_lv , line_plot_id,  'loading' , 'lightbox_BG' , 'resetSellerListTable');
}

/**
*重組每日賣家清單
*/
function resetSellerListTable(datas , line_plot_id){
	var remote_category = $('#myTab > li.active').attr('id');

	var titles = datas.seller_data.tables.title;
	var div_id = line_plot_id+'_area';
	var table_id = line_plot_id+'_table';
	if(datas.seller_data.tables.data == null){
		alert('無資料');
		return;
	}
	var seller_url = datas.seller_data.tables.data.url;
	var seller_datas = datas.seller_data.tables.data.seller;
	var standard_deviation_upper = datas.seller_data.tables.data.median_standard_deviation.upper; //標準差上限
	var spot = datas.spot;
	var standard_deviation_lower = datas.seller_data.tables.data.median_standard_deviation.lower; //標準差下限
	var seller_id;
	var filter_tag = false;//判斷是否要產生filter前後25%,50%資料功能
	var half_gap = 0;
	var gap = 0;
	var data_length = Object.keys(seller_datas).length;
	var str = div_str ='';
	var count = 1;
	//找出前後25%,50%資料,有超過4筆資料才做此事情
	if(data_length >= 4){
		filter_tag = true;
		half_gap = data_length/2;
		half_gap = parseInt(half_gap);
		gap = parseInt(half_gap/2);
	}


	str += '<table  class="table-sortable" border="1" width=100% id="'+table_id+'">';
	//組成title
	str += '<thead>';
	//str += '<th><span></span></th>';
	$.each(titles, function(index, value) {
		str += '<th><span>'+value+'</span></th>';
	});
	str += '</thead>';
	//組成seller資料
	if(seller_datas){
		$.each(seller_datas, function(index, seller_data) {
			if(remote_category == 'product_price_li'){
				if( standard_deviation_upper >= seller_data.price && seller_data.price >= standard_deviation_lower ){
					str += '<tr class="standard-deviation in" id="'+seller_id+'">';
				}
				else{
					str += '<tr class="standard-deviation" id="'+seller_id+'">';
				}
			}
			if(remote_category == 'product_unitPrice_li' ){
				if( standard_deviation_upper >= seller_data.unitPrice && seller_data.unitPrice >= standard_deviation_lower ){
					str += '<tr class="standard-deviation in" id="'+seller_id+'">';
				}
				else{
					str += '<tr class="standard-deviation" id="'+seller_id+'">';
				}
			}
			if(remote_category == 'product_sale_li' && filter_tag == true){
				if(count <= half_gap){//前50%
					if(count <= gap){//前25%
						str += '<tr class="upper-half front" id="'+seller_id+'">';
					}else{
						str += '<tr class="upper-half back" id="'+seller_id+'">';
					}
				}else{//後50%
					if(count > half_gap + gap){//後25%
						str += '<tr class="lower-half back" id="'+seller_id+'">';
					}else{
						str += '<tr class="lower-half front"  id="'+seller_id+'">';
					}
				}
			}
			seller_id = seller_data.id;
			//str += '<td onclick="deleteTabletd();">X</td>';
			$.each(seller_data, function(key, value) {
				if(key=='seller'){
					str += '<td onclick="gotoWebsite(\''+seller_url[seller_id]+'\')">'+value+'</td>';
				}else{
					if(key != 'id'){
						str += '<td>'+value+'</td>';
					}
				}
			});
			str += '</tr>';
			count ++;
		});
	}
	str += '	</table>';

	div_str += '<div class="widget-content">';
		div_str += '<div class="seller-list-info">';
			div_str += '<div class="select-condition">'+spot+'</div>';
			div_str += '<div class="median-standard-deviation">標準差: '+standard_deviation_lower+'~'+standard_deviation_upper+'</div>';
		div_str += '</div>';
		div_str += '<div class="seller-list-table">'
			div_str += str ;
		div_str += '</div>';
	div_str += '</div>';
	$('#'+div_id).empty();
	$('#'+div_id).append(div_str);
	tableSort(table_id , remote_category);
	//alert(table_id);
	$('#go_to_'+table_id).click();
}

/**
*	連結到相關網址
*/
function gotoWebsite(link_url){
	window.open(link_url);
}
