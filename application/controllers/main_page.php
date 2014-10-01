<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');
ini_set("memory_limit","2048M");
set_time_limit(0);

class Main_page extends CI_Controller {
	public $categorys_template_json;
	public $taiwan_products_template_json;
	public $product_info_template_json;
	public $comtepition_rate_template_json;
	public $TW_comtepition_rate_template_json;

	public $curl_url;
	public $token;
	public $admin_account;
	public $taiwan_hct_seller ;//HCT品台灣賣家
	public $weibo_info = array();

	public $username ;
	public $group;
	//將某些active對應到相關SESSION名稱
	public $reactive_name = array(
		'doCompetition'=>'competition',
		'doTaiwanCompetition'=>'taiwanCompetition',
		'taiwanProductDetail'=>'taiwanProductAnalysis',
		'doExportAnalysisData'=>'analysis',
		'doExportTop100'=>'home',
		);

	public function __construct(){

		parent::__construct();
		$this->load->helper('url');
		session_start();
		$this->config->load('common_config', TRUE);
		$common_config = $this->config->item('common_config');
		$this->curl_url = $common_config['curl_url'];
		$this->admin_account = $common_config['admin_account'];
		$this->taiwan_hct_seller = $common_config['taiwan_hct_seller'];
		//json測試資料區
		$this->config->load('competition_template_json.php', TRUE);
		$competition_template_json = $this->config->item('competition_template_json');
		$this->categorys_template_json = $competition_template_json['categorys_template_json'];
		$this->taiwan_products_template_json = $competition_template_json['taiwan_products_template_json'];
		$this->product_info_template_json = $competition_template_json['product_info_template_json'];
		$this->comtepition_rate_template_json = $competition_template_json['comtepition_rate_template_json'];
		$this->TW_comtepition_rate_template_json = $competition_template_json['TW_comtepition_rate_template_json'];

      		require_once( $common_config['saetv2']);
		if(!isset($_SESSION['login_status']) ||  (isset($_SESSION['login_status']) && $_SESSION['login_status'] != TRUE)){
			redirect("login");
			exit;
		}
		$ci =& get_instance();
		$active_name = $ci->router->method;

		if(isset($this->reactive_name[$active_name])){
			$active_name = $this->reactive_name[$active_name];
		}

		//檢查使用者是否有觀看此頁面權限
		if(!isset($_SESSION['authority'][$active_name]) || $_SESSION['authority'][$active_name] != 1){
			//redirect("/main_page/home");
			redirect("/main_page/doTaiwanCompetition");
			exit;
		}

		$this->token = isset($_SESSION['token']['access_token'])?$_SESSION['token']['access_token']:'' ;
		$this->username = $_SESSION['username'];
		$this->group = $_SESSION['group'];
		session_write_close();
		$this->load->model('campaign_model');
		$this->load->model('utility_model');
		$this->load->model('login_model');
		//抓取微博資訊
		$this->weibo_info = $this->getWeiboInfo();
	}

	/**
	*競品分析
	*/
	public function competition(){
		$data = array();

		//抓取分類
		$categorys_obj = $this->getFoodsCategoryApi();
		$data['categorys'] = $this->std_class_object_to_array($categorys_obj);

		//取得昨天至前30天的日期
		$yesterday = date("Y/m/d", strtotime('-1 day'));
		$thirty_days_ago = date("Y/m/d", strtotime($yesterday.'-30 day'));
		$data['limit_date'] = $thirty_days_ago.'-'.$yesterday;
		//記錄微博資訊
		$data['token'] = $this->token;
		$data['code_url'] = $this->weibo_info['code_url']. '&'. $this->weibo_info['state'];
		$this->load->view('competition',$data);
	}

	/**
	*競品分析結果
	*/
	public function doCompetition(){
		$data = array();
		/*
		$cat_lv = isset($_POST['cat_lv'])?trim($_POST['cat_lv']): null;
		$cat_name = isset($_POST['cat_name'])?trim($_POST['cat_name']): null;
		$startDate = isset($_POST['startDate'])?trim($_POST['startDate']): null;
		$product_keyword = isset($_POST['product_keyword'])?trim($_POST['product_keyword']): null;
		$brand = isset($_POST['brand'])?trim($_POST['brand']): null;
		$taiwan_price = isset($_POST['taiwan_price'])?trim($_POST['taiwan_price']): null;
		$unit = isset($_POST['unit'])?trim($_POST['unit']): null;
		*/
		$cat_lv = "cat2_50035978";
		$cat_name = "糧油米面";
		$startDate = "2014/08/31-2014/09/30";
		$product_keyword = "牛肉";
		$brand = null;
		$taiwan_price = null;
		$unit = null;

		//var_dump($cat_lv.'++'.$cat_name);exit;
		//抓取分類
		//$categorys_obj = $this->getFoodsCategoryApi();
		$categorys_obj = json_decode($this->categorys_template_json);
		$data['categorys'] = $this->std_class_object_to_array($categorys_obj);

		//取得昨天至前30天的日期
		$yesterday = date("Y/m/d", strtotime('-1 day'));
		$thirty_days_ago = date("Y/m/d", strtotime($yesterday.'-30 day'));
		$data['limit_date'] = $thirty_days_ago.'-'.$yesterday;
		if($cat_lv == null || $cat_name == null || $startDate == null || $product_keyword == null ){
			$data['msg'] = '參數錯誤,請重新填寫';
			$this->load->view('competition' ,$data);
			return;
		}

		//五大指標-全淘寶
		//$limit_cat = '美食特產';
		//$row_special_rates = $this->getCompetitionRateApi($cat_lv,$cat_name, $startDate ,$product_keyword, $brand,$taiwan_price ,$unit);
		$row_special_rates =  json_decode($this->comtepition_rate_template_json);
		$row_special_rates =$this->std_class_object_to_array($row_special_rates);
		if($row_special_rates['result'] == false){
			$data['msg'] = $row_special_rates['error_msg'];
			$this->load->view('competition' ,$data);
			return;
		}
		$special_rates = $row_special_rates['taobao_data'];
		$data['radar_data'] = $special_rates['radar_data'];//雷達圖
		//$data['radar_data_info'] = $this->splitRadarData($data['radar_data']);//將雷達數據拆出來
		$data['radar_data_function'] = $special_rates['radar_data_function'];//指標公式
		$data['arrange_data'] = $special_rates['arrange_data'];//指標數據
		$data['pos_comments'] = $special_rates['pos_comments'];//好評率資訊
		$data['nag_comments'] = $special_rates['nag_comments'];//壞評率資訊
		$data['avg_price'] = round($special_rates['arrange_data']['price']['avg_price'],0);//大陸售價(RMB)
		$data['avg_unitPrice'] = round($special_rates['arrange_data']['price']['avg_unitPrice'],0);//每一規格售價
		$data['find_product_info'] = $special_rates['arrange_data']['price']['find_product_info'];//淘寶前100名價格數據
		$data['top_product_info'] = $special_rates['arrange_data']['price']['top_product_info'];//淘寶關鍵字前100名價格數據
		$data['price_detail'] =  $special_rates['price_detail'];//大陸售價(RMB)詳細資訊
		$data['unitPrice_detail'] =  $special_rates['unitPrice_detail'];//每一規格售價詳細資訊
		$data['tradeNum_by_location'] =  $special_rates['tradeNum_by_location'];//每個地區的銷量
		//產地台灣
		$special_rates_taiwan = $row_special_rates['taobao_data_taiwan'];
		$data['radar_data_taiwan'] = $special_rates_taiwan['radar_data'];
		//$data['radar_data_info_taiwan'] = $this->splitRadarData($data['radar_data_taiwan']);//將雷達數據拆出來
		$data['radar_data_function_taiwan'] = $special_rates_taiwan['radar_data_function'];//指標公式
		$data['arrange_data_taiwan'] = $special_rates_taiwan['arrange_data'];
		$data['pos_comments_taiwan'] = $special_rates_taiwan['pos_comments'];
		$data['nag_comments_taiwan'] = $special_rates_taiwan['nag_comments'];
		$data['avg_price_taiwan'] = round($special_rates_taiwan['arrange_data']['price']['avg_price'],0);
		$data['avg_unitPrice_taiwan'] = round($special_rates_taiwan['arrange_data']['price']['avg_unitPrice'],0);
		$data['find_product_info_taiwan'] = $special_rates_taiwan['arrange_data']['price']['find_product_info'];//淘寶產地台灣前100名價格數據
		$data['top_product_info_taiwan'] = $special_rates_taiwan['arrange_data']['price']['top_product_info'];//淘寶產地台灣關鍵字前100名價格數據
		$data['price_detail_taiwan'] =  $special_rates_taiwan['price_detail'];//大陸售價(RMB)詳細資訊
		$data['unitPrice_detail_taiwan'] =  $special_rates_taiwan['unitPrice_detail'];//每一規格售價詳細資訊
		$data['tradeNum_by_location_taiwan'] =  $special_rates_taiwan['tradeNum_by_location'];//每個地區的銷量
		//記錄使用者輸入的資訊
		$data['record'] = array(
			'cat_lv'=>$cat_lv,
			'cat_name'=>$cat_name,
			'startDate'=>$startDate,
			'product_keyword'=>$product_keyword,
			'brand'=>$brand,
			'taiwan_price'=>$taiwan_price,
			'unit'=>$unit,
			);
		//記錄微博資訊
		$data['token'] = $this->token;
		$data['code_url'] = $this->weibo_info['code_url']. '&'. $this->weibo_info['state'];
		$this->load->view('competition_result',$data);
	}

	/**
	*品台灣競品分析
	*/
	public function taiwanCompetition(){
		$data = array();

		//抓取分類
		$categorys_obj = $this->getFoodsCategoryApi();
		$data['categorys'] = $this->std_class_object_to_array($categorys_obj);

		//抓取HCT品台灣商品
		$taiwan_products = $this->getTaiwanProductsApi($this->taiwan_hct_seller);
		$data['taiwan_products']= $taiwan_products['taiwan_products'];

		//取得昨天至前30天的日期
		$yesterday = date("Y/m/d", strtotime('-1 day'));
		$thirty_days_ago = date("Y/m/d", strtotime($yesterday.'-30 day'));
		$data['limit_date'] = $thirty_days_ago.'-'.$yesterday;

		//記錄微博資訊
		$data['token'] = $this->token;
		$data['code_url'] = $this->weibo_info['code_url']. '&'. $this->weibo_info['state'];
		$this->load->view('taiwan_competition',$data);
	}

	/**
	*品台灣商品競品分析結果
	*/
	public function doTaiwanCompetition(){
		$data = array();
/*
		$cat_lv = isset($_POST['cat_lv'])?trim($_POST['cat_lv']): null;
		$cat_name = isset($_POST['cat_name'])?trim($_POST['cat_name']): null;
		$startDate = isset($_POST['startDate'])?trim($_POST['startDate']): null;
		$product_key = isset($_POST['product_name'])?trim($_POST['product_name']): null;\
*/
		$cat_lv = "cat3_50103359";
		$cat_name = "茶葉";
		$startDate = "2014/08/31-2014/09/30";
		$product_key = '37607730536_39%E5%8F%B7%E6%93%82%E8%8C%B6+%E5%85%83%E6%B0%94%E8%BD%BB%E6%93%82%E8%8C%B6%285%E5%8C%85%29%7CPINTWN+%E8%BF%9B%E5%8F%A3%E9%A5%AE%E5%93%81%E9%A3%9F%E5%93%81%E5%AE%A2%E5%AE%B6+%E5%8F%B0%E6%B9%BE%E7%89%B9%E4%BA%A7';

		//抓取分類
		//$categorys_obj = $this->getFoodsCategoryApi();
		$categorys_obj = json_decode($this->categorys_template_json);
		$data['categorys'] = $this->std_class_object_to_array($categorys_obj);

		//抓取HCT品台灣商品
		$taiwan_products = json_decode($this->taiwan_products_template_json);
		$taiwan_products = $this->std_class_object_to_array($taiwan_products);
		$data['taiwan_products'] = $taiwan_products['taiwan_products'];

		//取得昨天至前30天的日期

		$yesterday = date("Y/m/d", strtotime('-1 day'));
		$thirty_days_ago = date("Y/m/d", strtotime($yesterday.'-30 day'));
		$data['limit_date'] = $thirty_days_ago.'-'.$yesterday;
		if($cat_lv == null || $cat_name == null || $startDate == null || $product_key == null ){
			$data['msg'] = '參數錯誤,請重新填寫';
			$this->load->view('taiwanCompetition' ,$data);
			return;
		}

		$product_info = urldecode($product_key);
		$product_info = explode('_', $product_info);
		$product_id = $product_info[0];
		$product_name = $product_info[1];

		//抓取HCT商品詳細資訊
		//$data['product_info'] = $this->getProductInfoApi($product_id);
		$product_info  =  json_decode($this->product_info_template_json);
		$data['product_info']= $this->std_class_object_to_array($product_info);


		//五大指標-全淘寶
		//$limit_cat = '美食特產';
		//$row_special_rates = $this->getTaiwanHCTProductCompetitionRateApi($cat_lv, $cat_name, $startDate ,$product_id );
		$row_special_rates =  json_decode($this->TW_comtepition_rate_template_json);
		$row_special_rates =$this->std_class_object_to_array($row_special_rates);
		if($row_special_rates['result'] == false){
			$data['msg'] = $row_special_rates['error_msg'];
			$this->load->view('taiwanCompetition' ,$data);
			return;
		}
		$special_rates = $row_special_rates['taobao_data'];
		$data['radar_data'] = $special_rates['radar_data'];//雷達圖

		//$data['radar_data_info'] = $this->splitRadarData($data['radar_data']);//將雷達數據拆出來
		$data['radar_data_function'] = $special_rates['radar_data_function'];//指標公式
		$data['arrange_data'] = $special_rates['arrange_data'];//指標數據
		$data['pos_comments'] = $special_rates['pos_comments'];//好評率資訊
		$data['nag_comments'] = $special_rates['nag_comments'];//壞評率資訊
		$data['avg_price'] = ($special_rates['arrange_data']['price']['avg_price'] != 0)?round($special_rates['arrange_data']['price']['avg_price'],0) : 0;//大陸售價(RMB)
		$data['avg_unitPrice'] = ($special_rates['arrange_data']['price']['avg_unitPrice'] != 0)?round($special_rates['arrange_data']['price']['avg_unitPrice'],0):0;//每一規格售價
		$data['find_product_info'] = $special_rates['arrange_data']['price']['find_product_info'];//淘寶前100名價格數據
		$data['top_product_info'] = $special_rates['arrange_data']['price']['top_product_info'];//淘寶關鍵字前100名價格數據
		$data['price_detail'] =  $special_rates['price_detail'];//大陸售價(RMB)詳細資訊
		$data['unitPrice_detail'] =  $special_rates['unitPrice_detail'];//每一規格售價詳細資訊
		$data['tradeNum_by_location'] =  $special_rates['tradeNum_by_location'];//每個地區的銷量

		//產地台灣
		$special_rates_taiwan = $row_special_rates['taobao_data_taiwan'];
		$data['radar_data_taiwan'] = $special_rates_taiwan['radar_data'];
		//$data['radar_data_info_taiwan'] = $this->splitRadarData($data['radar_data_taiwan']);//將雷達數據拆出來
		$data['radar_data_function_taiwan'] = $special_rates_taiwan['radar_data_function'];//指標公式
		$data['arrange_data_taiwan'] = $special_rates_taiwan['arrange_data'];
		$data['pos_comments_taiwan'] = $special_rates_taiwan['pos_comments'];
		$data['nag_comments_taiwan'] = $special_rates_taiwan['nag_comments'];
		$data['avg_price_taiwan'] = ($special_rates_taiwan['arrange_data']['price']['avg_price'] != 0)?round($special_rates_taiwan['arrange_data']['price']['avg_price'],0):0;
		$data['avg_unitPrice_taiwan'] = ($special_rates_taiwan['arrange_data']['price']['avg_unitPrice'] !=0)?round($special_rates_taiwan['arrange_data']['price']['avg_unitPrice'],0):0;
		$data['find_product_info_taiwan'] = $special_rates_taiwan['arrange_data']['price']['find_product_info'];//淘寶產地台灣前100名價格數據
		$data['top_product_info_taiwan'] = $special_rates_taiwan['arrange_data']['price']['top_product_info'];//淘寶產地台灣關鍵字前100名價格數據
		$data['price_detail_taiwan'] =  $special_rates_taiwan['price_detail'];//大陸售價(RMB)詳細資訊
		$data['unitPrice_detail_taiwan'] =  $special_rates_taiwan['unitPrice_detail'];//每一規格售價詳細資訊
		$data['tradeNum_by_location_taiwan'] =  $special_rates_taiwan['tradeNum_by_location'];//每一規格售價詳細資訊

		//記錄使用者輸入的資訊
		$data['record'] = array(
			'cat_lv'=>$cat_lv,
			'cat_name'=>$cat_name,
			'startDate'=>$startDate,
			'product_name'=>$product_name,
			'product_key'=>$product_key,
			'filter_product_keyword'=>$row_special_rates['filter_product_keyword'],
			//'cat_name'=>$row_special_rates['cat_name'],
			);
		//記錄微博資訊
		$data['token'] = $this->token;
		$data['code_url'] = $this->weibo_info['code_url']. '&'. $this->weibo_info['state'];
		$this->load->view('taiwan_competition_result',$data);
	}

	/*
	*將雷達數據分割
	*/
	private function splitRadarData($radar_data){
		$radar_data_array = explode(',', $radar_data);
		$special = $radar_data_array[0];
		$famous = $radar_data_array[1];
		$hot = $radar_data_array[2];
		$price = $radar_data_array[3];
		$comments = $radar_data_array[4];
		$radar_data = array(
			'special'=>$special,
			'famous'=>$famous,
			'hot'=>$hot,
			'price'=>$price,
			'comments'=>$comments,
			);
		//運算五角型面積
		//special+famous
		$hypotenuse = round(sqrt(pow($special, 2) + pow($famous, 2)),2);
		$p = round(($special+$famous+$hypotenuse)/2 ,2);
		$special_famous_area = round(sqrt( $p*($p-$special)*($p-$famous)*($p-$hypotenuse) ),2);
		//famous+hot
		$hypotenuse = round(sqrt(pow($famous, 2) + pow($hot, 2)),2);
		$p = round(($famous+$hot+$hypotenuse)/2 ,2);
		$famous_hot_area = round(sqrt( $p*($p-$famous)*($p-$hot)*($p-$hypotenuse) ),2);
		//hot+price
		$hypotenuse = round(sqrt(pow($hot, 2) + pow($price, 2)),2);
		$p = round(($hot+$price+$hypotenuse)/2 ,2);
		$hot_price_area = round(sqrt( $p*($p-$hot)*($p-$price)*($p-$hypotenuse) ),2);
		//price+comments
		$hypotenuse = round(sqrt(pow($price, 2) + pow($comments, 2)),2);
		$p = round(($price+$comments+$hypotenuse)/2 ,2);
		$price_comments_area = round(sqrt( $p*($p-$price)*($p-$comments)*($p-$hypotenuse) ),2);
		//comments+special
		$hypotenuse = round(sqrt(pow($comments, 2) + pow($special, 2)),2);
		$p = round(($comments+$special+$hypotenuse)/2 ,2);
		$comments_special_area = round(sqrt( $p*($p-$comments)*($p-$special)*($p-$hypotenuse) ),2);
		$polygon_area = $special_famous_area+$famous_hot_area+$hot_price_area+$price_comments_area+$comments_special_area;
		$radar_data['polygon_area'] = $polygon_area;
		return $radar_data;
	}
	/**
	*單一品台灣商品詳細資訊
	*/
	private function getProductInfoApi($product_id){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getProductInfoApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('product_id'=>$product_id) ) );
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$product_info = curl_exec($ch);
		$product_info = json_decode($product_info);
		$product_info = $this->std_class_object_to_array($product_info);
		curl_close($ch);

		return $product_info ;
	}

	/**
	*類別成長燈號
	*/
	private function getGrowthRateApi($admin_account ,$current_date){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getTradeNumGrowthRateApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array('admin_account'=>$admin_account ,'current_date'=>$current_date )) );
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$growth_rate = curl_exec($ch);
		$growth_rate = json_decode($growth_rate);
		$growth_rate = $this->std_class_object_to_array($growth_rate);
		curl_close($ch);

		return $growth_rate ;
	}

	/**
	*抓取排行TOP類別資訊
	*/
	private function getTopCatsApi(){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getTopCatsApi");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$cats = curl_exec($ch);
		$cats = json_decode($cats);
		$cats = $this->std_class_object_to_array($cats);
		curl_close($ch);

		return $cats ;
	}

	/**
	*抓取食品分類
	*/
	private function getFoodsCategoryApi(){
		//開始執行CURL
		try {
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $this->curl_url."getFoodsCategoryApi");
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);

			$categorys_obj = curl_exec($ch);

			if (FALSE === $categorys_obj)
	      			  throw new Exception(curl_error($ch), curl_errno($ch));
			curl_close($ch);

		} catch(Exception $e) {

			trigger_error(sprintf(
			'Curl failed with error #%d: %s',
			$e->getCode(), $e->getMessage()),
			E_USER_ERROR);
		}

		$categorys_obj = json_decode($categorys_obj);

		return $categorys_obj ;
	}

	/**
	*五大指標API
	*/
	private function getCompetitionRateApi($cat_lv,$cat_name, $startDate ,$product_keyword, $brand,$taiwan_price ,$unit){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getCompetitionRateApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( array("cat_lv"=>$cat_lv ,"cat_name"=>$cat_name ,"startDate"=>$startDate ,"product_keyword"=>$product_keyword ,"brand"=>$brand,"taiwan_price"=>$taiwan_price,"unit"=>$unit ) ));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$competition_rate = curl_exec($ch);
		$competition_rate = json_decode($competition_rate);
		$competition_rate = $this->std_class_object_to_array($competition_rate);
		curl_close($ch);
		return $competition_rate ;
	}

	/**
	*HCT品台灣商品五大指標API
	*/
	private function getTaiwanHCTProductCompetitionRateApi( $cat_lv, $cat_name, $startDate ,$product_key ){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getTaiwanHCTProductCompetitionRateApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( array("cat_lv"=>$cat_lv ,"cat_name"=>$cat_name ,"startDate"=>$startDate ,"product_key"=>$product_key  ) ));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$competition_rate = curl_exec($ch);
		$competition_rate = json_decode($competition_rate);
		$competition_rate = $this->std_class_object_to_array($competition_rate);
		curl_close($ch);
		var_dump($competition_rate);exit;
		return $competition_rate ;
	}
	/**
	*將多層Obj轉array
	*stdclassobject: obj
	*/
	private function std_class_object_to_array($stdclassobject){
		$array = array();
		$_array = is_object($stdclassobject) ? get_object_vars($stdclassobject) : $stdclassobject;
		if( !is_object($_array) && !is_array($_array)){
			return $_array;
		}
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

	/**
	*匯出分析頁面賣家清單
	*/
	public function doExportAnalysisData(){
		$data = array();
		$category_id = isset($_POST['record_category_id'])?trim($_POST['record_category_id']): null;
		$category_name = isset($_POST['record_category_name'])?trim($_POST['record_category_name']): null;
		$keyword = isset($_POST['record_keyword'])?trim($_POST['record_keyword']): null;
		$date = isset($_POST['record_date'])?trim($_POST['record_date']): null;

		if($category_id == null || $category_name == null || $date == null ){
			$msg = urlencode( base64_encode( '資訊錯誤'));
			redirect("main_page/analysis?msg=".$msg);
		}

		//找出賣家清單
		$seller_list = $this->getAnalysisSellerListApi($keyword , $category_id ,  $date ,$category_name);
		if(isset($seller_list['result']) && $seller_list['result'] == false){
			$msg = urlencode( base64_encode($seller_list['error_msg']));
			redirect("main_page/analysis?msg=".$msg);
		}
		//匯出excel
		$content = '';
		$content .= $this->getExcelSpec();
		if($seller_list['sellers'] != null){
			$content .= $this->genRankComparisonTable();
			$content .=  $this->genExcelReport($seller_list);//匯出賣家清單
			//$content .=  $this->genExcelRankReport($data);//匯出賣家評價-暫時取消
		}
		else{
			$content .= "<Worksheet ss:Name='無資料'><Table>";
			$content .="</Table></Worksheet>";
		}
		date_default_timezone_set('Asia/Taipei');
		$content .="</Workbook>";
		$excel_name = date('Ymd').'分析頁面_'.$category_name;
		if($keyword != null){
			$excel_name .= '_關鍵字_'.$keyword;
		}
		header("Cache-Control: public");
		header("Pragma: public");
		header("Content-type: application/vnd.ms-excel") ;
		header("Content-Disposition: attchment; filename=".$excel_name.".xls") ;
		header("Content-Length: ". strlen($content));
		echo $content;

		exit;
	}

	/**
	*匯出分析頁面賣家清單
	*/
	private function getAnalysisSellerListApi($keyword , $category_id ,  $date ,$category_name){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getAnalysisSellerListApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( array( "keyword"=>$keyword, "category_id"=>$category_id ,"date"=>$date, "category_name"=>$category_name) ));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$seller_list = curl_exec($ch);
		$seller_list = json_decode($seller_list);
		$seller_list = $this->std_class_object_to_array($seller_list);
		curl_close($ch);
		return $seller_list ;
	}

	/**
	*EXCEL評等介紹
	*/
	private function genRankComparisonTable(){
		$ranks = array(
			'N/A','1顆愛心','2顆愛心','3顆愛心','4顆愛心','5顆愛心',
			'1顆鑽石','2顆鑽石','3顆鑽石','4顆鑽石','5顆鑽石',
			'1個藍黃冠','2個藍黃冠','3個藍黃冠','4個藍黃冠','5個藍黃冠',
			'1個金黃冠','2個金黃冠','3個金黃冠','4個金黃冠','5個金黃冠'
			);
		$content = '';
		$content .= "<Worksheet ss:Name='評等對照表'><Table>";
		$content .="<Row>
				<Cell><Data ss:Type='String'>前端圖案</Data></Cell>
				<Cell><Data ss:Type='String'>對應數字</Data></Cell>
				</Row>";
		foreach($ranks AS $key=>$rank){
			$content .= "<Row>";
			$content .= "<Cell><Data ss:Type='String'>".$rank."</Data></Cell>";
			$content .= "<Cell><Data ss:Type='Number'>".$key."</Data></Cell>";
			$content .= "</Row>";
		}

		$content .="</Table></Worksheet>";
		return $content;
	}

	/**
	*excel 格式產生
	*/
	private function getExcelSpec(){
		$content = '<?xml version="1.0" encoding="utf-8"?>';
		$content .="<?mso-application progid='Excel.Sheet'?>";
		$content .="<Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' ";
		$content .="xmlns:o='urn:schemas-microsoft-com:office:office' ";
		$content .="xmlns:x='urn:schemas-microsoft-com:office:excel' ";
		$content .="xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet' ";
		$content .="xmlns:html='http://www.w3.org/TR/REC-html40'>";
		return $content;
	}

	/**
	*excel 內容產生
	*/
	private function genExcelReport($data){
		$content = "";

		if(isset($data['standard']) && $data['standard']['tag'] == true){
			$content .= "<Worksheet ss:Name='標準差範圍'><Table>";
			$content .="<Row><Cell><Data ss:Type='String'>標準差</Data></Cell></Row>";
			$content .="<Row><Cell><Data ss:Type='String'>".$data['standard']['range']['upper']."~".$data['standard']['range']['lower']."</Data></Cell></Row>";
			$content .="</Table></Worksheet>";
		}
		$content .= "<Worksheet ss:Name='賣家資料'><Table>";
		//Title 組成
		$content .="<Row>";
		foreach($data['title'] AS $title){
			$content .= "<Cell><Data ss:Type='String'>".$title."</Data></Cell>";
		}
		$content .="</Row>";
		//內容組成
		foreach($data['sellers']['seller'] AS $seller){
			$temp ='';
			$temp .="<Row>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['crawl_time']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['auction']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['seller']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['title']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['brand']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['place']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$seller['seller_location']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['price']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['unitPrice']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['shanghai_express']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['total_price']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['tradeNum']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['comments']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$seller['ratesum']."</Data></Cell>";
			$temp .="</Row>";
			$content .= $temp;
		}
		$content .="</Table></Worksheet>";
		return $content;
	}

	/**
	*匯出HOME頁面Top100
	*/
	public function doExportTop100(){
		$current_date = date('Ymd');

		$params = array(
			'current_date'=>$current_date,
			'cat_id'=>'three_cat2',
			'changeToFamous'=>false,
			'location_taiwan'=>false,
			);

		$top100_products = $this->getTop100Api($current_date, $params);

		$content = '';
		$content .= $this->getExcelSpec();
		if($top100_products['result'] != false){
			$content .=  $this->genTop100ExcelReport($top100_products['top_products']);//匯出TOP100
		}
		else{
			$content .= "<Worksheet ss:Name='無資料'><Table>";
			$content .= "<Row><Cell><Data ss:Type='String'>".$top100_products['error_msg']."</Data></Cell></Row>";
			$content .="</Table></Worksheet>";
		}
		date_default_timezone_set('Asia/Taipei');
		$content .="</Workbook>";
		$excel_name = date('Ymd').'_三大類Top100';

		header("Cache-Control: public");
		header("Pragma: public");
		header("Content-type: application/vnd.ms-excel") ;
		header("Content-Disposition: attchment; filename=".$excel_name.".xls") ;
		header("Content-Length: ". strlen($content));
		echo $content;

		exit;
	}

	/**
	*Top100API
	*/
	private function getTop100Api($current_date, $params){
		$get_params= http_build_query($params, null, '&');
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getTopProductsApi?".$get_params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$top100 = curl_exec($ch);
		$top100 = json_decode($top100);
		$top100 = $this->std_class_object_to_array($top100);
		curl_close($ch);
		return $top100 ;
	}

	/**
	*匯出Top100
	*/
	private function genTop100ExcelReport($top_products){
		$content = "";

		$content .= "<Worksheet ss:Name='Top100資料'><Table>";
		//Title 組成
		$content .="<Row>";
			$content .= "<Cell><Data ss:Type='String'>名次</Data></Cell>";
			$content .= "<Cell><Data ss:Type='String'>商品名稱</Data></Cell>";
			$content .= "<Cell><Data ss:Type='String'>銷售量</Data></Cell>";
			$content .= "<Cell><Data ss:Type='String'>商品網址</Data></Cell>";
		$content .="</Row>";

		//內容組成
		foreach($top_products AS $key=>$top_product){
			$temp ='';
			$temp .="<Row>";
			$temp .= "<Cell><Data ss:Type='Number'>".($key+1)."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$top_product['title']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='Number'>".$top_product['tradeNum']."</Data></Cell>";
			$temp .= "<Cell><Data ss:Type='String'>".$top_product['url']."</Data></Cell>";
			$temp .="</Row>";
			$content .= $temp;
		}

		$content .="</Table></Worksheet>";
		return $content;
	}

	/**
	*品台灣HCT商品資訊
	*taiwan_hct_seller:賣家
	*/
	private function getTaiwanProductsApi($taiwan_hct_seller){
		//開始執行CURL
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->curl_url."getTaiwanProductsApi");
		curl_setopt($ch, CURLOPT_POST, true); // 啟用POST
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode( array( "taiwan_hct_seller"=>$taiwan_hct_seller) ));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$taiwan_products = curl_exec($ch);
		$taiwan_products = json_decode($taiwan_products);
		$taiwan_products = $this->std_class_object_to_array($taiwan_products);
		curl_close($ch);
		return $taiwan_products ;
	}

}
