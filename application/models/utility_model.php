<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');

/**
 * 共用函式
 */
class Utility_model extends CI_Model{
    
    public function __construct()
    {
        parent::__construct();
        $this->load->model('campaign_model');
    }    
    
    /**
     * 存以及更新token
     */
    public function insert_token($user_id, $access_token, $expires_in, $screen_name='', $profile_image_url='', $profile_url='', $gender='', $avatar_hd=''){
        $conn = $this->load->database('default', TRUE);

        $sql = "INSERT INTO weibo_accesstoken_campaigns (user_id, screen_name, access_token, expires_in, created_time, update_time, profile_image_url, profile_url, gender, avatar_hd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)".
        " ON DUPLICATE KEY UPDATE".
        " screen_name = values(screen_name),".
        " access_token = values(access_token),".
        " expires_in = values(expires_in),".
        " update_time = values(update_time),".
        " profile_image_url = values(profile_image_url),".
        " profile_url = values(profile_url),".
        " gender = values(gender),".
        " avatar_hd = values(avatar_hd)";

        $created_time = date( 'Y-m-d H:i:s', time() );   
        $update_time = $created_time;
        $query = $conn->query($sql, array($user_id, $screen_name, $access_token, $expires_in, $created_time, $update_time, $profile_image_url, $profile_url, $gender, $avatar_hd));
        //print_r($conn->last_query());
        $conn->close();
    }
    
    /**
     * 新關注
     */
    public function insert_campaign_like($page_id, $app_id, $user_id, $campaign, $is_new, $campaign_id){
        $conn = $this->load->database('default', TRUE);
        $sql = "INSERT INTO weibo_campaigns_likes (page_id, app_id, user_id, campaign, updatetime, is_new, campaign_id) VALUES (?, ?, ?, ?, ?, ?, ?)".
        " ON DUPLICATE KEY UPDATE".
        " updatetime = values(updatetime)";
        $updatetime = date( 'Y-m-d H:i:s', time() );   
        $query = $conn->query($sql, array($page_id, $app_id, $user_id, $campaign, $updatetime, $is_new, $campaign_id));
        $conn->close();        
    }
    
    /**
     * 插入post_id
     */
    public function insert_post_id($post_id, $from_id, $app_id, $campaign_id, $from_uid, $from_uid_name){
        $campaign_info = $this->campaign_model->get_campaign_information($campaign_id);
        $conn = $this->load->database('default', TRUE);
        //campaigns_posts (post_id, from_id, app_id, campaign, crawl_state, comments, likes, shares, created_time, updatetime, isopen)
        if($from_uid !== ''){
            $sql = "INSERT INTO campaigns_posts (post_id, from_id, app_id, campaign, crawl_state, created_time, updatetime, isopen, campaign_id, url_from_id, url_from_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)".
                    " ON DUPLICATE KEY UPDATE".
                    " updatetime = values(updatetime)";
            $created_time = date( 'Y-m-d H:i:s', time() );   
            $updatetime = $created_time;
            $query = $conn->query($sql, array($post_id, $from_id, $app_id, $campaign_info['campaign_name'], 0, $created_time, $updatetime, 0, $campaign_id, $from_uid, $from_uid_name));            
        }
        else{
            $sql = "INSERT INTO campaigns_posts (post_id, from_id, app_id, campaign, crawl_state, created_time, updatetime, isopen, campaign_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)".
                    " ON DUPLICATE KEY UPDATE".
                    " updatetime = values(updatetime)";
            $created_time = date( 'Y-m-d H:i:s', time() );   
            $updatetime = $created_time;
            $query = $conn->query($sql, array($post_id, $from_id, $app_id, $campaign_info['campaign_name'], 0, $created_time, $updatetime, 0, $campaign_id));            
        }
        // print_r($conn->last_query());
        $conn->close();            
    }

    public function shareActivityFromSponsor($from_id, $from_name, $app_id, $campaign_id){
        $campaign_info = $this->campaign_model->get_campaign_information($campaign_id);

    }

    function launchBackgroundProcess($call) {
         // Windows
        if($this->is_windows()){
            pclose(popen("start \"title\" \"".$call ."\"", 'r'));
        }
         // Some sort of UNIX
        else {
            //echo getcwd() . "\n";
            pclose(popen($call.' > /dev/null &', 'r'));
        }
        return true;
    }
    
    function is_windows(){
        if(PHP_OS == 'WINNT' || PHP_OS == 'WIN32'){
            return true;
        }
        return false;
    }    

    function curPageURL() {
       $pageURL = 'http';
       if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
       $pageURL .= "://";
       if (isset($_SERVER["SERVER_PORT"]) && $_SERVER["SERVER_PORT"] != "80") {
          $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
      } else {
          $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
      }
      return $pageURL;
  }    
}