<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');

/**
 * 共用函式
 */
class Diffusion_model extends CI_Model{
    
    public function __construct()
    {
        parent::__construct();
        $this->load->model('campaign_model');
    }

    public function shareActivityFromSponsor($app_id, $campaign_id, $from_id, $from_name){
        $campaign_info = $this->campaign_model->get_campaign_information($campaign_id);
        $conn = $this->load->database('default', TRUE);
        $sql = "INSERT IGNORE INTO campaigns_diffusion (app_id, campaign_id, from_id, from_name, id, name, action, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";        
        $updatetime = date( 'Y-m-d H:i:s', time() );   
        $query = $conn->query($sql, array($app_id, $campaign_id, $app_id, $campaign_info['campaign_name'], $from_id, $from_name, "share_activity", $updatetime));            
        $conn->close();     
    }

    public function shareActivityFromDiffusion($app_id, $campaign_id, $from_id, $from_name, $from_uid, $from_uid_name){
        if($from_uid != null && $from_uid != "" && $from_uid_name != null && $from_uid_name != ""){
            $campaign_info = $this->campaign_model->get_campaign_information($campaign_id);
            $conn = $this->load->database('default', TRUE);
            $sql = "INSERT IGNORE INTO campaigns_diffusion (app_id, campaign_id, from_id, from_name, id, name, action, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";        
            $updatetime = date( 'Y-m-d H:i:s', time() );   
            $query = $conn->query($sql, array($app_id, $campaign_id, $from_uid, $from_uid_name, $from_id, $from_name, "share_activity", $updatetime));            
            $conn->close();                 
        }
    }

}