/*
	動態調整賣家清單excel的table欄位width
*/
function resetSallerListTheader(){
	$("#saller_list_sort_table").children("thead").find("th").each(function(){
		var idx = $(this).index();
		var td = $(this).closest("table").children("tbody")
		.children("tr:first").children("td").eq(idx);
		//alert(idx+'__'+td.width());
		$(this).width(td.width());
		//  $(this).width() > td.width() ? td.width($(this).width()) : $(this).width(td.width());
	});
}
/*
	light box 取消按鈕 function
	id:light box id
	redirect:是否要執行頁面重新整理
*/
function lbRemove(id,redirect){
	if(id == 'comment_lightbox'){
		$('#comment_content').empty();
		$('#keyword_tag_ul').empty();
	}
	$('#'+id).fadeOut(300);
	$('#'+id).css("display","none");
	$('#lightbox_BG').fadeOut(300);
	$('#lightbox_BG').css("display","none");
	if(redirect == 1){
		window.location = reload_path;
	}
}


/*
	展開下拉式選單
*/
function showList(list_id){
	$('.search-list').css("display","none");
	$('#'+list_id).slideDown(300);
}

/*
	下拉式選單取消按鈕
*/
function concelAll(type){
	if(type == 'category'){
		$('#select_category_name').val('');
		$('#keyword_category_list_ul >li').removeClass('on');
		$('#keyword_category > span').html(init_select_product_msg);
	}
}
/*
//紀錄使用者選取的file檔名
function recordSelectFile(encode_folder , encode_file_name , li_id){
	$('#select_file_name').val(encode_folder+'***'+encode_file_name);
	$('#file_list_ul > li').removeClass('on');
	$('#'+li_id).addClass('on');
	var file_name = $('#'+li_id).html();
	$('#file > span').html(file_name);

	//AJAX抓取商品資料
	getFileData(encode_folder , encode_file_name);
}
//紀錄使用者選取的商品名稱
function recordSelectCell(encode_folder , encode_file_name , encode_cell_name ,  li_id){
	$('#select_product_name').val(encode_folder+'***'+encode_file_name+'***'+encode_cell_name);
	$('#product_list_ul > li').removeClass('on');
	$('#'+li_id).addClass('on');
	var cell_name = $('#'+li_id).html();
	$('#product > span').html(cell_name);
}
*/
//紀錄使用者選擇的關鍵字類別
function recordSelectCategory(encode_category_name ,  li_id){
	$('#select_category_name').val(encode_category_name);
	$('#keyword_category_list_ul > li').removeClass('on');
	$('#'+li_id).addClass('on');
	var category_name = $('#'+li_id).html();
	$('#keyword_category > span').html(category_name);
}
/*
function getFileData(encode_folder , encode_file_name){
	if(!encode_folder ||  !encode_file_name){
		return;
	}
	$.ajax({
		url: "ajaxGetFileCells",
		global: false,
		cache: false,
		type: "POST",
		data: ({'encode_folder':encode_folder,"encode_file_name":encode_file_name}),
		async:false,
		dataType: "json",
		success: function(rs){
			var result = rs;
			if(result == -1){
				alert('資料錯誤');
			}

			resetProductCell(result);
		}
	});

}

function resetProductCell(data){
	var folder = data.folder;
	var file = data.file;
	var cells = data.cells;
	var str = '';
	str += '<li onclick="concelAll(\'product\');">'+init_concel_product_msg+'</li>';
	$.each(cells, function(index, value) {
		if(value.name != null){
			str +="<li id='cell_"+index+"' onclick=\"recordSelectCell( '"+folder+"' , '"+file+"' , '"+value.encode_name+"' , 'cell_"+index+"');\" title='"+value.name+"'>"+value.name+"</li>";
		}
	});
	$('#select_product_name').val('');
	$('#product > span').html(init_select_product_msg);
	$('#product_list_ul').empty();
	$('#product_list_ul').append(str);
}
*/
/*
	顯示 line plot 折線圖
	remote_category_type:需顯示哪一頁面的折線圖
*/
function linePlot(remote_category_type){
	if(show_line_plot != 1){
		return;
	}
	//開啟loading圖
	//$('#loading_excel').css('display','table');
	$('#now_in_page').val(remote_category_type);
	$('#line_plot').css('display','none');
	$('#product_line_plot_table_div').css('display','none');
	$('#price_filter').css('display','none');
	$('#trade_filter').css('display','none');
	$('#saller_list_div').css('display','none');
	$('#product_table_spot').css('display','none');
	switch(remote_category_type){
		case 'product_price':
			$('#line_plot').css('display','table');
			//$('#price_filter').css('display','table');
			showLinePlot(line_plot.product_price.title , line_plot.product_price.axis , line_plot.product_price.data, line_plot.product_price.unit);
			break;
		case 'product_unitPrice':
			$('#line_plot').css('display','table');
			//$('#price_filter').css('display','table');
			showLinePlot(line_plot.product_unitPrice.title , line_plot.product_unitPrice.axis , line_plot.product_unitPrice.data, line_plot.product_price.unit);
			break;
		case 'product_sale':
			$('#line_plot').css('display','table');
			//顯示價量filter
			//$('#trade_filter').css('display','table');
			showLinePlot(line_plot.product_sale.title , line_plot.product_sale.axis , line_plot.product_sale.data , line_plot.product_sale.unit);
			break;
		case 'saller_list':
			showSalerList();
			break;
		default:
			return false;
			break;
	}
	$('#remote_category > li').removeClass('on');
	$('#'+remote_category_type).addClass('on');

}
/*
	顯示 line plot 折線圖
*/
function showLinePlot(line_plot_title , line_plot_x_axis , line_plot_data , line_plot_unit){
	$('#line_plot').highcharts({
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
			valueSuffix: line_plot_unit
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
							$('#loading').css('display','table');
							showTable(this.id);
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
/*
	顯示賣家清單頁面
*/
function showSalerList(){
	$('#saller_list_div').css('display','inline');
	$('#saller_list_table').css('display','inline');
	if(start_sortable == 0){
		tableSort('saller_list_sort_table','seller_list');
		start_sortable = 1;
	}
	//關掉loding圖
	//$('#loading_excel').css('display','none');
}

/*
	商品價格,商品銷量,商品單價 table 重整
	id:line plot id,內容包含哪一天,以什麼單位排序
*/
function showTable(id){
	//ajax
	if(encode_selected_keyword == ''  && encode_selected_category == ''){
		$('#loading').css('display','none');
		alert('無法取得之前搜尋的資料');
		return;
	}

	$.ajax({
		url: "ajaxGetSellerInfo",
		global: false,
		cache: false,
		type: "POST",
		data: ({'id':id,'encode_selected_keyword':encode_selected_keyword,'encode_selected_category':encode_selected_category }),
		async:false,
		dataType: "json",
		success: function(rs){
			var result = rs;
			if(result == null){
				//alert('無資料');
				$('#loading').css('display','none');
				var str='<span>無資料</span>';
				$('#line_plot_table').empty();
				$('#line_plot_table').append(str);
				return;
			}
			if(result == -1){
				alert('資料錯誤');
				$('#loading').css('display','none');
				return;
			}
			//record_line_plot_search_date = result.search_date;
			resetTable(result.seller_data);
			$('#product_table_spot').empty();
			$('#product_table_spot').append(result.spot);
		}
	});

	$('#product_line_plot_table_div').css('display','inline');
	$('#product_table_spot').css('display','table');
	$('#line_plot_table').css('display','table');
	//tableSort();
}

/*
	商品價格,商品銷量,商品單價 table 重整
*/
function resetTable(datas){
	var remote_category = $('.remote-category >li.on').attr('id');
	var titles = datas.tables.title;
	if(datas.tables.data == null){
		$('#loading').css('display','none');
		var str='<span>無資料</span>';
		$('#line_plot_table').empty();
		$('#line_plot_table').append(str);
		$('#price_filter').css('display','none');
		$('#trade_filter').css('display','none');
		return;
	}
	if(remote_category == 'product_price' || remote_category == 'product_unitPrice'){
		$('#price_filter').css('display','table');
	}
	if(remote_category == 'product_sale'){
		$('#trade_filter').css('display','table');
	}
	var seller_url = datas.tables.data.url;
	var seller_datas = datas.tables.data.seller;
	var standard_deviation_upper = datas.tables.data.median_standard_deviation.upper; //標準差上限
	var standard_deviation_lower = datas.tables.data.median_standard_deviation.lower; //標準差下限
	var seller_id;
	var filter_tag = false;//判斷是否要產生filter前後25%,50%資料功能
	var half_gap = 0;
	var gap = 0;
	var data_length = Object.keys(seller_datas).length;
	var str ='';
	var count = 1;
	$('#standard_deviation_range').html( standard_deviation_upper +' ~ '+standard_deviation_lower);
	//找出前後25%,50%資料,有超過4筆資料才做此事情
	if(data_length >= 4){
		filter_tag = true;
		half_gap = data_length/2;
		half_gap = parseInt(half_gap);
		gap = parseInt(half_gap/2);
	}
	//str += "<form id='table_post' action='a' method='post'>";

	str += '<table  class="table-sortable" border="1" width=100% id="line_plot_sort_table">';
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
			if(remote_category == 'product_price'){
				if( standard_deviation_upper >= seller_data.price && seller_data.price >= standard_deviation_lower ){
					str += '<tr class="standard-deviation in" id="'+seller_id+'">';
				}
				else{
					str += '<tr class="standard-deviation" id="'+seller_id+'">';
				}
			}
			if(remote_category == 'product_unitPrice' ){
				if( standard_deviation_upper >= seller_data.unitPrice && seller_data.unitPrice >= standard_deviation_lower ){
					str += '<tr class="standard-deviation in" id="'+seller_id+'">';
				}
				else{
					str += '<tr class="standard-deviation" id="'+seller_id+'">';
				}
			}
			if(remote_category == 'product_sale' && filter_tag == true){
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
	//str += '</form>';
	$('#line_plot_table').empty();
	$('#line_plot_table').append(str);
	$('#loading').css('display','none');
	tableSort('line_plot_sort_table' , remote_category);
}

/*
	商品價格,商品銷量,商品單價 table sortable
	table_id:table id
	remote_category:sort 欄位
*/
function tableSort(table_id , remote_category){
	switch(remote_category){
		case 'product_price':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[4,1]]
			});
			break;
		case 'product_unitPrice':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[7,1]]
			});
			break;
		case 'product_sale':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[6,1]]
			});
			break;
		case 'seller_list':
			$('#'+table_id).tablesorter({
				sortInitialOrder: 'desc',
				sortList: [[6,1]],
				headers: {
						12:{sorter:false} ,
						13:{sorter:false} ,
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
	商品價格標準差 filter
*/
function filterPrice(type){
	if(type == 'all'){
		$('.standard-deviation').show();
	}
	else{
		$('.standard-deviation').hide();
		$('.standard-deviation.in').show();
	}
}

/*
	商品銷量 filter
	class_name:原本 class name
	sub_class_name: 新添加的class name
*/
function filterTrade(class_name , sub_class_name){
	if(class_name != ''){
		var filter_class = class_name;
		$('.upper-half').hide();
		$('.lower-half').hide();

		if(sub_class_name != ''){
			filter_class += '.'+sub_class_name;
		}
		$('.'+filter_class).show();
	}
	else{
		$('.upper-half').show();
		$('.lower-half').show();
	}
}

/*
	連結到相關網址
*/
function gotoWebsite(link_url){
	window.open(link_url);
}

/****************排程頁面******************/

/*
	建立新同義字 light box
	schedule_id: 排程 id
*/
function createSimilarWord(schedule_id){
	selected_schedule_id = schedule_id;
	$('#lightbox_BG').show();
	$('#new_similar_word').val('');
	$('#add_similar_lightbox').show();
}

/*
	顯示編輯同義字lightbox
	schedule_id: 排程 id
*/
function editSimilarWord(schedule_id){
	selected_schedule_id = schedule_id;
	var similar_word = $('#similar_'+schedule_id).html();	//找出此排程的同義字
	$('#lightbox_BG').show();
	$('#edit_similar_word').val(similar_word);
	$('#edit_similar_lightbox').show();
}

/*
	顯示刪除同義字lightbox
	schedule_id: 排程 id
*/
function deleteSimilarWord(schedule_id){
	selected_schedule_id = schedule_id;
	$('#lightbox_BG').show();
	$('#del_similar_lightbox').show();
}

/*
	刪除排程 light box
	schedule_id: 排程 id
*/
function deleteSchedule(schedule_id){
	selected_schedule_id = schedule_id;
	$('#lightbox_BG').show();
	$('#del_schedule_lightbox').show();
}

//刪除排程
function doDeleteSchedule(){
	$('#lightbox_BG').hide();
	$('#del_schedule_lightbox').hide();
	//AJAX刪資料,刪除完重新整理,顯示schedule_msg
	$.ajax({
		url: "ajaxDeleteSchedule",
		global: false,
		cache: false,
		type: "POST",
		data: ({'selected_schedule_id':selected_schedule_id}),
		async:false,
		dataType: "json",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				alert(result.error_msg);
				//$('#schedule_msg > span').html(result.error_msg);
				//$('#schedule_msg').fadeIn( 300 );
				return;
			}
			if(result.result == 0){
				alert(result.error_msg);
				window.location="setting";
				//window.location="setting?msg="+ result.error_msg;
			}
		}
	});
}

//刪除同義字
function doDeleteScheduleSimilar(){
	$('#lightbox_BG').hide();
	$('#del_similar_lightbox').hide();
	//AJAX刪資料,刪除完重新整理,顯示schedule_msg
	$.ajax({
		url: "ajaxDeleteSimilarWord",
		global: false,
		cache: false,
		type: "POST",
		data: ({'selected_schedule_id':selected_schedule_id}),
		async:false,
		dataType: "json",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				//$('#schedule_msg > span').html(result.error_msg);
				//$('#schedule_msg').fadeIn( 300 );
				alert(result.error_msg);
				return;
			}
			if(result.result == 0){
				window.location="setting?msg="+ result.error_msg;
			}
		}
	});
}

/*
	新增/編輯同義字
	type: 新增/編輯同義字
*/
function doUpdateScheduleSimilar(type){
	$('#lightbox_BG').hide();
	$('#add_similar_lightbox').hide();
	$('#edit_similar_lightbox').hide();
	var similar_word ;
	//檢查是否有輸入值
	if(type == 'add'){
		similar_word = $('#new_similar_word').val();
	}
	if(type == 'edit'){
		similar_word = $('#edit_similar_word').val();
	}
	if(!similar_word || similar_word == ''){
		alert(defalut_error_msg);
		//$('#schedule_msg > span').html(defalut_error_msg);
		//$('#schedule_msg').fadeIn( 300 );
		return;
	}
	//AJAX新增資料,新增完重新整理,顯示schedule_msg
	$.ajax({
		url: "ajaxUpdateSimilarWord",
		global: false,
		cache: false,
		type: "POST",
		data: ({'selected_schedule_id':selected_schedule_id,'similar_word':similar_word}),
		async:false,
		dataType: "json",
		success: function(rs){
			var result = rs;
			if(result.result == -1){
				//$('#schedule_msg > span').html(result.error_msg);
				//$('#schedule_msg').fadeIn( 300 );
				alert(result.error_msg);
				return;
			}
			if(result.result == 0){
				window.location="setting?msg="+ result.error_msg;
			}
		}
	});
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
		var price = parseInt(tds[6].innerHTML);
		if(max_price >= price && price >= min_price){
			$(this).show();
		}
		else{
			$(this).hide();
		}
	});
}

/*
	顯示單一商品評論
	item_id:商品id
*/
function showSellerComments(item_id){
	$.ajax({
		url: "ajaxShowSellerComments",
		global: false,
		cache: false,
		type: "POST",
		data: ({'item_id':item_id}),
		async:false,
		dataType: "json",
		success: function(rs){
			var result = rs;
			if(result.tag == false){
				alert(result.msg);
				return;
			}
			else{
				//組成評論關鍵字
				var keywords_length = result.keywords.length;
				var keywords_str = '';
				if(result.keywords !=0){
					var keywords_class;
					$.each(result.keywords, function(key, keyword){
						if(keyword.posi == 1){
							keywords_class = 'tag p';
						}else{
							keywords_class = 'tag n';
						}
						keywords_str += "<li class='"+keywords_class+"' title='"+keyword.tag+'('+keyword.count+')'+"'>"+keyword.tag+"("+keyword.count+")</li>";
					});
				}else{
					keywords_str += "<li class='tag p'>無評論標籤</li>";
				}

				//組成評論
				var str = '';
				var count = 1;
				var status = '';
				var comments_length = result.comments.length;
				var rate;
				var no;
				$.each(result.comments, function(key, comment) {
					no = count;
					if(count % 2 == 0){
						status = 'even';
					}else{
						status = 'odd';
					}
					if(comments_length == count){
						status += ' end';
					}
					count ++;
					switch(comment.rate){
						case '1':
							rate = '好評';
							break;
						case '0':
							rate = '中評';
							break;
						case '-1':
							rate = '差評';
							break;
						case '2':
							rate = '追評';
							break;
						case '3':
							rate = '圖片';
							break;
						default:
							rate = '未知';
							break;
					}
					str += '<div  class="comment-list '+status+'">';
						str += '<div class="comment-no">'+no+'</div>';
						str += '<div class="comment-list-top">';
							str += '<div class="comment-list-title username"><span class="comment-title">使用者名稱</span><span>'+comment.author+'</span></div>';
							str += '<div class="comment-list-title rate "><span class="comment-title">評價</span><span class="comment-data gray">'+rate+'</span></div>';
							str += '<div class="comment-list-title useful"><span class="comment-title">有用</span><span class="comment-data gray">'+comment.useful+'</span></div>';
						str += '</div>';
						str += '<div class="comment-list-content" title="'+comment.comment+'">'+comment.comment+'</div>';
						str += '<div class="comment-list-bottom"><div class="comment-list-title time"><span class="comment-title">發表時間</span><span>'+comment.time+'</span></div>';
						str += '</div></div>';
				});
				$('#comment_content').empty();
				$('#comment_content').append(str);
				$('#keyword_tag_ul').empty();
				$('#keyword_tag_ul').append(keywords_str);
				$('#lightbox_BG').show();
				$('#comment_lightbox').fadeIn(100);

				$('#comments_item_id').val(item_id);
				$("#saller_list_sort_table tr").click(function(){
					var tds = $(this).find("td");
					var product_name = tds[2].innerHTML;
					product_name = jQuery.trim(product_name);
					$('#comments_item_name').val(product_name);
				});
			}
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
	if(should_hide_id == 'comment_tag_show'){
		//$('#comment_keyword').addClass('show');
		$('.tag.hide').show();
	}else{
		$('.tag.hide').hide();
		//$('#comment_keyword').removeClass('show');
	}
}

/****************百大排行頁面******************/
/**
*記錄選擇的分類資料
*id:category id
*value: category name
*/
function recordCateogry(id , value){
	$('#category').val(value);
	$('#record_c_id').val(id);
	$('#record_c_name').val(value);
}

/**
*記錄搜尋的tag類型
*id:tag id
*/
function recordSortTag(id){
	$('#record_c_tag').val(id);
	document.forms[1].submit();
	return false;
}

function changePage(page_number){
	$('#record_c_page').val(page_number);
	document.forms[2].submit();
	return false;
}