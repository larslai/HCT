$(document).ready(function() {
        
        //the flag for promoting page 
        if(promote_target_nickname !== ''){       
            //check token
            if(token !== ""){
                WB2.anyWhere(function(W){
                    W.parseCMD("/friendships/show.json", function(sResult, bStatus){
                        //var uid = uid;
                        var accessToken = token;
                        // console.log(sResult);
                        // console.log(bStatus);
                        if(sResult.target.followed_by == true){
                            // console.log("已關注");
                            // $('#wb_follow_btn').text('已關注');
                            // W.widget.followButton({
                                // 'id': "wb_follow_btn",
                                // 'nick_name': promote_target_nickname,
                                // 'show_cancel': true,
                                // 'callback':function(action, userInfo){
                                    // // console.log("回傳:");
                                    // // console.log(action);
                                    // // console.log(userInfo);
                                    // if(action == 'create'){
                                        // //location.href="record_like.php?uid="+uid+"&accesstoken="+accessToken+"&isNew=1";
                                    // }
                                // }
                            // });         
                            //location.href="<?php echo base_url('/index.php/index/like/'); ?>" + "?uid="+uid+"&accesstoken="+accessToken+"&isNew=0";
                            r_like(uid, token, 0, sResult.target.id, cid);
                        }
                        else if(sResult.source.screen_name === sResult.target.screen_name){
                            //console.log("本人");
                        }
                        else{
                                        
                            $("#myModal").modal(); // initialized with defaults
                            $("#myModal").modal({ keyboard: false }); // initialized with no keyboard
                            $("#myModal").modal('show'); // initializes and invokes show immediately    
                            // console.log("未關注");                    
                            W.widget.followButton({
                                'id': "wb_follow_btn",
                                'nick_name': promote_target_nickname,
                                'show_cancel': true,
                                'callback':function(action, userInfo){
                                    // console.log("回傳:");
                                    // console.log(action);
                                    // console.log(userInfo);
                                    var tuid = userInfo.idstr;
                                    // console.log(idstr);
                                    if(action == 'create'){
                                        //location.href="record_like.php?uid="+uid+"&accesstoken="+accessToken+"&isNew=1";
                                        //location.href="<?php echo base_url('/index.php/index/like/'); ?>" +"?uid="+uid+"&accesstoken="+accessToken+"&isNew=1&tuid=" + tuid;
                                        r_like(uid, token, 1, sResult.target.id, cid);
                                        $("#myModal").modal('hide');
                                    }
                                }
                            });
                        }
                    },{
                        access_token: token,
                        source_id: uid,
                        target_screen_name:promote_target_nickname
                    },{
                        method: 'GET'
                    });
                });         
          
            }           
        }

                    
        WB2.anyWhere(function(W){
            W.widget.publish({
                /*action: "publish",*/
                language:"zh_tw",
                button_type:"red",
                button_size:"middle",
                button_type:"分享給朋友",
                default_text: share_url,
                refer:"y",
                id: "wb_publish",
                callback : function(o) {
                    r_share(cid, o.result.data.idstr, from_uid);
                }
            });
        });

        var startdate = $.parseJSON(line_chart_data.json_date);
        // var opts = {
        //   container: 'epiceditor',
        //   textarea: null,
        //   basePath: epic_options.basePath,
        //   clientSideStorage: true,
        //   localStorageName: 'epiceditor',
        //   useNativeFullscreen: true,
        //   parser: marked,
        //   file: {
        //     name: 'epiceditor',
        //     defaultContent: '',
        //     autoSave: 100
        //   },
        //   theme: {
        //     base: epic_options.theme.base,
        //     preview: epic_options.theme.preview,
        //     editor: epic_options.theme.editor
        //   },
        //   button: false,
        //   focusOnLoad: false,
        //   shortcut: {
        //     modifier: 18,
        //     fullscreen: 70,
        //     preview: 80
        //   },
        //   string: {
        //     togglePreview: 'Toggle Preview Mode',
        //     toggleEdit: 'Toggle Edit Mode',
        //     toggleFullscreen: 'Enter Fullscreen'
        //   },
        //   autogrow: false
        // };
        
        // var editor = new EpicEditor(opts).load();     
        // editor.importFile('epiceditor', campaign_content); //Imports a file when the user clicks this button
        // editor.preview();          
        // $("#ckeditor-previewer-frame").html(campaign_content);
        $('#ckeditor-previewer-frame').contents().find('head').append('<base target="_blank">');
        $('#ckeditor-previewer-frame').contents().find('head').append('<link type="text/css" rel="stylesheet" href="'+ckeditor_theme_url+'">');
        $('#ckeditor-previewer-frame').contents().find('body').append(campaign_content);
        //timeline
        //login check
        if(campaign_owner_uid == uid){
            if (line_chart_data.date_count == 1 && line_chart_data.totalcount[0] == 0) {
              $("#timecontainer").html('** 無資料或資料等待更新中，請等待更新完成 **');
            }
            else{
              $("#timecontainer").html('');
              var options = {
                  chart: {
                      renderTo: 'timecontainer',
                      zoomType: 'x',
                      spacingRight: 20
                  },
                  title: {
                      text: '活動傳播時間軸'
                  },
                  xAxis: {
                      type: 'datetime',
                      // maxZoom: 14 * 24 * 3600000, // fourteen days
                      minRange: (86400000),
                      title: {
                          text: '日期'
                      }
                  },
                  yAxis: {
                      title: {
                          text: '傳播數'
                      },
                      showFirstLabel: false
                  },
                  tooltip: {
                      shared: true,
                      xDateFormat: "%A, %b %e, %Y"
                  },
                  legend: {
                      enabled: false
                  },
                  plotOptions: {
                      area: {
                          fillColor: {
                              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                              stops: [
                                  [0, Highcharts.getOptions().colors[0]],
                                  [1, 'rgba(2,0,0,0)']
                              ]
                          },
                          lineWidth: 1,
                          marker: {
                              enabled: false,
                              states: {
                                  hover: {
                                      enabled: true,
                                      radius: 5
                                  }
                              }
                          },
                          shadow: false,
                          states: {
                              hover: {
                                  lineWidth: 1
                              }
                          },
                          threshold: null
                      }
                  },
          
                  series: [{
                      type: 'area',
                      name: '傳播數',
                      pointInterval: 24 * 3600 * 1000,
                      pointStart: Date.UTC(startdate.year, startdate.month-1, startdate.day),
                      data: [

                      ]
                  }],
                  credits: {
                      enabled: false
                  }
              }
              for(i=0; i < line_chart_data.date_count; i++){
                  options.series[0].data.push(parseInt(line_chart_data.totalcount[i]));
              }
              chart = new Highcharts.Chart(options);
            }
        }
});  
function r_share(cid, postid, from_uid){
    //console.log(cid + " " + postid);
    $.ajax({ url: "post",
         cache: false,
         data: {'cid': cid, 'postid': postid, 'from_uid': from_uid},
         type: 'get',
         dataType: 'json',
         success: function(response) {
         },
         error: function(data, status, e){
            //alert("ajax error:"+ e);
         }
    });              
}
function r_like(uid, accesstoken, isNew, tuid, cid){
    $.ajax({ url: "index/like/",
         cache: false,
         data: {"uid": uid, "accesstoken": accesstoken, "isNew": isNew, "tuid": tuid, "cid": cid},
         type: 'get',
         dataType: 'json',
         success: function(response) {
         },
         error: function(data, status, e){
            //alert("ajax error:"+ e);
         }
    });         
}