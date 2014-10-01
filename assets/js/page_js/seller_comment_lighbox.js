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

/**
*單一商品詳細評論table組成
*/
function resetCommentsTable(result , item_id){
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
		//alert(comment.rate);
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
		var product_name = tds[3].innerHTML;
		product_name = jQuery.trim(product_name);
		$('#comments_item_name').val(product_name);
	});
}