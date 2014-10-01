<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
date_default_timezone_set('Asia/Taipei');

/**
 * 共用函式
 */
class Campaign_model extends CI_Model{
    
    public function __construct()
    {
        parent::__construct();
        $this->config->load('weibo_config', TRUE);
    }    

    /**
     * 取得活動狀態
     */
    public function get_campaigns_status(){
        $conn = $this->load->database('default', TRUE);
        $conn2 = $this->load->database('default', TRUE);
        $sql = "SELECT campaign, SUM(likes) as total_likes, SUM(comments) as total_comments, SUM(shares) as total_shares, COUNT(*) as campaign_shares, updatetime  FROM campaigns_posts  GROUP BY campaign";
        $query = $conn->query($sql);
        $result = array();
        $i = 0;
        foreach($query->result_array() as $row){
            $result[$i] = $row;
            $sql2 = "SELECT COUNT(*) as new_fans FROM weibo_campaigns_likes WHERE campaign = ?";
            $query2 = $conn2->query($sql2, array($row['campaign']));
            $result2 = $query2->row_array();
            $result[$i]['new_fans'] = $result2['new_fans'];
            $query2->free_result();
            $i++;
        }
        $conn->close();        
        $conn2->close();
        return $result;
    }    
    
    /**
     * 儲存活動設定
     */
    public function save_campaign_information($user_id, $campaign_name, $campaign_raw_content, $promote_page_name){
        $conn = $this->load->database('default', TRUE);
        $sql = "INSERT INTO campaigns (user_id, campaign_name, campaign_text, promote_page_name, created_time, update_time) VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE user_id = values(user_id),
            campaign_name = values(campaign_name),
            campaign_text = values(campaign_text),
            promote_page_name = values(promote_page_name),
            created_time = values(created_time),
            update_time = values(update_time);";
        $update_time = date( 'Y-m-d H:i:s', time() );   
        $query = $conn->query($sql, array($user_id, $campaign_name, $campaign_raw_content, $promote_page_name, $update_time, $update_time));     
        $campaign_id = FALSE;  
        if($query !== FALSE){
            $campaign_id = $conn->insert_id();
        } 
        
        $conn->close();   
        return $campaign_id; 
    }

    /**
     * update campaign information
     * @param  integer $campaign_id          campaign id
     * @param  string $user_id              user id
     * @param  string $campaign_name        campaign name
     * @param  string $campaign_raw_content campaign row content
     * @param  string $promote_page_name    promote page name 
     * @return boolean                       successful or not
     */
    public function update_campaign_information($campaign_id, $user_id, $campaign_name, $campaign_raw_content, $promote_page_name, $app_id=''){
        $conn = $this->load->database('default', TRUE);
        $sql = "UPDATE campaigns SET user_id = ?, campaign_name = ?, campaign_text = ?, promote_page_name = ?, update_time = ? ".
            " WHERE campaign_id = ?";
        $update_time = date( 'Y-m-d H:i:s', time() );   
        $query = $conn->query($sql, array($user_id, $campaign_name, $campaign_raw_content, $promote_page_name, $update_time, $campaign_id));     
        //update 
        $sql = "UPDATE weibo_campaigns_likes SET campaign = ? ".
            " WHERE campaign_id = ?"; 
        $query = $conn->query($sql, array($campaign_name, $campaign_id));     
        //update 
        $sql = "UPDATE campaigns_posts SET campaign = ? ".
            " WHERE campaign_id = ?";  
        $query = $conn->query($sql, array($campaign_name, $campaign_id));     
        $sql = "UPDATE campaigns_diffusion SET from_name = ? ".
            " WHERE campaign_id = ? AND from_id = ?";  
        $query = $conn->query($sql, array($campaign_name, $campaign_id, $app_id));     
        $conn->close();   
        return $query; 
    }

    public function isOwnerOfCampaign($user_id, $campaign_id){
        $conn = $this->load->database('default', TRUE);
        $sql = "SELECT * FROM campaigns WHERE user_id = ? AND campaign_id = ?;";  
        $query = $conn->query($sql, array($user_id, $campaign_id));
        $flag = false;
        if ($query->num_rows() > 0){
            $flag = true;
        }
           
        $conn->close();   
        return $flag;          
    }
    
    /**
     * 取得活動資訊
     */
    public function get_campaign_information($campaign_id){
        $conn = $this->load->database('default', TRUE);
        $sql = "SELECT campaign_id, user_id, campaign_name, campaign_text, promote_page_name FROM campaigns WHERE campaign_id = ?;";  
        $query = $conn->query($sql, array($campaign_id));
        $result = $query->row_array();        
        $conn->close();   
        return $result;         
    }
    
    /**
     * 取得用戶 id
     * @param  string $user_id weibo user id
     * @return array          user info
     */
    public function get_user_info($user_id){
        $conn = $this->load->database('default', TRUE);
        $sql = "SELECT screen_name, profile_url FROM `weibo_accesstoken_campaigns` WHERE user_id = ?;";  
        $query = $conn->query($sql, array($user_id));
        $result = $query->row_array();
        $conn->close();   
        return $result;  
    }

    /**
     * get count of campaigns
     * @return integer campaign count
     */
    public function get_campaign_count(){
        $conn = $this->load->database('default', TRUE);
        $sql = "SELECT * FROM campaigns WHERE campaign_id IS NOT NULL ORDER BY update_time DESC;";
        $query = $conn->query($sql);        
        $num = $query->num_rows();
        $conn->close();   
        return $num;
    }

    /**
     * 取得活動資訊清單
     */
    public function get_campaign_diffusion_information($start=0, $len=10){
        $conn = $this->load->database('default', TRUE);
        $conn2 = $this->load->database('default', TRUE);
        //$sql = "SELECT a.campaign_name, b.campaign_id, SUM(b.likes) as total_likes, SUM(b.comments) as total_comments , SUM(b.shares) as total_shares, COUNT(*) as campaign_shares, b.updatetime FROM campaigns as a LEFT JOIN campaigns_posts as b ON a.campaign_id = b.campaign_id ;";
        $sql = "SELECT * FROM campaigns WHERE campaign_id IS NOT NULL ORDER BY update_time DESC LIMIT ". $start. ", ". $len;
        $query = $conn->query($sql);
        $result = array();
        $i = 0;
        foreach($query->result_array() as $row){
            //basic campaign info
            $result[$i] = $row;
            //for sharing the campaign
            $sql2 = "SELECT campaign_id, SUM(likes) as total_likes, SUM(comments) as total_comments , SUM(shares) as total_shares, COUNT(*) as campaign_shares, updatetime FROM campaigns_posts WHERE campaign_id = ?";
            $query2 = $conn2->query($sql2, array($row['campaign_id']));
            $result2 = $query2->row_array();
            if($result2['total_likes'] == null){
                $result2['total_likes'] = 0;
            }
            $result[$i]['total_likes'] = $result2['total_likes'];
            if($result2['total_comments'] == null){
                $result2['total_comments'] = 0;
            }
            $result[$i]['total_comments'] = $result2['total_comments'];
            if($result2['total_shares'] == null){
                $result2['total_shares'] = 0;
            }
            $result[$i]['total_shares'] = $result2['total_shares'];
            $result[$i]['campaign_shares'] = $result2['campaign_shares']; 
            if($result2['updatetime'] == null){
                $result2['updatetime'] = date( 'Y-m-d H:i:s', time() );
            }       
            $result[$i]['updatetime'] = $result2['updatetime'];        
            $query2->free_result();
            //for like the page            
            $sql2 = "SELECT COUNT(*) as new_fans FROM weibo_campaigns_likes WHERE campaign_id = ?";
            $query2 = $conn2->query($sql2, array($row['campaign_id']));
            $result2 = $query2->row_array();
            $result[$i]['new_fans'] = $result2['new_fans'];
            $query2->free_result();
            //for weibo account
            $sql2 = "SELECT screen_name, profile_url FROM `weibo_accesstoken_campaigns` WHERE user_id = ?;";
            $query2 = $conn2->query($sql2, array($row['user_id']));
            $result2 = $query2->row_array();
            $result[$i]['screen_name'] = $result2['screen_name'];
            $result[$i]['profile_url'] = $result2['profile_url'];
            $query2->free_result();            
            $i++;
        }
        $conn->close();        
        $conn2->close();
        return $result;        
    }

    /**
     * 取得單一 campaign 資訊傳播
     * @param  integer $campaign_id campaign id
     * @return array              campaign duffusion information
     */
    public function get_campaign_diffusion_information_by_cid($campaign_id){
        $conn = $this->load->database('default', TRUE);
        $conn2 = $this->load->database('default', TRUE);
        //$sql = "SELECT a.campaign_name, b.campaign_id, SUM(b.likes) as total_likes, SUM(b.comments) as total_comments , SUM(b.shares) as total_shares, COUNT(*) as campaign_shares, b.updatetime FROM campaigns as a LEFT JOIN campaigns_posts as b ON a.campaign_id = b.campaign_id ;";
        $sql = "SELECT * FROM campaigns WHERE campaign_id = ? ";
        $query = $conn->query($sql, array($campaign_id));
        $row = $query->row_array();
        $result = array();
        if($row){
            //basic campaign info
            $result = $row;
            //for sharing the campaign
            $sql2 = "SELECT campaign_id, SUM(likes) as total_likes, SUM(comments) as total_comments , SUM(shares) as total_shares, COUNT(*) as campaign_shares, updatetime FROM campaigns_posts WHERE campaign_id = ?";
            $query2 = $conn2->query($sql2, array($row['campaign_id']));
            $result2 = $query2->row_array();
            if($result2['total_likes'] == null){
                $result2['total_likes'] = 0;
            }
            $result['total_likes'] = $result2['total_likes'];
            if($result2['total_comments'] == null){
                $result2['total_comments'] = 0;
            }
            $result['total_comments'] = $result2['total_comments'];
            if($result2['total_shares'] == null){
                $result2['total_shares'] = 0;
            }
            $result['total_shares'] = $result2['total_shares'];
            $result['campaign_shares'] = $result2['campaign_shares']; 
            if($result2['updatetime'] == null){
                $result2['updatetime'] = date( 'Y-m-d H:i:s', time() );
            }       
            $result['updatetime'] = $result2['updatetime'];        
            $query2->free_result();
            //for like the page            
            $sql2 = "SELECT COUNT(*) as new_fans FROM weibo_campaigns_likes WHERE campaign_id = ?";
            $query2 = $conn2->query($sql2, array($row['campaign_id']));
            $result2 = $query2->row_array();
            $result['new_fans'] = $result2['new_fans'];
            $query2->free_result();
        }
        $conn->close();        
        $conn2->close();
        return $result;        
    }

    /**
     * 取得活動傳播時間軸資料
     * @param  integer $campaign_id campaign id
     * @return array              index:page_username, json_date, totalcount, date_count
     */
    public function get_data_for_timeline_chart($campaign_id){
        $conn = $this->load->database('default', TRUE);

        //$sql = "SELECT page_username, startdate, YEAR(startdate) AS start_year, MONTH(startdate) AS start_month, DAY(startdate) AS start_day FROM facebook_campaigns WHERE app_id = '".$selected_app_id."'";
        $sql = "SELECT promote_page_name, DATE(created_time) AS startdate, YEAR(created_time) AS start_year, MONTH(created_time) AS start_month, DAY(created_time) AS start_day FROM campaigns WHERE campaign_id = '".$campaign_id."'";
        $query = $conn -> query($sql);
        $row = $query->row_array();
        if($row){
            $page_username = $row['promote_page_name'];
            $startdate = array("year" => $row['start_year'], "month" => $row['start_month'], "day" => $row['start_day']);
            $start = $row['startdate'];
        }
        $json_date = json_encode($startdate);

        $start = strtotime($start);
        $CheckDay= date("Y-m-d",$start);
        //echo $CheckDay;
    
        $today=time();
        //echo date("Y-m-d",$today);
        $totalcount = array();
        while($CheckDay <= date("Y-m-d",$today)){
            $total_count=0;
            $sql1 = "SELECT date(created_time), count(*) AS sharecount, sum(likes+comments+shares) AS total FROM campaigns_posts WHERE campaign_id = '".$campaign_id."' AND date(created_time) = '".$CheckDay."' GROUP BY date(created_time)";
            $query1 = $conn -> query($sql1);
            //$result1 = mysql_query($sql1) or die('MySQL query error');
            
            //echo $CheckDay;
            foreach($query1->result_array() as $row1){
                $total_count = $row1['sharecount'] + $row1['total'];            
            }
            $totalcount[] = $total_count;
            $start = strtotime("+1 day",$start);
            $CheckDay= date("Y-m-d",$start);
            //echo $CheckDay;
        }
        $date_count = count($totalcount);
        
        $conn -> close();
        return array('page_username'=>$page_username, 'json_date'=>$json_date, 'totalcount'=>$totalcount, 'date_count'=>$date_count);        
    }    

    public function get_diffusion_data_d3($selected_campaign_id){
        $weibo_config = $this->config->item('weibo_config');

        $conn1 = $this->load->database('default', TRUE);

        $conn_dfs_3 = $this->load->database('default', TRUE);
        $sql_3 = "SELECT * FROM `campaigns_diffusion` WHERE campaign_id = '".$selected_campaign_id."' AND action = 'share_activity' ORDER BY update_time ASC LIMIT 1000";
        $query3 = $conn_dfs_3 -> query($sql_3);
        //nodes
        $nodes = array();
        $nodes_index = array();
        $i = 0;
        foreach($query3->result_array() as $row1){
            //source
            if(!array_key_exists($row1["from_id"], $nodes_index)){
                $name = $row1['from_name'];
                $pic = '';
                $origin_flag = false;
                if($weibo_config["weibo_app_key"] == $row1['from_id']){
                    //activity node
                    $pic = 'http://tp2.sinaimg.cn/3903020009/50/40039121221/1';
                    $origin_flag = true;
                }
                else{
                    if(mb_strlen($row1["from_name"]) >= 2){
                        $name = $this->mb_substr_replace($row1["from_name"], "*", 1, 1);
                    }
                    $pic = $this->get_profile_image_url($conn1, $row1["from_id"]);
                }
                $nodes[] = array("id"=>$row1["from_id"], "name"=>$name, "pic"=> $pic, "origin"=> $origin_flag);
                $nodes_index[$row1["from_id"]] = $i;
                $i++;
            }
            //target
            if(!array_key_exists($row1["id"], $nodes_index)){
                $name = $row1['name'];
                $pic = '';
                $origin_flag = false;
                if($weibo_config["weibo_app_key"] == $row1['id']){
                    //activity node
                    $pic = 'http://tp2.sinaimg.cn/3903020009/50/40039121221/1';
                    $origin_flag = true;
                }
                else{
                    if(mb_strlen($row1["name"]) >= 2){
                        $name = $this->mb_substr_replace($row1["name"], "*", 1, 1);
                    }
                    $pic = $this->get_profile_image_url($conn1, $row1["id"]);
                }

                $nodes[] = array("id"=>$row1["id"], "name"=>$name, "pic"=>$pic, "origin"=> $origin_flag);
                $nodes_index[$row1["id"]] = $i;
                $i++;
            }
        }
        //links
        $links = array();
        // $query3 = $conn_dfs_3 -> query($sql_3);
        foreach($query3->result_array() as $row1){
            $type = $row1['action'];
            $links[] = array("source"=> $nodes_index[$row1["from_id"]], "target"=> $nodes_index[$row1["id"]], "type"=> $type, "left"=> false, "right"=> true );
        }
        
        $conn1 -> close();
        $conn_dfs_3 -> close();
        return array('nodes'=>$nodes, 'links'=>$links);        
    }

    public function mb_substr_replace($string, $replacement, $start, $length=0)
    {
        //echo mb_substr($string, 0, $start, "UTF-8") . "=". $replacement . "=" .mb_substr($string, $start+$length, mb_strlen($string) - ($start + $length) , "UTF-8");
        return mb_substr($string, 0, $start, "UTF-8") . $replacement  .mb_substr($string, $start+$length, mb_strlen($string) - ($start + $length) , "UTF-8");
    
    }    

    public function get_profile_image_url($conn, $user_id){
        $pic_sql = "SELECT avatar_hd from weibo_accesstoken_campaigns WHERE user_id = ?";
        $query = $conn->query($pic_sql, array($user_id));
        $row = $query->row_array();
        $pic = '';
        if($row){
            $pic = $row['avatar_hd'];
        }      
        return $pic;
    }

    public function get_influenced_people($selected_campaign_id, $selected_app_id){
        $conn = $this->load->database('default', TRUE);
        $sql = "SELECT COUNT(DISTINCT id) AS count_1 FROM `campaigns_diffusion` WHERE campaign_id = ? AND from_id = ?";
        $query = $conn -> query($sql, array($selected_campaign_id, $selected_app_id));
        
        foreach($query->result_array() as $row){
            $count_1 = $row['count_1'];
            // echo '<thead><th colspan=2 align=center>直接傳遞人數&nbsp;&nbsp;&nbsp;&nbsp;<a class="icon-info-sign" href="#" title="直接傳遞人數：直接參與此活動並且有分享活動訊息的人數"></a></th></thead>';
            // echo '<tbody><td colspan=2 align=center>'.$count_1.'</td></tbody>'; 
        }
        $query->free_result();
        
        //$sql_1 = "SELECT COUNT(DISTINCT id) AS count_2 FROM `campaigns_diffusion` WHERE app_id = '".$selected_app_id."' AND from_id != '".$selected_app_id."' AND from_id != id";
        //$result_1 = mysql_query($sql_1) or die('MySQL query error');
        $sql = "SELECT COUNT(DISTINCT id) AS count_2 FROM `campaigns_diffusion` WHERE campaign_id = ?";
        $query = $conn-> query($sql, array($selected_campaign_id));
    
        foreach($query->result_array() as $row){
            $count_2 = $row['count_2'];
            // echo '<thead><th colspan=2 align=center>間接傳遞人數&nbsp;&nbsp;&nbsp;&nbsp;<a class="icon-info-sign" href="#" title="間接傳遞人數：透過朋友所分享的文章而獲得此活動訊息的人數"></a></th></thead>';
            // echo '<tbody><td colspan=2 align=center>'.($count_2-$count_1).'</td></tbody>'; 
        }
        $query->free_result();

        $conn -> close();    
        return array('direct'=> $count_1,'indirect'=>($count_2-$count_1));         
    }    

    /**
     * 檢查是否可以建立campaign
     * @param  string $user_id user id
     * @return boolean          
     */
    public function checkBuildCampaignThreshold($user_id)
    {
        $conn = $this->load->database('default', TRUE);
        $sql = "SELECT build_campaign_threshold FROM `weibo_accesstoken_campaigns` WHERE user_id = ?;";
        $query = $conn -> query($sql, array($user_id));
        $row = $query->row_array();
        $threshold = 5;
        if($row){
            $threshold = $row['build_campaign_threshold'];
        }     
        $sql = "SELECT COUNT(*) AS build_count FROM `campaigns` WHERE user_id = ?;";
        $query = $conn -> query($sql, array($user_id));
        $row = $query->row_array();
        $used = 0;
        if($row){
            $used = $row['build_count'];
        }
        $conn -> close();
        $build_permission_flag = false;
        if($used < $threshold){
            $build_permission_flag = true;
        }
        return array("permission_flag"=> $build_permission_flag, "used_quota"=> $used, "quota"=>$threshold);
    }
}