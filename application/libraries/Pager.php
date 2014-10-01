<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pager {
    public $show_pages = 10;
    public $page = 1;
    public $items_per_page= 10;
    public $page_segment = '?page=';
    public $append_url_param = ''; //&a=xxx&b=xxx
    private $show_start_page = 1;
    private $show_end_page = 1;
    private $pre_page = 1;
    private $next_page = 1;
    private $total_num = 0;
    private $pages = 1;
    
    public function __construct($params)
    {
        if(isset($params['show_pages']) && !empty($params['show_pages'])){
            $this->show_pages = $params['show_pages'];
        }
        $half_show_pages = floor($this->show_pages / 2);                
        if(isset($params['page']) && !empty($params['page'])){
            $this->page = $params['page'];
        }
        if(isset($params['items_per_page']) && !empty($params['items_per_page'])){
            $this->items_per_page = $params['items_per_page'];
        }        
        if(isset($params['total_num']) && !empty($params['total_num'])){
            $this->total_num = $params['total_num'];
        }
        $this->pages = ceil($this->total_num/$this->items_per_page); //總頁數
        if($this->pages < 1){
            $this->pages = 1;
        }  
        if(isset($params['page_segment']) && !empty($params['page_segment'])){
            $this->page_segment = $params['page_segment'];
        }  
        if(isset($params['append_url_param']) && !empty($params['append_url_param'])){
            $this->append_url_param = $params['append_url_param'];
        } 
                        
        $this->show_start_page = $this->page - $half_show_pages;
        $this->show_start_page = ($this->show_start_page > 0) ? $this->show_start_page : 1;
        $this->show_end_page = $this->page + $half_show_pages;
        $this->show_end_page = ($this->pages > $this->show_end_page) ? $this->show_end_page : $this->pages;    
                     
        $this->prev_page = $this->page - 1;
        $this->prev_page = ($this->prev_page > 0) ? $this->prev_page : 1;
        $this->next_page = $this->page + 1;
        $this->next_page = ($this->pages > $this->next_page) ? $this->next_page : $this->pages;
        
    }
    
    public function pager($file_path)
    {
        
        
        $pager_html = '';
        $pager_html .= '<li><a href="'. $file_path . $this->page_segment. '1'. $this->append_url_param . '">1</a></li>';
        $pager_html .= '<li><a href="'. $file_path . $this->page_segment. $this->prev_page . $this->append_url_param .'">Prev</a></li>';
        for($i = $this->show_start_page ; $i <= $this->show_end_page ; $i++){
          if($this->page == $i){
             $pager_html .= '<li class="active"><a href="'. $file_path . $this->page_segment . $i . $this->append_url_param .'">'. $i .'</a></li>';
          }
          else{
             $pager_html .= '<li><a href="'. $file_path .$this->page_segment . $i . $this->append_url_param .'">'. $i .'</a></li>';
          }
        }
        $pager_html .= '<li><a href="' . $file_path . $this->page_segment . $this->next_page . $this->append_url_param .'">Next</a></li>';
        $pager_html .= '<li><a href="' . $file_path . $this->page_segment . $this->pages . $this->append_url_param .'">'. $this->pages. '</a></li>';  
        return $pager_html;            
    }
}

/* End of file Pager.php */
