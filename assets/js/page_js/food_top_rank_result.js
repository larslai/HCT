/**
*送出表單前置檢察
*/
function checkForm(){
	$('#warning_msg').html('');
	$('#warning').hide();
	var c_id = $('#record_c_id').val();
	var c_name = $('#record_c_name').val();
	var start_date = $('#startDate').val();

	if(c_id.length <= 0 ||c_name.length <= 0 || start_date.length <= 0 ){

		$('#warning_msg').html('資訊不完整');
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

/**
*記錄搜尋的tag類型
*id:tag id
*/
function recordSortTag(id){
	$('#record_c_tag').val(id);
	document.forms['change_type_form'].submit();
	return false;
}

function changePage(page_number){
	$('#record_c_page').val(page_number);
	document.forms['change_page_form'].submit();
	return false;
}