<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');

/**
 * 帳號相關處理
 */
class Account_model extends CI_Model{

	public function __construct()
	{
		parent::__construct();
	}

	/**
	帳號數
	*/
	public function account_count($owner=null){
		$conn_shopping = $this->load->database('default', TRUE);
		if($owner == null){
			$sql_st = "SELECT count(*) as user_count FROM user_account;";
			$query = $conn_shopping ->query($sql_st);
		}else{
			$sql_st = "SELECT count(*) as user_count FROM user_account WHERE owner=?;";
			$query = $conn_shopping ->query($sql_st, array($owner));
		}
		$row = $query->row_array();
		$user_count = 0;
		if($row){
			if($row['user_count']){
				$user_count = $row['user_count'];
			}
		}
		$conn_shopping -> close();
		return $user_count;
	}
	   /**
	抓取帳號資料
	*/
	public function account_data($start_index=0, $amount=10, $owner=null){
		$conn_shopping = $this->load->database('default', TRUE);
		if($owner == NULL){
		  $sql_st = "SELECT * FROM user_account LIMIT ?, ?;";
		  $query = $conn_shopping ->query($sql_st, array($start_index, $amount));
		}
		else{
		  $sql_st = "SELECT * FROM user_account WHERE `owner` = ? LIMIT ?, ?;";
		  $query = $conn_shopping ->query($sql_st, array($owner,$start_index, $amount));
		}
		$i = 0;
		$data = array();
		foreach ($query->result_array() as $row){
			$data[$i] = $row;
			$i += 1;
		}
		$conn_shopping -> close();
		return $data;
	}

	/**
	*
	*/
	public function create_account($username, $pw, $admin_flag, $owner, $page_authority ,$system_title){
		$DB = $this->load->database('default', TRUE);
		//檢查帳號是否存在
		$check_account = $this->get_account($username);
		if($check_account != null){
			$data = array(
				'result'=>false,
				'msg'=>'帳號已經存在'
				);
			return  $data;
		}

		$page_array = array();
		$page_str = $authority_str = '';
		foreach( $page_authority AS $page_name=>$authority){
			array_push($page_array,$page_name);
		}
		 $page_str = "`".implode("`,`", $page_array)."`";
		 $authority_str = "'".implode("','", $page_authority)."'";
		 $create_time = date('Ymdhis');
		$sql = "INSERT INTO `user_account` (`username`,`password`,`group`,`owner`,".$page_str.",`create_time` ,`system_title`)
			VALUES ('".$username."','".$pw."','".$admin_flag."','".$owner."',".$authority_str.",'".$create_time."', '".$system_title."' )";
		$result = $DB->query($sql);
		if($result == false){
			$data = array(
				'result'=>false,
				'msg'=>'新增帳號失敗'
				);
		}else{
			$data = array(
				'result'=>true,
				'msg'=>'新增帳號成功'
				);
		}
		return  $data;
	}

	public function del_account($username){
		$DB = $this->load->database('default', TRUE);
		//檢查帳號是否存在
		$check_account = $this->get_account($username);
		if($check_account == null){
			$data = array(
				'result'=>false,
				'msg'=>'帳號不存在'
				);
			return  $data;
		}
		$account = $check_account[0];
		//檢查此帳號是否為admin
		if($account->group == 'admin'){
			$sql = "DELETE FROM `user_account` WHERE `owner`='".$account->owner."' ";
		}else{
			$sql = "DELETE FROM `user_account` WHERE `username`='".$username."' ";
		}
		$result = $DB->query($sql);
		if($result == false){
			$data = array(
				'result'=>false,
				'msg'=>'刪除帳號失敗'
				);
		}else{
			$data = array(
				'result'=>true,
				'msg'=>'刪除帳號成功'
				);
		}
		return  $data;
	}

	/**
	*
	*/
	public function update_account($username, $page_authority, $system_title){
		$DB = $this->load->database('default', TRUE);
		//檢查帳號是否存在
		$check_account = $this->get_account($username);
		if($check_account == null){
			$data = array(
				'result'=>false,
				'msg'=>'帳號不存在'
				);
			return  $data;
		}
		$page_array = array();
		$page_str ;
		foreach( $page_authority AS $page_name=>$authority){
			$str = " `".$page_name."`='".$authority."' ";
			array_push($page_array,$str);
		}
		$page_str = implode(",", $page_array);


		$sql = "UPDATE `user_account` SET ".$page_str.",`system_title`='".$system_title."' WHERE `username`='".$username."' ";

		$result = $DB->query($sql);
		if($result == false){
			$data = array(
				'result'=>false,
				'msg'=>'更新帳號失敗'
				);
		}else{
			$data = array(
				'result'=>true,
				'msg'=>'更新帳號成功'
				);
		}
		return  $data;
	}
	/**
	*找尋帳號資訊
	*/
	public function get_account($username){
		$DB = $this->load->database('default', TRUE);
		$sql = " SELECT *FROM `user_account` WHERE `username`='".$username."' ";
		$search_result = $DB->query($sql);
		$search_result = $search_result->result();
		return $search_result ;
	}

}


/* End of file account_model.php */
/* Location: ./application/models/account_model.php */
