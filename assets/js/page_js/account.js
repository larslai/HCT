function checkCreateForm(){

	$('#warning_msg').html('');
	$('#warning').hide();
	var new_username = $('#new_username').val();
	var new_pw = $('#new_pw').val();
	var confirm_pw = $('#confirm_pw').val();
	var system_title = $('#system_title').val();
	if(new_username.length <= 0 || new_pw.length <= 0 || confirm_pw.length <= 0){
		$('#warning_msg').html('帳號密碼請正確輸入');
		$('#warning').show();
		return;
	}
	if(new_pw != confirm_pw){
		$('#warning_msg').html('兩次密碼輸入不同');
		$('#warning').show();
		return;
	}
	if(system_title.length <= 0 ){
		$('#warning_msg').html('系統標題請正確輸入');
		$('#warning').show();
		return;
	}

/*
	//表單檢查
	var checkbox_form =
	{

		analysis:$("#analysis_page").is(':checked'),
		taiwanProductAnalysis:$("#taiwanProductAnalysis_page").is(':checked'),
		taiwanShopAnalysis:$("#taiwanShopAnalysis_page").is(':checked'),
		competition:$("#competition_page").is(':checked'),
		campaign_status:$("#campaign_status_page").is(':checked'),
		build_campaign:$("#build_campaign_page").is(':checked'),
	};
	var check_flag = false;
	$.each( checkbox_form, function( key, value ) {
		if(value == true){
			check_flag = true;
		}
	});
	if(check_flag == false){
		$('#warning_msg').html('此帳號權限尚未設定');
		$('#warning').show();
		return;
	}
*/
	document.getElementById("create_form").submit();
}

function delAccount(admin_flag,del_url){
	var answer;
	if(admin_flag == 'admin'){
		answer = confirm("刪除此管理者帳號會連同相關使用者帳號一併被刪除?");
	}else{
		answer = confirm("確認刪除此使用者?");
	}
	if(answer == true){
		window.location.href = del_url;
	}
}