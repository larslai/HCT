$(document).ready(function() {
    $(".alert").alert();
           
    $('#build_campaign_li').addClass('active');

    // var opts = {
    //   container: 'epiceditor',
    //   textarea: null,
    //   basePath: epic_options.basePath,
    //   clientSideStorage: false,
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
    //   button: {
    //     preview: true,
    //     fullscreen: true,
    //     bar: "auto"
    //   },
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

    // $.ajax({ url: campaign_info_url,
    //      cache: false,
    //      data: {'mode': mode_flag, 'cid': campaign_id},
    //      type: 'post',
    //      dataType: 'json',
    //      success: function(response) {
    //         if(response.status == "Success"){
    //             var campaign_info = response.result;
    //             editor.importFile('epiceditor',campaign_info.campaign_text); 
    //             editor.open('epiceditor');
    //             $("input#campaign_name").val(campaign_info.campaign_name);
    //             if(campaign_info.promote_page_name != ''){
    //               $("input#promote_page_flag").prop("checked", true);
    //             }
    //         }
    //      },
    //      error: function(data, status, e){
    //         //alert("ajax error:"+ e);
    //         alert("資料載入失敗");
    //      }
    // });  
    

    $( '#editor1' ).ckeditor();
    $.ajax({ url: campaign_info_url,
         cache: false,
         data: {'mode': mode_flag, 'cid': campaign_id},
         type: 'post',
         dataType: 'json',
         success: function(response) {
            if(response.status == "Success"){
                var campaign_info = response.result;
                // editor.importFile('epiceditor',campaign_info.campaign_text); 
                // editor.open('epiceditor');
                CKEDITOR.instances['editor1'].setData(campaign_info.campaign_text);
                $("input#campaign_name").val(campaign_info.campaign_name);
                if(campaign_info.promote_page_name != ''){
                  $("input#promote_page_flag").prop("checked", true);
                }
            }
         },
         error: function(data, status, e){
            //alert("ajax error:"+ e);
            alert("資料載入失敗");
         }
    });
    
    $("#update_button").click(function () {
        //var theContent = editor.exportFile();
        var theContent = CKEDITOR.instances['editor1'].getData();
        var campaign_name = $("#campaign_name").val();
        var promote_page_name = '';
        //console.log($("#promote_page_flag").attr('checked'));
        if($("#promote_page_flag").prop( "checked" )){
            promote_page_name = screen_name;
        }
        if(campaign_name == null || campaign_name === ""){
            $("#campaign_name_message").html(" (不得為空)");
        }
        if(theContent == null || theContent === ""){
            $("#campaign_content_message").html(" (不得為空)");
        }
        if(campaign_name != null && campaign_name != "" &&
           theContent != null && theContent != ""){
            $.ajax({ url: 'build_campaign/save',
                 cache: false,
                 data: {'cid': campaign_id, 'campaign_name': campaign_name, 'campaign_text':theContent, 'promote_page_name': promote_page_name},
                 type: 'post',
                 dataType: 'json',
                 success: function(response) {
                    if(response.status == "Success"){
                        location.href = campaign_page_url + "?cid="+response.campaign_id;
                    }
                    else if(response.status == "Failed" && response.show_message == true){
                        $("#build_campaign_message").html(response.message);
                        $("#error_message").show();
                    }
                    else{
                        alert("Create or update failed");
                    }
                 },
                 error: function(data, status, e){
                    //alert("ajax error:"+ e);
                 }
            });                     
        }
          
    });  

});