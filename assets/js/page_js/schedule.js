/**
*暫停排程
*selected_schedule_id:排程id
*/
function pauseSchedule(selected_schedule_id){
	runOrPauseSchedule(selected_schedule_id,'pause','resetSchedule');
}
/**
*啟動排程
*selected_schedule_id:排程id
*/
function runSchedule(selected_schedule_id){
	runOrPauseSchedule(selected_schedule_id,'run','resetSchedule');
}

/**
*重新設定排程
*selected_schedule_id:排程id
*result:AJAX執行結果
*type:暫停排程或啟動排程
*/
function resetSchedule(selected_schedule_id,result,type){
	if(type == 'pause'){
		$('#'+selected_schedule_id+' .list-no').attr('title', result.status_tag);
		$('#pause_schedules').html(result.pausing_num);
		$('#execute_schedules').html(result.executing_num);
		$('#remain_schedules').html(result.remains);
		$('#'+selected_schedule_id+' .list-no').addClass('pause');
		$('#'+selected_schedule_id+' .pause-btn').hide();
		$('#'+selected_schedule_id+' .run-btn').show();		
	}
	if(type == 'run'){
		$('#'+selected_schedule_id+' .list-no').attr('title', result.status_tag);
		$('#pause_schedules').html(result.pausing_num);
		$('#execute_schedules').html(result.executing_num);
		$('#remain_schedules').html(result.remains);
		$('#'+selected_schedule_id+' .list-no').removeClass('pause');
		$('#'+selected_schedule_id+' .run-btn').hide();
		$('#'+selected_schedule_id+' .pause-btn').show();	
	}
}
/**
*	light box 取消按鈕 function
*	id:light box id
*	redirect:是否要執行頁面重新整理
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
*	連結到相關網址
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

/**
*新增/編輯同義字
*type: 新增/編輯同義字
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
	updateSimilarWordApi(similar_word);	
}
