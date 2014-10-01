<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');

/**
 * 共用函式
 */
class Login_model extends CI_Model{

	public function __construct()
	{
		parent::__construct();
		$this->load->model('utility_model');
	}

	public function check_login_status($session)
	{
		$login_status = false;
		if(isset($session['token']) && !empty($session['token'])){
				$login_status = true;
		}
		return $login_status;
	}

	public function get_authorize_url()
	{
		$weibo_config = $this->config->item('weibo_config');
		$o = new SaeTOAuthV2( $weibo_config["weibo_app_key"] ,  $weibo_config["weibo_app_secret"]);
		$code_url = $o->getAuthorizeURL( $weibo_config["weibo_callback_url"], 'code');
		return $code_url;
	}

	public function authorizeFromJSSDK(){
		$weibo_config = $this->config->item('weibo_config');
		$o = new SaeTOAuthV2( $weibo_config["weibo_app_key"] ,  $weibo_config["weibo_app_secret"]);
		$code_url = $o->getAuthorizeURL( $weibo_config["weibo_callback_url"], 'code');
		$JSSDKtoken = $o->getTokenFromJSSDK();
		/** sample token of JSSDK
			 array(5) {
			 ["access_token"]=>
			  string(32) "2.00srcZLEybcGgD579c0cc19a7IndXC"
			  ["refresh_token"]=>
			  string(0) ""
			  ["expires_in"]=>
			  string(6) "130816"
			  ["uid"]=>
			  string(10) "3835561916"
			  ["status"]=>
			  string(1) "1"
			}
		 */
		if (isset($JSSDKtoken['access_token']) && $JSSDKtoken['access_token'] !== '') {
			try {
				//insert token
				//查詢 screen_name
				$c = new SaeTClientV2( $weibo_config["weibo_app_key"] ,  $weibo_config["weibo_app_secret"] , $JSSDKtoken['access_token']);
				$user = $c->show_user_by_id($JSSDKtoken['uid']);
				if(isset($user['error'])){
					   //失敗
				}
				else if(isset($user['screen_name'])){
					//成功
					$screen_name = $user['screen_name'];
					$profile_image_url = $user['profile_image_url'];
					$profile_url = $user['profile_url'];
					$gender = $user['gender'];
					$avatar_hd = $user['avatar_hd'];
					$this->utility_model->insert_token($JSSDKtoken['uid'], $JSSDKtoken['access_token'], $JSSDKtoken['expires_in'], $screen_name, $profile_image_url, $profile_url, $gender, $avatar_hd);
				}
			 }
			 catch (OAuthException $e) {
			 }
		}
		//set session
		session_start();
		if (isset($JSSDKtoken['access_token']) && $JSSDKtoken['access_token'] !== '') {
			$_SESSION['token'] = $JSSDKtoken;
		}
		session_write_close();
	}

	public function checkAuthorization(){
		$weibo_config = $this->config->item('weibo_config');
		$o = new SaeTOAuthV2( $weibo_config["weibo_app_key"] ,  $weibo_config["weibo_app_secret"]);
		$code_url = $o->getAuthorizeURL( $weibo_config["weibo_callback_url"], 'code');
		$state =http_build_query(array("state"=>$this->utility_model->curPageURL()));
		//print_r($_SESSION['token']);
		if(isset($_SESSION['token']) && isset($_SESSION['logged_in_user'])){
			try {
				//insert token
				//查詢 screen_name
				$c = new SaeTClientV2( $weibo_config["weibo_app_key"] ,  $weibo_config["weibo_app_secret"] , $_SESSION['token']['access_token']);
				$user = $c->show_user_by_id($_SESSION['token']['uid']);
				if(isset($user['error'])){
					   //失敗
					if(isset($user['error_code'])){
						//http://open.weibo.com/wiki/Error_code
						if($user['error_code'] == '21315' || $user['error_code'] == '21316' ||
							$user['error_code'] == '21317' || $user['error_code'] == '21327'){
							header("Location: ". $code_url . '&'. $state);
						}
						else{

						}
					}
				}
				else if(isset($user['screen_name'])){
					//成功
					$screen_name = $user['screen_name'];
					$profile_image_url = $user['profile_image_url'];
					$profile_url = $user['profile_url'];
					$gender = $user['gender'];
					$avatar_hd = $user['avatar_hd'];
					$this->utility_model->insert_token($_SESSION['token']['uid'], $_SESSION['token']['access_token'], $_SESSION['token']['expires_in'], $screen_name, $profile_image_url, $profile_url, $gender, $avatar_hd);
				}
			}
			catch (OAuthException $e) {

			}
		}
		else{
		  header("Location: ". $code_url . '&'. $state);
		}
	}

	public function getHctLoginInfo($username , $pw){
		/*
		$DB = $this->load->database('default', TRUE);
		$sql = "SELECT * FROM `user_account` WHERE `username`='".$username."'  AND `password` = '".$pw."' ";
		$datas = $DB->query($sql);
		$datas = $datas->result();
		if($datas == null){
			$data = array(
				'result'=>false,
				'msg'=>'帳號密碼錯誤'
				);
			return $data;
		}
		$login_info = $datas[0];
		*/
		$login_info = array(
			'id'=>"1",
			'username'=>'hctadmin',
			'password'=>"450118dbf1954f9448cd331fcb4e0762",
			"group"=>"admin",
			"owner"=>"hctadmin",
			"home"=>"0",
			"analysis"=>"0",
			"taiwanShopAnalysis"=>"0",
			"taiwanProductAnalysis"=>"0",
			"competition"=>"1",
			"taiwanCompetition"=>"1",
			"campaign_status"=>"0",
			"build_campaign"=>"0",
			"schedule"=>"0",
			"schedule_analysis"=>"0",
			"top_rank"=>"0",
			"food_top_rank"=>"0",
			"create_time"=>"1400494108",
			"system_title"=>"HCT Logistics",

		);

		$data = array();
		foreach($login_info AS $key=>$value){
			if($key == 'id' ||$key == 'username' ||$key == 'password' ||$key == 'create_time'){
				if($key == 'username' ){
					 $data[$key] = $value;
				}
				continue;
			}
			if($key == 'group' || $key == 'owner' || $key == 'system_title'){
				$data[$key] = $value;
			}else{
				$data['authority'][$key] = $value;
			}
		}
		$data['result'] = true;
		return $data;
	}
}