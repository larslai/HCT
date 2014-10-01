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