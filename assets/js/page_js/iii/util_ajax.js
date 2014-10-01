var Host = {
   "url": {
        "18": "http://124.9.6.18:8080/hct/",
        "srm": "http://srm.ideas.iii.org.tw/srank_dashboard_dev/index.php/ec_system_api/"
    }
};

/**
 * Fire a post request
 * @param {String} url
 * @param {Object} data
 * @param {Function} success A Function that accepts post response as its first argument.
 * @param {arg1,arg2,...} Second to last parameters of the success function
 */
function dataajax(url, data, success) {
    if ( url!==undefined && url.length>0 && data!==undefined & success!==undefined)
    {
        $.ajax
        ({
            url: url,
            cache: false,
            type: "get",
            data: data,
            dataType: "jsonp",
            error: function(xhr, ajaxOptions, thrownError)
            {
                //alert(xhr);
            },
            success: function(response)
            {
                if (typeof success === "function"){
                    this.arguments.unshift(response);
                    success.apply(null,this.arguments);
                }
            },
            arguments: Array.prototype.slice.call(arguments,3)
        });
    }
}