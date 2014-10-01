<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');
ini_set("memory_limit","2048M");
set_time_limit(0);

class Logout extends CI_Controller {

	public function __construct(){
		parent::__construct();
		session_start();

		if((!isset($_SESSION['login_status']) ||  (isset($_SESSION['login_status']) && $_SESSION['login_status'] != TRUE))){
			redirect("login");
			exit;
		}
		session_write_close();
	}

	public function index(){

		session_start();
		$_SESSION['username'] = '';
		$_SESSION['login_status'] = false;
		$_SESSION['group'] = '';
		$_SESSION['owner'] = '';
		$_SESSION['authority'] = '';
		$_SESSION['system_title'] = '';
		session_write_close();
		redirect('/login');

	}
}
