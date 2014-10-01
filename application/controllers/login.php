<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');
ini_set("memory_limit","2048M");
set_time_limit(0);

class Login extends CI_Controller {
	public $curl_url;
	public $token;
	public $weibo_info = array();

	public function __construct(){
		parent::__construct();
		session_start();
		$this->config->load('common_config', TRUE);
		$common_config = $this->config->item('common_config');
		$this->curl_url = $common_config['curl_url'];
		require_once( $common_config['saetv2']);

		if(!( (!isset($_SESSION['login_status']) ||  (isset($_SESSION['login_status']) && $_SESSION['login_status'] != TRUE)))){
			redirect("/main_page/home");
			exit;
		}
		$this->token = isset($_SESSION['token']['access_token'])?$_SESSION['token']['access_token']:'' ;
		session_write_close();
		$this->load->model('campaign_model');
		$this->load->model('utility_model');
		$this->load->model('login_model');
		//抓取微博資訊
		$this->weibo_info = $this->getWeiboInfo();
	}

	public function index(){
		$data['error_msg'] = isset($_GET['msg']) ? urldecode(base64_decode($_GET['msg']))   : null;
		//記錄微博資訊
		$data['token'] = $this->token;
		$data['code_url'] = $this->weibo_info['code_url']. '&'. $this->weibo_info['state'];
		$this->load->view('login',$data);
	}

	public function doLogin(){

		$username = isset($_POST['username']) ? trim($_POST['username']) : null;
		$password = isset($_POST['password']) ? trim($_POST['password']) : null;
		if($username  == null || $password == null){
			$data['error_msg'] = urlencode(base64_encode('請填寫帳號密碼'));
			redirect('login?msg='.$data['error_msg']);
			return;
		}
		$encode_pw = md5($password);
		/*
		$login_info = $this->getLoginApi($username , $encode_pw);
		*/
		$login_info = $this->login_model->getHctLoginInfo($username , $encode_pw);

		if($login_info['result'] == false){
			$data['error_msg'] = urlencode( base64_encode($login_info['msg'])) ;
			redirect('login?msg='.$data['error_msg']);
			return;
		}

		session_start();
		$_SESSION['username'] = $login_info['username'];
		$_SESSION['login_status'] = true;
		$_SESSION['group'] = $login_info['group'];
		$_SESSION['owner'] = $login_info['owner'];
		$_SESSION['authority'] = $login_info['authority'];
		$_SESSION['system_title'] = $login_info['system_title'];
		session_write_close();

		//redirect('/main_page/home');
		redirect('/main_page/doTaiwanCompetition');
	}

	private function getLoginApi($username , $pw){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getLoginApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query( array( "username"=>$username, "pw"=>$pw ) ));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$login_info = curl_exec($ch);
		$login_info = json_decode($login_info);
		curl_close($ch);
		return $login_info ;
	}

	/**
	*將多層Obj轉array
	*stdclassobject: obj
	*/
	private function std_class_object_to_array($stdclassobject){
		$array = array();
		$_array = is_object($stdclassobject) ? get_object_vars($stdclassobject) : $stdclassobject;

		foreach ($_array as $key => $value) {
			$value = (is_array($value) || is_object($value)) ? $this->std_class_object_to_array($value) : $value;
			$array[$key] = $value;
		}

		return $array;
	}
	/**
	*載入微博登入資訊
	*/
	private function getWeiboInfo(){

		$weibo_config = $this->config->item('weibo_config');
		$o = new SaeTOAuthV2( $weibo_config["weibo_app_key"] ,  $weibo_config["weibo_app_secret"]);
		$code_url = $o->getAuthorizeURL( $weibo_config["weibo_callback_url"], 'code');
		$state =http_build_query(array("state"=>$this->utility_model->curPageURL()));
		$data = array(
			'code_url'=>$code_url,
			'state'=>$state,
			);
		return $data;
	}
}
