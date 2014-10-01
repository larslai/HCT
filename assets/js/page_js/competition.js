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

/**
*記錄分類
*/
function recordCategory(cat_lv, cat_name){
	$('#cat_lv').val(cat_lv);
	$('#cat_name').val(cat_name);
}