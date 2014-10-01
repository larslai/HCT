<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class SessionPreProcess {
    
    public function define_session_name($session_name){
        session_name($session_name);
    }

}
/* End of file SessionPreProcess.php */
