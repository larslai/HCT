/**
*檢查表單
*/
function checkForm(){
	$('#warning').hide();
	$('#warning_msg').html('');
	var username = $('#username').val();
	var password = $('#password').val();
	if(username.length <= 0 || password.length <= 0){
		$('#warning_msg').html('請輸入帳號與密碼');
		$('#warning').show();
		return false;
	}
	document.getElementById("input_form").submit();
}