/* global Util, utc2Date, Highcharts, tip_init, getSellerCommentsApi, Picker */

/* Chart Drawing*/
var Chart = {};

Chart.process_data = function(response,chart_type,column_mapping){
    var procd_response = response,
        procd_data,
        procd_distri,
        i;

    if (this.type_info.hasOwnProperty(chart_type)){
        if (this.type_info[chart_type]['draw_type']==="stock"){
            for (i=0; i<response.series.length; i+=1){
                this.to_stock_series(response.series[i].data);
            }
            procd_response.data = response.series;
        } else if (this.type_info[chart_type]['draw_type']==="custom_table" &&
                   Util.isFunction(this.type_info[chart_type]['selector_mapping'])) {
            if (Util.isFunction(this.type_info[chart_type]['data_proc'])){
                procd_data = (this.type_info[chart_type]['data_proc'])(response.data);
            }else{
                procd_data = response;
            }
            procd_response.data = (this.type_info[chart_type]['selector_mapping'])(procd_data.data);
        }else if (chart_type === "column_ranking"){
            procd_data = this.to_ranking_data(response.data);
            procd_response.categories = procd_data.categories;
            procd_response.data = this.to_ranking_series(
                                        procd_data.categories,
                                        procd_data.data,
                                        column_mapping);
        } else if (chart_type === "pie_basic"){
            procd_data = this.to_pie_data(response.data);
            procd_response.categories = procd_data.categories;
            procd_response.data = this.to_pie_series_data(
                                        procd_data.categories,
                                        procd_data.data);
        } else if (chart_type === "pie_donut"){
            procd_distri = this.sum_donut_db_data(
                                        response.categories,
                                        response.data,
                                        this.rule_timeslot_drilldown);
            procd_data = this.to_donut_data(procd_distri);
            procd_response.categories = procd_data.categories;
            procd_response.data = this.to_donut_series_data(
                                        procd_data.categories,
                                        procd_data.data);
        } else if (chart_type === "pie_drilldown") {
            procd_distri = this.sum_donut_db_data(
                                    response.categories,
                                    response.data,
                                    Chart.rule_area_drilldown);
            procd_data = this.to_donut_data(procd_distri);
            procd_response.categories = procd_data.categories;
            procd_response.data = this.to_drilldown_series(
                                        procd_data.categories,
                                        procd_data.data);
        }
    }
    return procd_response;
};

Chart.draw_chart = function (response,target,charttype,column_mapping) {
    var procd_data,
        chart_options,
        option = {},
        i, selector, value, attr;

    //process raw_data
    response = this.process_data(response,charttype,column_mapping);

    if (Util.hasElement(target)          &&
        response!==null                  &&
        Util.hasStrValue(response.title) &&
        (Util.isArray(response.data) || Util.hasObj(response.data)))
    {
        procd_data = response.data;
        option.title = response.title;

        if (Util.hasArrayObj(response.subtitle))
        {
            if (response.subtitle.length===1){
                option.subtitle = response.subtitle[0];
            }else{
                option.subtitle = response.subtitle;
            }
        }
        if (Util.hasStrValue(response.keyword)){
            option.keyword = response.keyword;
        }
        if (Util.isFunction(response.post_func)){
            option.post_func = response.post_func;
        }

        if (Util.hasArrayObj(procd_data)) //draw chart
        {
            chart_options = Chart.gen_options(charttype,procd_data,option);
            switch(this.type_info[charttype]['draw_type']){
                case 'table':
                    $(target).prev('p.no-data-msg').remove();
                    $(target).css('display','table');
                    $(target).dataTable(chart_options);
                    // var table = $(target).dataTable(chart_options);
                    // new FixedColumns( table, {
                    //          "iLeftColumns": 2,
                    //          "iRightColumns": 0
                    // } );
                    if (this.type_info[charttype]['double_column']===true){
                        //double the scroll if table exists
                        if ($.fn.dataTable.fnIsDataTable($(target)[0])){
                            $(target).parents(".dataTables_scroll").doubleScroll();
                        }
                    } else {
                        $(target).css("width","100%");
                    }
                    if (Util.isFunction(option.post_func)){
                        option.post_func(target);
                    }
                    break;
                case 'column':
                case 'pie':
                    if ($(target).highcharts()){
                        $(target).highcharts().destroy();
                    }
                    $(target).highcharts(chart_options);
                    break;
                case 'stock':
                    if ($(target).highcharts()){
                        $(target).highcharts().destroy();
                    }
                    $(target).highcharts('StockChart',chart_options);
                    break;
                case 'custom_table':
                    if ($(target).is('table')){
                        $(target).find('td > div.hide').removeClass('hide');
                    }

                    if (Util.hasArrayObj(chart_options.mapping)){
                        for (i = 0; i < chart_options.mapping['selector'].length; i += 1){
                            selector = chart_options.mapping['selector'][i];
                            value = chart_options.mapping['value'][i];
                            if (chart_options.mapping.hasOwnProperty('type') &&
                                Util.hasStrValue(chart_options.mapping['type'][i])){
                                switch (chart_options.mapping['type'][i]){
                                    case 'img':
                                        attr = $($(target).find(selector)[0]).attr('src');
                                        if (attr!==value){
                                            $($(target).find(selector)[0]).attr('src', value);
                                        }
                                        break;
                                    case 'href':
                                        attr = $($(target).find(selector)[0]).attr('href');
                                        if (attr!==value){
                                            $($(target).find(selector)[0]).attr('href', value);
                                        }
                                        break;
                                }
                            }else{
                                $(target).find(selector)[0].innerHTML = value;
                            }
                        }
                        if (typeof chart_options.func === 'function'){
                            chart_options.func(target);
                        }
                    }
                    break;
            }
        }else{ //destroy chart if no data
            switch(this.type_info[charttype]['draw_type']){
                case 'table':
                    if ($.fn.dataTable.fnIsDataTable($(target)[0])){
                        $(target).dataTable().fnDestroy();
                        $(target).empty();
                    }
                    if (!$(target).prev().is('p.no-data-msg')){
                        var msg = "此區間無統計資料";
                        if (Util.hasStrValue(this.type_info[charttype]['no_data_msg'])){
                            msg = this.type_info[charttype]['no_data_msg'];
                        }
                        $(target).before("<p class=\"no-data-msg\">"+ msg + "</p>");
                    }
                    break;
                case 'column':
                case 'pie':
                    if ($(target).highcharts()){
                        $(target).highcharts().destroy();
                    }
                    $(target)[0].innerHTML = '此區間無統計資料';
                    break;
            }
        }
    }
};

/* Chart Calculation */
Chart.to_stock_series = function(db_rows){
    var raw_data = db_rows;
    for (var i = 0; i < raw_data.length;i += 1)
    {
        var data = [
                    Util.utc2Date(raw_data[i].timestamp),
                    (raw_data[i].count===-1?raw_data[i].amt:raw_data[i].count)
                   ];
        raw_data[i] = data;
    }
    return raw_data;
};

Chart.to_shop_overview_product_total_mapping = function(db_rows){
    var mapping = {};

    mapping['selector'] = [ 'strong > span' ];
    mapping['value'] = [''];
    if(db_rows.length > 0){
        mapping['value'][0] = db_rows[0]['count'];
    }
    return mapping;
};

Chart.to_item_detail_overview_data = function(db_rows){
    var overview,
        i;
    if ( db_rows.length > 0){
        overview = db_rows[0];
        if (!Util.hasStrValue(overview['itemid'])){
            overview['title'] = '無該寶貝詳情';
            overview['url'] = '';
            overview['pics_url'] = '';
        }
        for(i=0;i<db_rows.length;i+=1){
            overview = db_rows[i];
            overview['ipv'] = Util.numberFormat(overview['ipv']);
            overview['iuv'] = Util.numberFormat(overview['iuv']);
            overview['gmv_auction_num'] = Util.numberFormat(overview['gmv_auction_num']);
            overview['gmv_trade_amt'] = Util.numberFormat(overview['gmv_trade_amt']);
            overview['alipay_auction_num'] = Util.numberFormat(overview['alipay_auction_num']);
            overview['alipay_trade_amt'] = Util.numberFormat(overview['alipay_trade_amt']);
            overview['coll'] = Util.numberFormat(overview['coll']);
        }
    }
    return { data: db_rows };
};

Chart.to_item_detail_overview_mapping = function(sum_overview){
    var mapping = {},
        overview,
        i, value_offset=0;
    mapping['selector'] = [
        'h4 > b',   //寶貝名稱
        'img',      //圖片網址
        'h4 > a',   //淘寶連結
        '.product-info:nth-child(1) ul li:nth-child(1) span',
        '.product-info:nth-child(1) ul li:nth-child(2) span',
        '.product-info:nth-child(1) ul li:nth-child(3) span',
        '.product-info:nth-child(1) ul li:nth-child(4) span',
        '.product-info:nth-child(1) ul li:nth-child(5) span',
        '.product-info:nth-child(1) ul li:nth-child(6) span',
        '.product-info:nth-child(1) ul li:nth-child(7) span',
        '.product-info:nth-child(2) ul li:nth-child(1) span',
        '.product-info:nth-child(2) ul li:nth-child(2) span',
        '.product-info:nth-child(2) ul li:nth-child(3) span',
        '.product-info:nth-child(2) ul li:nth-child(4) span',
        '.product-info:nth-child(2) ul li:nth-child(5) span',
        '.product-info:nth-child(2) ul li:nth-child(6) span',
        '.product-info:nth-child(2) ul li:nth-child(7) span'
    ];
    mapping['value'] = [];

    if (sum_overview.length >= 0) {
        overview = sum_overview[0];
        mapping['value'][0] = overview['title'];        //寶貝名稱
        mapping['value'][1] = overview['pics_url'];     //圖片網址
        mapping['value'][2] = overview['url'];          //淘寶連結
        value_offset += 3;

        if(sum_overview.length === 1 && overview['is_mobile']===true){ //如果只有mobile資料
            value_offset += 7;   //skip 7是pc端的7個項目
        }
        for(i=0;i<sum_overview.length;i+=1,value_offset+=7){
            overview = sum_overview[i];
            mapping['value'][value_offset] = overview['ipv']; //寶貝頁瀏覽量
            mapping['value'][value_offset + 1] = overview['iuv']; //寶貝頁訪客數
            mapping['value'][value_offset + 2] = overview['gmv_auction_num']; //拍下件數
            mapping['value'][value_offset + 3] = overview['gmv_trade_amt'];   //拍下金額
            mapping['value'][value_offset + 4] = overview['alipay_auction_num'];  //支付寶成交件數
            mapping['value'][value_offset + 5] = overview['alipay_trade_amt'];    //支付寶成交金額
            mapping['value'][value_offset + 6] = overview['coll']; //寶貝頁收藏量
        }
        mapping['type'] = [];
        mapping['type'][1] = 'img';
        mapping['type'][2] = 'href';
    }
    for (i=0;i<mapping['selector'].length;i+=1){
        if (!Util.hasStrValue(mapping['value'][i])){
            mapping['value'][i] = 0;
        }
    }
    return mapping;
};

Chart.to_shop_overview_rank_data = function(db_rows){
    var overview;
    if ( db_rows.length > 0){
        overview = db_rows[0];
        overview['ahead_rate'] = Util.numberFormat(overview['ahead_rate']*100,2);
        overview['rank'] = overview['rank'].toString();
        overview['rank_growth'] = Util.numberFormat(overview['rank_growth']);
    }
    return { data: db_rows };
};

Chart.to_shop_overview_rank_mapping = function(sum_overview){
    var mapping = {},
        overview,
        i;
    mapping['selector'] = [
        '.plan-container:nth-child(1) .plan-title > span',
        '.plan-container:nth-child(1) .plan-price > span:nth-child(2)',
        '.plan-container:nth-child(1) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(1) .plan-features li:nth-child(2) strong'
    ];
    mapping['value'] = [];
    if (sum_overview.length > 0) {
        overview = sum_overview[0];
        mapping['value'] = [
            overview['category_name'],  //類別名稱
            overview['ahead_rate'],     //超越率
            overview['rank'],           //排名
            overview['rank_growth']     //與昨日排名比較
        ];
    }
    for (i=0;i<mapping['selector'].length;i+=1){
        if (!Util.hasStrValue(mapping['value'][i])){
            mapping['value'][i] = '';
        }
    }
    return mapping;
};

Chart.to_shop_coredata_day_data = function(db_rows){
    var overview,
        yday_gr,
        owbday_gr,
        i,
        prop;
    if ( db_rows.length > 0){
        for(i=0;i<db_rows.length;i+=1){
            if (db_rows[i]['mark']==='curt'){
                overview = db_rows[i];
            }else if (db_rows[i]['mark']==='yday'){
                yday_gr = db_rows[i];
            }else if (db_rows[i]['mark']==='owbday'){
                owbday_gr = db_rows[i];
            }
        }
        if (Util.hasObj(overview)){
            if (Util.hasObj(yday_gr)){
                for (prop in yday_gr){
                    if ( yday_gr.hasOwnProperty(prop) && prop!=='mark'){
                        yday_gr[prop] = Util.getGrowthRate(overview[prop],yday_gr[prop]);
                        yday_gr[prop] = yday_gr[prop]*(prop==='service_score'?1000:100);
                        yday_gr[prop] = Util.numberFormat(yday_gr[prop],2);
                    }
                }
            }
            if (Util.hasObj(owbday_gr)){
                for (prop in owbday_gr){
                    if ( owbday_gr.hasOwnProperty(prop) && prop!=='mark'){
                        owbday_gr[prop] = Util.getGrowthRate(overview[prop],owbday_gr[prop]);
                        owbday_gr[prop] = owbday_gr[prop]*(prop==='service_score'?1000:100);
                        owbday_gr[prop] = Util.numberFormat(owbday_gr[prop],2);
                    }
                }
            }

            overview['uv'] = Util.numberFormat(overview['uv']);
            overview['pv'] = Util.numberFormat(overview['pv']);
            overview['alipay_convert'] = Util.numberFormat(overview['alipay_convert']*100,2)+'%';
            overview['alipay_trade_amt'] = Util.numberFormat(overview['alipay_trade_amt'],2);
            overview['avg_user_alipay'] = Util.numberFormat(overview['avg_user_alipay'],2);
            overview['service_score'] = Util.numberFormat(overview['service_score'],5);
        }
    }
    return { data: db_rows };
};

Chart.to_shop_coredata_day_mapping = function(day_data){
    var mapping = {},
        prop_arr=['uv', 'pv', 'alipay_convert', 'alipay_trade_amt', 'avg_user_alipay', 'service_score'],
        day,
        yday_gr,
        owbday_gr,
        i;

    mapping['selector'] = [
        '.plan-container:nth-child(1) .plan-price',
        '.plan-container:nth-child(2) .plan-price',
        '.plan-container:nth-child(3) .plan-price',
        '.plan-container:nth-child(4) .plan-price',
        '.plan-container:nth-child(5) .plan-price',
        '.plan-container:nth-child(6) .plan-price',
        '.plan-container:nth-child(1) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(2) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(3) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(4) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(5) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(6) .plan-features li:nth-child(1) strong',
        '.plan-container:nth-child(1) .plan-features li:nth-child(2) strong',
        '.plan-container:nth-child(2) .plan-features li:nth-child(2) strong',
        '.plan-container:nth-child(3) .plan-features li:nth-child(2) strong',
        '.plan-container:nth-child(4) .plan-features li:nth-child(2) strong',
        '.plan-container:nth-child(5) .plan-features li:nth-child(2) strong',
        '.plan-container:nth-child(6) .plan-features li:nth-child(2) strong'
    ];
    mapping['value'] = [];
    if (day_data.length>0) {
        for(i=0;i<day_data.length;i+=1){
            if (day_data[i]['mark']==='curt'){
                day = day_data[i];
            }else if (day_data[i]['mark']==='yday'){
                yday_gr = day_data[i];
            }else if (day_data[i]['mark']==='owbday'){
                owbday_gr = day_data[i];
            }
        }
        for (i=0;i<prop_arr.length;i+=1){
            if (Util.hasObj(day)){
                mapping['value'][i] = day[prop_arr[i]];
            }
            if (Util.hasObj(yday_gr)){
                mapping['value'][i+prop_arr.length] = yday_gr[prop_arr[i]];
            }
            if (Util.hasObj(owbday_gr)){
                mapping['value'][i+2*prop_arr.length] = owbday_gr[prop_arr[i]];
            }
        }
        day = null;
    }
    for (i=0;i<mapping['selector'].length;i+=1){
        if (!Util.hasStrValue(mapping['value'][i])){
            mapping['value'][i] = '';
        }
    }
    return mapping;
};

Chart.to_itemflow_overview_data = function(db_rows){
    var overview;
    if ( db_rows.length > 0){
        overview = db_rows[0];
        overview['pv'] = Util.numberFormat(overview['pv']);
        overview['avg_acc_time'] = Util.getReadableTime(overview['avg_acc_time']);
        overview['item_avg_bounce'] = Util.numberFormat(overview['item_avg_bounce']*100)+'%';
        overview['uv'] = Util.numberFormat(overview['uv']);
        overview['item_avg_uv'] = Util.numberFormat(overview['item_avg_uv']);
    }
    return { data: db_rows };
};

Chart.to_itemflow_overview_mapping = function(sum_overview){
    var mapping = {},
        overview;
    if (sum_overview.length > 0) {
        overview = sum_overview[0];
        mapping['selector'] = [
            'tr:nth-child(1) > td:nth-child(2)',
            'tr:nth-child(1) > td:nth-child(4)',
            'tr:nth-child(1) > td:nth-child(6)',
            'tr:nth-child(2) > td:nth-child(2)',
            'tr:nth-child(2) > td:nth-child(4)'
        ];
        mapping['value'] = [
            overview['pv'],                 //宝贝浏览量
            overview['avg_acc_time'],       //宝贝平均停留时间
            overview['item_avg_bounce'],    //宝贝平均跳失率
            overview['uv'],                 //宝贝查看人次
            overview['item_avg_uv']        //宝贝查看人次日均值
        ];
    }
    return mapping;
};

Chart.to_hometotal_overview_data = function(db_rows){
    var overview;

    if (db_rows.length > 0){
        overview = db_rows[0];
        overview['pv'] = Util.numberFormat(overview['pv']);
        overview['avg_pv'] = Util.numberFormat(overview['avg_pv']);
        overview['avg_uv'] = Util.numberFormat(overview['avg_uv']);
        overview['avg_time'] = Util.numberFormat(overview['avg_time'],2)+'秒';
        overview['click_rate'] = Util.numberFormat(overview['click_rate']*100,2)+'%';
        overview['bounce'] = Util.numberFormat(overview['bounce']*100,2)+'%';
        overview['pv_over_site'] = Util.numberFormat(overview['pv_over_site']*100,2)+'%';
        overview['avg_pv_over_site'] = Util.numberFormat(overview['avg_pv_over_site']*100,2)+'%';
        overview['avg_uv_over_site'] = Util.numberFormat(overview['avg_uv_over_site']*100,2)+'%';
    }
    return { data: db_rows };
};

Chart.to_hometotal_overview_mapping = function(sum_overview){
    var mapping = {},
        overview;
    if (sum_overview.length > 0){
        overview = sum_overview[0];
        mapping['selector'] = [
            'tr:nth-child(1) > td:nth-child(2)',
            'tr:nth-child(1) > td:nth-child(3)',
            'tr:nth-child(1) > td:nth-child(4)',
            'tr:nth-child(1) > td:nth-child(5)',
            'tr:nth-child(1) > td:nth-child(6)',
            'tr:nth-child(1) > td:nth-child(7)',
            'tr:nth-child(2) > td:nth-child(2)',
            'tr:nth-child(2) > td:nth-child(3)',
            'tr:nth-child(2) > td:nth-child(4)'
        ];

        mapping['value'] = [
            overview['pv'],                 //( 首頁數據 )瀏覽量
            overview['avg_pv'],             //( 首頁數據 )瀏覽量日均值
            overview['avg_uv'],             //( 首頁數據 )訪客數日均值
            overview['avg_time'],           //( 首頁數據 )首頁平均停留時間
            overview['click_rate'],         //( 首頁數據 )鏈接點擊率
            overview['bounce'],             //( 首頁數據 )跳失率
            overview['pv_over_site'],       //(佔全店比例)瀏覽量
            overview['avg_pv_over_site'],   //(佔全店比例)瀏覽量日均值
            overview['avg_uv_over_site']    //(佔全店比例)訪客數日均值
        ];
    }
    return mapping;
};

Chart.to_sellreportbuyer_overview_data = function(db_rows){
    var overview;

    if ( db_rows.length>0 ){
        overview = db_rows[0];
        overview['alipay_winner_num'] = Util.numberFormat(overview['alipay_winner_num']);
        overview['alipay_auction_num'] = Util.numberFormat(overview['alipay_auction_num']);
        overview['avg_winner_num'] = Util.numberFormat(overview['avg_winner_num'],2);
        overview['alipay_trade_num'] = Util.numberFormat(overview['alipay_trade_num']);
        overview['avg_trade_num'] = Util.numberFormat(overview['avg_trade_num'],2);
        overview['alipay_trade_amt'] = Util.numberFormat(overview['alipay_trade_amt'],2);
        overview['avg_ext'] = Util.numberFormat(overview['avg_ext'],2);
    }
    return { data: db_rows };
};

Chart.to_sellreportbuyer_overview_mapping = function(sum_overview){
    var mapping = {},
        overview = sum_overview[0];
    if (sum_overview.length > 0) {
        mapping['selector'] = [
            'tr:nth-child(1) > td:nth-child(1)',
            'tr:nth-child(1) > td:nth-child(2)',
            'tr:nth-child(1) > td:nth-child(3)',
            'tr:nth-child(1) > td:nth-child(4)',
            'tr:nth-child(1) > td:nth-child(5)',
            'tr:nth-child(1) > td:nth-child(6)',
            'tr:nth-child(1) > td:nth-child(7)'
        ];
        mapping['value'] = [
            overview['alipay_winner_num'],  //成交用戶數
            overview['alipay_auction_num'], //支付寶成交件數
            overview['avg_winner_num'],     //人均成交件數
            overview['alipay_trade_num'],   //支付寶成交筆數
            overview['avg_trade_num'],      //人均成交筆數
            overview['alipay_trade_amt'],   //支付寶成交金額
            overview['avg_ext']             //客單價均值
        ];
    }
    return mapping;
};

Chart.to_sellreportdata_overview_data = function(db_rows){
    var overview;

    if ( db_rows.length>0 ){
        overview = db_rows[0];
        overview['ipv'] = Util.numberFormat(overview['ipv']);
        overview['alipay_auction_num'] = Util.numberFormat(overview['alipay_auction_num']);
        overview['alipay_winner_num'] = Util.numberFormat(overview['alipay_winner_num']);
        overview['iuv'] = Util.numberFormat(overview['iuv']);
        overview['alipay_trade_num'] = Util.numberFormat(overview['alipay_trade_num']);
        overview['roc'] = Util.numberFormat(overview['roc']*100,2)+'%';
        overview['alipay_trade_amt'] = Util.numberFormat(overview['alipay_trade_amt'],2);
    }
    return { data: db_rows };
};

Chart.to_sellreportdata_overview_mapping = function(sum_overview){
    var mapping = {},
        overview;
    if (sum_overview.length > 0) {
        overview = sum_overview[0];
        mapping['selector'] = [
            'tr:nth-child(1) > td:nth-child(2)',
            'tr:nth-child(1) > td:nth-child(4)',
            'tr:nth-child(1) > td:nth-child(6)',
            'tr:nth-child(2) > td:nth-child(2)',
            'tr:nth-child(2) > td:nth-child(4)',
            'tr:nth-child(2) > td:nth-child(6)',
            'tr:nth-child(3) > td:nth-child(3)'
        ];
        mapping['value'] = [
            overview['ipv'],                //寶貝頁瀏覽量
            overview['alipay_auction_num'], //支付寶成交件數
            overview['alipay_winner_num'],  //成交用戶數(已去重)
            overview['iuv'],                //寶貝頁訪客數(含重複訪客)
            overview['alipay_trade_num'],   //支付寶成交筆數
            overview['roc'],                //寶貝頁成交轉化率
            overview['alipay_trade_amt']   //支付寶成交金額
        ];
    }
    return mapping;
};

Chart.to_pie_data = function (db_rows){
    var raw_data = db_rows,
        categories = [],
        data = [];

    for (var i = 0; i < raw_data.length; i += 1){
        categories.push(raw_data[i].category);
        data.push(raw_data[i].count);
    }
    return {categories:categories,data:data};
};

Chart.to_ranking_data = function (db_rows){
    var raw_data = db_rows,
        categories = [],
        data = [],
        period;
    if (raw_data.length>0 && raw_data[0].hasOwnProperty('date')){
        period = raw_data[0]['date'].split('~');
    }
    for (var i = 0; i < raw_data.length; i +=1){
        if (raw_data[i].hasOwnProperty('date')){
            raw_data[i]['url'] = "./taiwanProductDetail?id="+raw_data[i]['itemid']+"&from="+period[0]+"&to="+period[1];
        }
        categories.push(i+1);
        data.push(raw_data[i]);
    }
    return {categories:categories,data:data};
};

Chart.to_pie_series_data = function(cat_arr, data_arr) {
    var cvrt_arr = [],
        total = Util.sumArray(data_arr);

    if (Util.hasArrayObj(cat_arr)&&
        Util.hasArrayObj(data_arr)&&
        cat_arr.length===data_arr.length)
    {
        for (var i = 0; i < data_arr.length; i += 1){
            cvrt_arr.push([cat_arr[i],(data_arr[i]/total*100)]);
        }
    }
    return cvrt_arr;
};

Chart.to_ranking_series = function(categories, ranking_data, column_mapping) {
    var rankingSeries = [],
        dataArray,
        seriesObj,
        columnMapping = column_mapping,
        hrefOption = {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                    var itemURL = this.series.userOptions.href;
                                    if (itemURL){
                                        window.open(itemURL);
                                    }
                                }
                            }
                        }
                    };
    if (Util.hasArrayObj(categories)&&
        Util.hasArrayObj(ranking_data)&&
        categories.length!==0 &&
        categories.length===ranking_data.length)
    {
        if (arguments.length===2 || columnMapping===undefined){
            columnMapping = { name:"description", data:"count" };
        }
        if (Util.hasStrValue(columnMapping.name) &&
            Util.hasStrValue(columnMapping.data))
        {
            for (var i = 0; i < ranking_data.length; i += 1){
                dataArray = [];
                for (var j = 0; j < ranking_data.length; j += 1){
                    dataArray.push((i===j)?ranking_data[i][columnMapping.data]:null);
                }
                seriesObj = {
                    name: ranking_data[i][columnMapping.name],
                    data: dataArray
                };
                if (columnMapping.hasOwnProperty("href")){
                    seriesObj["href"] = ranking_data[i][columnMapping.href];
                    seriesObj = Util.extendObj(seriesObj,hrefOption);
                }
                rankingSeries.push(seriesObj);
            }
        }
    }
    return rankingSeries;
};

Chart.to_donut_data = function(sum_distri){
    var colors = Highcharts.getOptions().colors,
        donut_categories = [],
        donut_data = [];

    for (var i = 0; i < sum_distri.length; i += 1){
        donut_categories.push (sum_distri[i].category);
        donut_data.push({
            y        : sum_distri[i].total,
            color    : colors[i],
            drilldown: {
                name      : "分佈",//sum_distri[i].name,
                categories: sum_distri[i].drilldown_items,
                data      : sum_distri[i].percentages,
                color     : colors[i]
            }

        });
    }
    return {categories:donut_categories,data:donut_data};
};

Chart.to_donut_series_data = function(categories,raw_data){
    var categoryData = [],
        drilldownData = [];
    for (var i = 0; i < raw_data.length; i += 1) {

        // add categories data
        categoryData.push({
            name : categories[i],
            y    : raw_data[i].y,
            color: raw_data[i].color
        });

        // add drilldown data
        for (var j = 0; j < raw_data[i].drilldown.data.length; j += 1) {
            var brightness = 0.2 - (j / raw_data[i].drilldown.data.length) / 5 ;
            drilldownData.push({
                name : raw_data[i].drilldown.categories[j],
                y    : raw_data[i].drilldown.data[j],
                color: Highcharts.Color(raw_data[i].color).brighten(brightness).get()
            });
        }
    }
    return {categories:categoryData,drilldown:drilldownData};
};

Chart.to_drilldown_series = function(categories,raw_data){
    var categoryData = [],
        drilldownData = [];
    for (var i = 0; i < raw_data.length; i += 1) {

        // add categories data
        categoryData.push({
            name     : categories[i],
            y        : raw_data[i].y,
            color    : raw_data[i].color,
            drilldown: categories[i]    //indicate drilldownData.id
        });

        // add drilldown data
        drilldownData.push({
            name: categories[i],
            id  : categories[i],
            data: []
        });

        for (var j = 0; j < raw_data[i].drilldown.data.length; j += 1) {
            drilldownData[i].data.push(
                [
                    raw_data[i].drilldown.categories[j],
                    raw_data[i].drilldown.data[j]
                ]
            );
        }
    }
    return {categories:categoryData,drilldown:drilldownData};
};



Chart.rule_area_drilldown = {
    if_match : function(category,drilldown_item){
        var match = drilldown_item.indexOf(category)!==-1;
        return match;
    },
    get_name : function(category,drilldown_item){
        var name = (category.length===drilldown_item.length) ?
                        category :
                        drilldown_item.substring(category.length);
        return (name===null || name.length===0) ? drilldown_item : name;
    }
};

Chart.rule_timeslot_drilldown = {
    categories : ["時段3:00-11:00","時段11:00-19:00","時段19:00-3:00"],
    timeslots : [
                    //3:00~11:00
                    ["3:00-4:59","5:00-6:59","7:00-8:59","9:00-10:59"],
                    //11:00~19:00
                    ["11:00-12:59","13:00-14:59","15:00-16:59","17:00-18:59"],
                    //19:00~3:00
                    ["19:00-20:59","21:00-22:59","23:00-00:59","1:00-2:59"]
               ],
    if_match : function(category,drilldown_item){
        var match =  false,
            index = -1;
        if ( (index = jQuery.inArray(category,this.categories))!==-1 &&
             jQuery.inArray(drilldown_item, this.timeslots[index])!==-1){
                match = true;
        }
        return match;
    },
    get_name : function(category,drilldown_item){
        return drilldown_item;
    }
};

Chart.sum_donut_db_data = function (categories,db_rows,drilldown_rule){
    var raw_distri = db_rows,
        sum_distri = [],
        drilldown_items,
        percentages,
        total,
        categories_obj;

    for (var cate_idx = 0; cate_idx < categories.length; cate_idx += 1){
        drilldown_items = [];
        percentages = [];
        total = 0;
        for (var i = 0; i < raw_distri.length; i += 1){
            if (drilldown_rule.if_match(categories[cate_idx],raw_distri[i].drilldown_item))
            {
                drilldown_items.push(
                    drilldown_rule.get_name(
                        categories[cate_idx],raw_distri[i].drilldown_item
                    )
                );
                percentages.push(raw_distri[i].percentage);
                total += raw_distri[i].percentage;
            }
        }
        if (total!==0){
            categories_obj = {
                category       : categories[cate_idx],
                total          : total,
                drilldown_items: drilldown_items,
                percentages    : percentages
            };
            sum_distri.push(categories_obj);
        }
        // else{
        //     sum_distri.push(null);
        // }
    }
    return sum_distri;
};

/* Chart Display */
Chart.hide_all = function(){
    $("div[data-highcharts-chart]:visible").each(function(){
        $(this).hide();
    });
};

Chart.gen_stock_buttons = function(level_above){
    var buttons=null,
        levels = ['day','week','month','all'],
        start_idx = jQuery.inArray(level_above,levels),
        selection =[  { type:   'day', count: 1, text: '1d' },
                      { type:  'week', count: 1, text: '1w' },
                      { type:  'week', count: 2, text: '2w' },
                      { type: 'month', count: 1, text: '1m' },
                      { type: 'month', count: 3, text: '3m' },
                      { type:   'all', text: 'All'} ];
    if (start_idx!==-1){
        buttons = [];
        for (var i = start_idx; i < levels.length; i += 1){
            //push buttons of choosen and above levels.
            for(var sel_idx=0; sel_idx < selection.length; sel_idx += 1){
                if (selection[sel_idx].type===levels[i]){
                    buttons.push(selection[sel_idx]);
                }
            }
        }
    }
    return buttons;
};

Chart.type_info = {
    //銷售分析 - 寶貝銷售排行 - 寶貝信息匯總
    table_sellreportdata_overview: {
        draw_type: "custom_table",
        data_proc: Chart.to_sellreportdata_overview_data,
        selector_mapping: Chart.to_sellreportdata_overview_mapping
    },
    //銷售分析 - 寶貝銷售排行 - 寶貝銷售明細
    table_sellreportdata_report: {
        draw_type: "table",
        double_column: true,
        custom_options : {
            sDom: '<"H"f>t<"F"p>',
            bFilter: true,
            sScrollX: "100%",
            bScrollCollapse: true,
            fnDrawCallback: function ( oSettings ) {
                var that = this;
                /* Need to redo the counters if filtered or sorted */
                if ( oSettings.bSorted || oSettings.bFiltered )
                {
                    this.$('td:first-child', {"filter":"applied"}).each( function (i) {
                        that.fnUpdate( i+1, this.parentNode, 0, false, false );
                    } );
                }
            },
            aaSorting: [[11,'desc']],
            aoColumnDefs:[
                { sClass:"table-td-centered", aTargets:["_all"] },
                { bSortable: false, aTargets: [0,1,2,3,4,7,10,14,15] },
                { sWidth: "250px", aTargets: [1] },
                { sWidth: "120px", aTargets: [2,3,4,8,9] },
                { sWidth: "155px", aTargets: [5,6,7,10,11,12,13,14,15,16]},
                //{ sWidth: "180px", aTargets: [5]},
                { sWidth: "80px", aTargets: [0] },
                { sTitle:"序號", aTargets:[0], sDefaultContent: ""},
                { sTitle:"寶貝名稱",
                  mData: "name",
                  mRender: function ( data, type, full ) {
                    var returnStr = (full.name===null)? "" : full.name;
                    var period = full.date.split('~');
                    returnStr = (returnStr.length===0 || full.url===null) ? returnStr:
                                '<a href="./taiwanProductDetail?id='+full.itemid+'&from='+period[0]+'&to='+period[1]+'" target="_blank">'+returnStr+'</a>';
                    return returnStr;
                  },
                  sDefaultContent: "",
                  aTargets: [1]
                },
                { sTitle:"寶貝ID",
                  mData: "url",
                  mRender: function ( data, type, full ) {
                    var item_id = data.length>0 ? data.match(/=(\d+)/) : data;
                    item_id = Util.isArray(item_id)? item_id[1] : '';
                    return item_id;
                  },
                  sDefaultContent: "",
                  aTargets: [2]
                },
                { sTitle:"最近上架時間",
                  mData: "list_time",
                  aTargets:[3]
                },
                { sTitle:"寶貝價格(元)",
                  mData: "price",
                  mRender: function ( data, type, full ) {
                    return (data<0)?'':data;
                  },
                  aTargets:[4]
                },
                { sTitle: "寶貝頁瀏覽量<i class=\"autotip icon-question-sign\"></i>"+
                          "<!-- <div class=\"tips\">店铺宝贝页面被查看的次数，用户每打开或刷新一个宝贝页面，该指标就会增加。</div> -->",
                  mData: "ipv", aTargets:[5]},
                { sTitle:"寶貝頁訪客數<!--<br>(含重複訪客)--><i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">店铺宝贝页面的访问人数。所选时间段内，访客数加总。</div> --><!-- 所选时间段内，同一访客多次访问会进行去重计算。 -->",
                  mData: "iuv", aTargets: [6]
                },
                { sTitle:"跳失率<!--<br>(日數據平均值)--><i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">1.进店后只访问了该宝贝1个页面就离开的访问次数占该宝贝总访问次数的百分比。<br />2. “按月”、“按周”查看报表时，该指标是所选时间段内日数据的平均值</div> -->",
                  mData: "bounce_rate",
                  mRender: function ( data, type, full ) {
                    return (data<0)?'-':Util.numberFormat(data*100,2)+'%';
                  },
                  aTargets: [7]
                },
                { sTitle:"拍下件數<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">宝贝被拍下的总件数。</div> -->",
                  mData: "gmv_auction_num", aTargets:[8]
                },
                { sTitle:"拍下金額<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">所选时间内，买家拍下宝贝的总金额。（按照宝贝原价计算，不含邮费）。</div> -->",
                  mData: "gmv_trade_amt", aTargets:[9]
                },
                { sTitle:"成交用戶數<!--<br>(含重複成交用戶)--><i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">成功拍下并完成支付宝付款的人数。所选时间段内人数加总。</div> --><!-- 所选时间段内同一用户发生多笔成交会进行去重计算。 -->",
                  mData: "alipay_winner_num", aTargets: [10]
                },
                { sTitle:"支付寶成交件數<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">通过支付宝付款的宝贝总件数。</div> -->",
                  mData: "alipay_auction_num", aTargets:[11]
                },
                { sTitle:"支付寶成交筆數<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">所选时间内，买家拍下并且已付款的成交笔数。（买家在同一个订单中，拍下多件同款宝贝，若型号或颜色不同，则算作不同笔数）</div> -->",
                  mData: "alipay_trade_num", aTargets:[12]
                },
                { sTitle:"支付寶成交金額<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">所选时间内，买家拍下并且已付款到支付宝的金额（包含邮费与退款）。</div> -->",
                  mData: "alipay_trade_amt", aTargets:[13]
                },
                { sTitle:"寶貝頁成交轉化率<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">成交用户数占宝贝页访客数的百分比，即宝贝页成交转化率<b>=</b>成交用户数<b>/</b>宝贝页访客数。“按月”、“按周”查看报表时，该指标是所选所选时间段内日数据的平均值。</div> -->",
                  mData: "roc",
                  mRender: function ( data, type, full ) {
                    return (data<0)?'無法取得寶貝頁去重訪客數':Util.numberFormat(data*100,2)+'%';
                  },
                  aTargets: [14]
                },
                { sTitle:"人均成交件數<!--<br>(週數據相除)--><i class=\"autotip icon-question-sign pop-bottom-center\"></i>"+
                         "<!-- <div class=\"tips\">平均每用户成交的商品件数，即人均成交件数<b>=</b>支付宝成交件数<b>/</b>成交用户数。“按月”、“按周”查看报表时，该指标是所选所选时间段内日数据的平均值</div> -->",
                  mData: "avg_winner_num",
                  mRender: function ( data, type, full ) {
                    return (data<0)?'無法取得去重成交用戶數':Util.numberFormat(data,2);
                  },
                  aTargets: [15]
                },
                { sTitle:"寶貝頁收藏量<i class=\"autotip icon-question-sign pop-bottom-left\"></i>"+
                         "<!-- <div class=\"tips\">用户访问宝贝页面添加收藏的总次数。</div> -->",
                  mData: "coll", aTargets:[16]
                }
            ]
        }
    },
    //銷售分析 - 買家購買分析 - 買家信息匯總
    table_sellreportbuyer_overview: {
        draw_type: "custom_table",
        data_proc: Chart.to_sellreportbuyer_overview_data,
        selector_mapping: Chart.to_sellreportbuyer_overview_mapping
    },
    //銷售分析 - 買家購買分析 - 買家購買明細
    table_sellreportbuyer_report: {
        draw_type: "table",
        custom_options : {
            fnDrawCallback: function ( oSettings ) {
                var that = this;
                /* Need to redo the counters if filtered or sorted */
                if ( oSettings.bSorted || oSettings.bFiltered )
                {
                    this.$('td:first-child', {"filter":"applied"}).each( function (i) {
                        that.fnUpdate( i+1, this.parentNode, 0, false, false );
                    } );
                }
            },
            aaSorting: [[2,'desc']],
            aoColumnDefs: [
                { sClass:"table-td-centered", aTargets:["_all"] },
                { bSortable: false, aTargets: [0,1,6] },
                { sWidth: "140px", aTargets: [1] },
                { sTitle:"序號", sDefaultContent: "", aTargets:[0]},
                { sTitle:"買家ID", mData: "buyerid", aTargets:[1]},
                { sTitle:"支付寶成交件數", mData: "alipay_auction_num", aTargets: [2] },
                { sTitle:"支付寶成交筆數", mData: "alipay_trade_num", aTargets: [3] },
                { sTitle:"支付寶成交訂單數", mData: "alipay_parent_order_num", aTargets: [4] },
                { sTitle:"支付寶成交金額",
                  mData: "alipay_trade_amt",
                  mRender: function ( data, type, full ) {
                    return Util.numberFormat(data,2);
                  },
                  aTargets: [5]
                },
                { sTitle:"是否成交回頭客", mData: "trade_repeat", aTargets: [6] }
            ]
        }
    },
    //流量分析 - 寶貝被訪排行 - 寶貝數據匯總
    table_itemflow_overview : {
        draw_type: "custom_table",
        data_proc: Chart.to_itemflow_overview_data,
        selector_mapping: Chart.to_itemflow_overview_mapping
    },
    //流量分析 - 寶貝被訪排行 - 寶貝被訪名細
    table_itemflow_report : {
        draw_type: "table",
        custom_options: function(option){
            return {
                sDom: '<"H"f>t<"F"p>',
                bFilter: true,
                fnDrawCallback: function ( oSettings ) {
                    var that = this;
                    /* Need to redo the counters if filtered or sorted */
                    if ( oSettings.bSorted || oSettings.bFiltered )
                    {
                        this.$('td:first-child', {"filter":"applied"}).each( function (i) {
                            that.fnUpdate( i+1, this.parentNode, 0, false, false );
                        } );
                    }
                },

                aaSorting: [[(option.subtitle==='訪客數'?5:4),'desc']],
                aoColumnDefs: [
                    { sClass:"table-td-centered", aTargets:["_all"] },
                    { bSortable: false, aTargets: [0,1,2,7] },
                    { sWidth: "50px", aTargets: [0] },
                    { sWidth: "120px", aTargets: [4,5,6] },
                    { sWidth: "75px", aTargets: [3,7] },
                    { sTitle:"序號", aTargets:[0], sDefaultContent: ""},
                    { sTitle:"寶貝名稱",
                      mData: "title",
                      mRender: function ( data, type, full ) {
                        var period = full.date.split('~');
                        return '<a href="./taiwanProductDetail?id='+full.itemid+'&from='+period[0]+'&to='+period[1]+'" target="_blank">'+full.title+'</a>';
                      },
                      sDefaultContent: "",
                      aTargets: [1]
                    },
                    { sTitle:"寶貝ID",
                      mData: "url",
                      mRender: function ( data, type, full ) {
                        var item_id = data.match(/=(\d+)/);
                        item_id = Util.isArray(item_id)? item_id[1] : '';
                        return item_id;
                      },
                      aTargets: [2]
                    },
                    { sTitle: "寶貝頁<br/>瀏覽量",
                      mData: "pv", aTargets:[3]
                    },
                    { sTitle: "寶貝頁<br/>瀏覽量日均值<i class=\"autotip icon-question-sign\"></i>"+
                              "<!-- <div class=\"tips\">所选时间段内浏览量的日均值。</div> -->",
                      mData: "avg_pv", aTargets:[4]
                    },
                    { sTitle:"寶貝頁<br/>訪客數日均值<i class=\"autotip icon-question-sign\"></i>"+
                             "<!-- <div class=\"tips\">所选时间段内访客数的日均值。</div> -->",
                      mData: "avg_uv", aTargets: [5]
                    },
                    { sTitle:"寶貝頁<br/>平均停留時間<i class=\"autotip icon-question-sign pop-bottom-center\"></i>"+
                             "<!-- <div class=\"tips\">宝贝的停留时间为用户在一次访问内访问店铺宝贝页的时长，平均停留时间即所有用户每次访问时停留时间的平均值。</div> -->",
                      mData: "avg_acc_time",
                      mRender: function ( data, type, full ) {
                          var hour = Math.floor(data / 3600),
                              min = Math.floor((data-hour*3600) / 60),
                              sec = data-hour*3600-min*60,
                              val = (hour===0 && min===0 && sec===0) ? '-':
                                        (hour>0?hour+"時":"")+
                                        (min>=0?min+"分":"")+
                                        (sec>=0?sec+"秒":"");
                          return val;
                    },
                      aTargets: [6]
                    },
                    { sTitle:"跳失率<i class=\"autotip icon-question-sign pop-bottom-left\"></i>"+
                             "<!-- <div class=\"tips\">只访问了该宝贝1个页面就离开的访问次数占该宝贝总访问次数的百分比。该指标不显示今日数据，只能提供昨天及以前的数据。最近7天、最近30天等数据则是计算前6天或前29天数据。</div> -->",
                      mData: "bounce",
                      mRender: function ( data, type, full ) {
                        return (data<0)?'-':Util.numberFormat(data*100)+'%';
                      },
                      aTargets: [7]
                    }
                ]
            };
        }
    },
    //流量分析 - 分類頁被訪排行
    table_catflow   : {
        draw_type: "table",
        custom_options : {
            aaSorting: [[1,'desc']],
            aoColumnDefs: [
                { sClass:"table-td-centered", aTargets:["_all"] },
                { bSortable: false, aTargets: [0] },
                { sTitle:"分類頁名稱<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div>点击相关分类名称，可链接到店铺具体分类页面。</div> -->",
                  mData: "category",
                  mRender: function ( data, type, full ) {
                      return '<a href="'+full.url+'" target="_blank">'+full.category+'</a>';
                  },
                  aTargets:[0]
                },
                { sTitle:"瀏覽量<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div>浏览量指分类目录被查看的次数。</div> -->",
                  mData: "pv", aTargets: [1] },
                { sTitle:"瀏覽量日均值<i class=\"autotip icon-question-sign pop-bottom-center\"></i>"+
                         "<!-- <div>所选时间段内浏览量的日均值。</div> -->",
                  mData: "avg_pv", aTargets: [2] },
                { sTitle:"訪客數日均值<i class=\"autotip icon-question-sign pop-bottom-left\"></i>"+
                         "<!-- <div>所选时间段内访客数的日均值。</div> -->",
                  mData: "avg_uv", aTargets: [3] }
            ]
        }
    },
    //流量分析 - 首頁被訪數據 - 首頁概況 - 首頁數據匯總
    table_hometotal_overview: {
        draw_type: "custom_table",
        data_proc: Chart.to_hometotal_overview_data,
        selector_mapping: Chart.to_hometotal_overview_mapping
    },
    //流量分析 - 首頁被訪數據 - 首頁概況 - 首頁詳細數據
    table_hometotal_detailreport : {
        draw_type: "table",
        custom_options : {
            bSort : false,
            aoColumnDefs: [
                { sClass:"table-td-centered", aTargets:["_all"]},
                { sTitle:"日期", mData: "day", aTargets:[0] },
                { sTitle:"瀏覽量", mData: "pv_times", aTargets:[1] },
                { sTitle:"訪客數<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">店铺首页的访问人数。注意，多日访客数是所选时间段内每天访客数之和，即没有经过去重计算。</div> -->",
                  mData: "uv_times", aTargets:[2] },
                { sTitle:"首頁平均停留時間<i class=\"autotip icon-question-sign\"></i>"+
                         "<!-- <div class=\"tips\">首页的停留时间为用户在一次访问内访问店铺首页的时长，平均停留时间即所有用户每次访问时停留时间的平均值。</div> -->",
                  mData: "avg_time",
                  mRender: function ( data, type, full ) {
                      return full.avg_time+'秒';
                  },
                  aTargets:[3]
                },
                { sTitle:"鏈接點擊率<i class=\"autotip icon-question-sign pop-bottom-center\"></i>"+
                         "<!-- <div class=\"tips\">首页展现后，页面中链接被点击的比率，即链接点击率=首页中链接的总点击量/首页浏览量。</div> -->",
                  mData: "click_rate",
                  mRender: function ( data, type, full ) {
                      return Util.numberFormat(full.click_rate*100, 2)+'%';
                  },
                  aTargets:[4]
                },
                { sTitle:"跳失率<i class=\"autotip icon-question-sign pop-bottom-left\"></i>"+
                         "<!-- <div class=\"tips\">访客从店铺首页进入店铺，但只访问了首页这一个页面就离开的访问次数占首页入店总访问次数的比例。</div> -->",
                  mData: "bounce",
                  mRender: function ( data, type, full ) {
                      return Util.numberFormat(full.bounce*100, 2)+'%';
                  },
                  aTargets:[5]
                }
            ]
        }
    },
    //流量分析 - 首頁被訪數據 - 首頁到寶貝頁 - 首頁到寶貝頁點擊率報表
    table_home2item_report: {
        draw_type: "table",
        custom_options : {
            bAutoWidth :false,
            aaSorting: [[3,'desc']],
            aoColumnDefs: [
                { sClass:"table-td-centered", aTargets:["_all"] },
                { bSortable: false, aTargets: [0,1] },
                { sWidth: "50%", aTargets: [1] },
                { sTitle: "序號", mData: "order", aTargets: [0] },
                { sTitle:"寶貝頁",
                  mData: "name",
                  mRender: function ( data, type, full ) {
                      return '<a href="'+full.url+'" target="_blank">'+full.name+'</a>';
                  },
                  aTargets: [1]
                },
                { sTitle:"首頁到寶貝頁點擊量<i class=\"autotip icon-question-sign pop-bottom-center\"></i>"+
                         "<!-- <div class=\"tips\">访客在店铺首页上点击该宝贝的次数。</div> -->",
                  mData: "click", aTargets: [2] },
                { sTitle:"首頁到寶貝頁點擊率<i class=\"autotip icon-question-sign pop-bottom-left\"></i>"+
                         "<!-- <div class=\"tips\">该宝贝在首页上展示后被点击的比例，即首页到宝贝页点击率=首页到宝贝页的点击量/首页的浏览量，该指标和首页点击热图中的指标不一致。</div> -->",
                  mData: "click_rate",
                  mRender: function ( data, type, full ) {
                      return Util.numberFormat(full.click_rate*100, 2)+'%';
                  },
                  aTargets: [3]
                }
            ]
        }
    },
    //流量分析 - 首頁被訪數據 - 首頁到分類頁 - 首頁到分類頁點擊率報表
    table_home2category_report: {
        draw_type: "table",
        custom_options : {
            bAutoWidth :false,
            aaSorting: [[3,'desc']],
            aoColumnDefs:[
               { sClass:"table-td-centered", aTargets:["_all"] },
               { bSortable: false, aTargets: [0,1] },
               { sWidth: "50%", aTargets: [1] },
               { sTitle: "序號", mData: "order", aTargets: [0] },
               { sTitle:"分類頁",
                 mData: "name",
                 mRender: function ( data, type, full ) {
                     return '<a href="'+full.url+'" target="_blank">'+full.name+'</a>';
                 },
                 aTargets: [1]
               },
               { sTitle:"首頁到分類頁點擊量<i class=\"autotip icon-question-sign pop-bottom-center\"></i>"+
                        "<!-- <div class=\"tips\">访客在店铺首页上点击该分类的次数。</div> -->",
                 mData: "click",  aTargets: [2] },
               { sTitle:"首頁到分類頁點擊率<i class=\"autotip icon-question-sign pop-bottom-left\"></i>"+
                        "<!-- <div class=\"tips\">该分类在首页上展示后被点击的比例，即首页到分类页点击率=首页到分类页的点击量/首页的浏览量，该指标和首页点击热图中的指标不一致。</div> -->",
                 mData: "click_rate",
                 mRender: function ( data, type, full ) {
                     return Util.numberFormat(full.click_rate*100, 2)+'%';
                 },
                 aTargets: [3]
               }
            ]
        }
    },
    //品台灣店舖分析 - 店舖概況 總商品數
    table_shop_overview_product_total: {
        draw_type: 'custom_table',
        selector_mapping : Chart.to_shop_overview_product_total_mapping
    },
    //品台灣店舖分析 - 店舖概況 排名
    table_shop_overview_rank : {
        draw_type: 'custom_table',
        data_proc: Chart.to_shop_overview_rank_data,
        selector_mapping : Chart.to_shop_overview_rank_mapping
    },
    //品台灣店舖分析 - 店舖核心數據_單日
    table_shop_coredata_day : {
        draw_type: 'custom_table',
        data_proc: Chart.to_shop_coredata_day_data,
        selector_mapping: Chart.to_shop_coredata_day_mapping
    },
    //品台灣店舖分析 - 訪客數TOP10流量來源
    table_shop_sourceranking_report : {
        draw_type: "table",
        custom_options : {
            fnHeaderCallback : function( nHead, aData, iStart, iEnd, aiDisplay ) {
                $(nHead).find('th').each(function(index, element){
                    $(element).css('padding','0');
                });
            },
            fnRowCallback : function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $(nRow).find('.tip-progress').tooltip({ placement: (iDisplayIndex===0?'bottom': 'right')});
            },
            bPaginate: false,
            sDom: '<"">t<"">',
            aaSorting: [[1,'desc']],
            aoColumnDefs: [
                { sClass:"table-td-righted", aTargets:[0] },
                { bSortable: false, aTargets: ["_all"] },
                 { sWidth: "130px", aTargets: [0] },
                { //sTitle:"來源名稱",
                  mData: "item",
                  aTargets: [0]
                },
                // { sTitle: "訪客數",
                //   mData: "count", aTargets:[1]
                // }
                { //sTitle: "訪客數",
                  mData: "percentage", aTargets:[1],
                  mRender: function ( data, type, full ) {
                    var percentage = Util.numberFormat((data*100===0)?1:data*100);
                    return '<div class="progress">'+
                                '<div style="width:'+ percentage+'%;" class="bar progress-bar tip-progress" '+
                                    'data-original-title="'+ full.item + ', 本店：'+ full.count +'"></div>'+
                           '</div>';
                  }
                }
            ]
        }
    },
    //品台灣店舖分析 - 單日銷售排行TOP10, 銷售量
    //品台灣商品分析 - 品台灣銷售排行TOP50, 銷售量
    table_item_bestsellers_report : {
        draw_type: "table",
        custom_options : function (option){
            return {
                bPaginate: false,
                sDom: '<"">t<"">',
                sScrollY: "400px",
                bScrollCollapse: true,
                fnDrawCallback: function ( oSettings ) {
                    var that = this;
                    /* Need to redo the counters if filtered or sorted */
                    if ( oSettings.bSorted || oSettings.bFiltered )
                    {
                        this.$('td:first-child', {"filter":"applied"}).each( function (i) {
                            that.fnUpdate( i+1, this.parentNode, 0, false, false );
                        } );
                    }
                },
                aoColumnDefs: [
                    { sClass: "table-td-centered", aTargets:["_all"] },
                    { bSortable: false, aTargets: ["_all"] },
                    { sWidth: "50px", aTargets: [0] },
                    { sWidth: "80px", aTargets: [2] },
                    { sTitle: "名次", aTargets:[0], sDefaultContent: ""},
                    { sTitle: "寶貝名稱",
                      mData: "description",
                      mRender: function ( data, type, full ) {
                        //return '<a href="'+full.url+'" target="_blank">'+full.description+'</a>';
                        var period = full.date.split('~');
                        return '<a href="./taiwanProductDetail?id='+full.itemid+'&from='+period[0]+'&to='+period[1]+'" target="_blank">'+full.description+'</a>';
                      },
                      sDefaultContent: "",
                      aTargets: [1]
                    },
                    { sTitle: (option.title.indexOf('人氣')>0?"拍下量":"銷售量"),
                      mData: "count", aTargets:[2]
                    }
                ]
            };
        }
    },
    //品台灣商品分析 - 寶貝詳情
    table_item_detail_overview : {
        draw_type: "custom_table",
        data_proc: Chart.to_item_detail_overview_data,
        selector_mapping: Chart.to_item_detail_overview_mapping
    },
    //品台灣商品分析 - 寶貝詳情 - 寶貝趨勢圖-表
    table_item_detail_report : {
        draw_type: "table",
        custom_options : {
            iDisplayLength:31,
            bSort : false,
            aoColumnDefs: [
                { sClass: "table-td-centered", aTargets:["_all"]},
                { sWidth: "100px", aTargets: [0] },
                { sTitle: "日期", mData: "day", aTargets:[0] },
                { sTitle: "寶貝頁瀏覽量", mData: "ipv", aTargets:[1] },
                { sTitle: "寶貝頁訪客數", mData: "iuv", aTargets:[2] },
                { sTitle: "拍下件數", mData: "gmv_auction_num", aTargets:[3] },
                { sTitle: "拍下金額", mData: "gmv_trade_amt", aTargets:[4] },
                { sTitle: "支付寶成交件數", mData: "alipay_auction_num", aTargets:[5] },
                { sTitle: "支付寶成交金額", mData: "alipay_trade_amt", aTargets:[6] },
                { sTitle: "寶貝頁收藏量", mData: "coll", aTargets:[7] }
            ]
        }
    },
    //品台灣商品分析 - 寶貝詳情 - 商品評價
    table_item_comment_report : {
        draw_type: "table",
        "no_data_msg" : "查無評價資料",
        custom_options: {
            sDom: '<"">t',
            bSort: false,
            fnRowCallback : function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $(nRow).find('a[data-id]').each(function(){
                    var e = $(this);
                    e.click(function(){
                        //alert($(this).attr('data-id'));
                        getSellerCommentsApi('item_'+$(this).attr('data-id'),'resetCommentsTable' , true);
                    });
                });

            },
            aoColumnDefs: [
                { sClass: "table-td-centered", aTargets:["_all"]},
                { sWidth: "80px", aTargets: [1, 2, 3] },
                { sTitle: "日期", mData: "date", aTargets:[0] },
                { sTitle: "品牌", mData: "brand", aTargets:[1] },
                { sTitle: "產地", mData: "place", aTargets:[2] },
                { sTitle: "居住地", mData: "seller_location", aTargets:[3] },
                { sTitle: "售價", mData: "price", aTargets:[4] },
                { sTitle: "500g單價", mData: "unitPrice", aTargets:[5] },
                { sTitle: "上海運費", mData: "shanghai_express", aTargets:[6] },
                { sTitle: "總價格", mData: "total_price", aTargets:[7] },
                { sTitle: "評論數", mData: "comment_count", aTargets:[8], sDefaultContent: "" },
                { sTitle: "詳細評倫",
                  mData: "comment_detail",
                  mRender: function ( data, type, full ) {
                    return '<a data-id="'+ full.id +'" style="cursor:pointer;">觀看</a>';
                  },
                  aTargets:[9],
                  sDefaultContent: ""}
            ]
        }
    },
    //品台灣商品分析 - 寶貝詳情 - 商品庫存
    table_item_inventory_report : {
        draw_type: "table",
        "no_data_msg" : "查無庫存資料",
        custom_options: {
            sDom: '<"">t',
            bSort: false,
            fnDrawCallback: function ( oSettings ) {
                var that = this;
                /* Need to redo the counters if filtered or sorted */
                if ( oSettings.bSorted || oSettings.bFiltered )
                {
                    this.$('td:first-child', {"filter":"applied"}).each( function (i) {
                        that.fnUpdate( i+1, this.parentNode, 0, false, false );
                    } );
                }
            },
            aoColumnDefs: [
                { sClass: "table-td-centered", aTargets:["_all"]},
                { sWidth: "100px", aTargets:[3,4,5]},
                //{ sTitle: "商品編號", mData: "item_code", aTargets:[0] },
                { sTitle: "序號", aTargets:[0],  sDefaultContent: ""},
                { sTitle: "板號", mData: "loc_sn", aTargets:[1] },
                { sTitle: "儲位", mData: "loc_no", aTargets:[2] },
                { sTitle: "可用量", mData: "qty", aTargets:[3] },
                { sTitle: "庫存量",  mData: "inv_qty", aTargets:[4] },
                { sTitle: "有效日期", mData: "efc_date", aTargets:[5], sDefaultContent: "" },
                { sTitle: "燈號", mData: "efc_date", aTargets:[6], sDefaultContent:"",
                  sType:  "string", bSearchable:false ,
                    mRender: function ( data, type, full ) {
                        var pattern = /(\d{4})(\d{2})(\d{2})/;
                        if (Util.hasStrValue(data) && data.match(pattern)){
                            var dt = new Date(data.replace(pattern,'$1-$2-$3 00:00:00'));
                            if (dt.valueOf() < Picker.curtDate.valueOf()){
                                return "已過期";
                            }
                            else if ( dt.valueOf() >= Picker.curtDate.valueOf() &&
                                      dt.valueOf() <= Picker.after30Date.valueOf())
                            {   //有效日30天內，紅燈
                                return "<span class=\"light red\"></span>";
                            }else if (dt.valueOf() > Picker.after30Date.valueOf() &&
                                      dt.valueOf() <= Picker.after60Date.valueOf()){
                                //有效日31~60天，黃燈
                                return "<span class=\"light yellow\"></span>";
                            }else if (dt.valueOf() > Picker.after60Date.valueOf()){
                                //有效日61天，綠燈
                                return "<span class=\"light green\"></span>";
                            }
                        }
                    }
                }
            ]
        }
    },
    //品台灣店舖分析 - 店舖核心數據-前30天
    //品台灣商品分析 - 支付寶成交金額趨勢
    //品台灣商品分析 - 寶貝詳情 - 寶貝趨勢圖
    stock_by_day_plain : {
        draw_type: "stock",
        draw_subtype: "day_plain",
        height: 200
    },
    //銷售分析 - 銷售總覽
    //流量分析 - 按天流量分析
    //流量分析 - 首頁被訪數據 - 首頁到寶貝頁 - 首頁到寶貝頁趨勢
    //流量分析 - 首頁被訪數據 - 首頁到分類頁 - 首頁到分類頁趨勢
    stock_by_day : {
        draw_type: "stock",
        custom_options : {
            rangeSelector : {
                buttons: Chart.gen_stock_buttons('week'),
                selected : 1
            },
            xAxis: {
                tickInterval: 24 * 3600 * 1000
            }
        }
    },
    //流量分析 - 按小時流量分析
    stock_by_hour: {
        draw_type: "stock",
        custom_options : {
            rangeSelector : {
                buttons: Chart.gen_stock_buttons('day'),
                selected : 1
            },
            xAxis: {
                tickInterval: 3600 * 1000
            }
        }
    },
    //銷售分析 - 寶貝銷售排行 - 寶貝銷售排行TOP15
    //銷售分析 - 買家購買分析 - 買家購買排行TOP15
    //銷售分析 - 促銷手段分析
    //流量分析 - 寶貝被訪排行 - 寶貝被訪排行TOP15
    column_ranking : {
        draw_type: "column",
        height: 600,
        custom_options : function(procd_data){
            return {
                legend:{
                    //layout:'vertical',
                    //align:'left',
                    enabled:true,
                },
                xAxis: {
                    categories: Util.genArray("", procd_data.length),
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    headerFormat:
                        '<table>',
                    pointFormat:
                        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        grouping: false,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: procd_data
            };
        }
    },
    //流量分析 - 訪客組成 - 入店來源
    //流量分析 - 訪客組成 - 回訪
    pie_basic : {
        draw_type: "pie",
        height: 450,
        custom_options: function(param_obj){
            return {
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '佔整體',
                    data: param_obj['procd_data']
                }]
            };
        }
    },
    //流量分析 - 訪客組成 - 訪問時段
    pie_donut : {
        draw_type: "pie",
        height: 550,
        custom_options: function(option, procd_data){
            return {
                plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                },
                series: [{
                    name: (Util.hasArrayObj(option.subtitle) && option.subtitle.length>0) ?
                            option.subtitle[0] :
                            '佔整體',
                    data: procd_data.categories,
                    size: '60%',
                    dataLabels: {
                        formatter: function() {
                            return this.y > 5 ? this.point.name : null;
                        },
                        color: 'white',
                        distance: -30
                    }
                }, {
                    name: (Util.hasArrayObj(option.subtitle) && option.subtitle.length>1) ?
                            option.subtitle[1] :
                            '佔',
                    data: procd_data.drilldown,
                    size: '80%',
                    innerSize: '60%',
                    dataLabels: {
                        formatter: function() {
                            // display only if larger than 1
                            return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y +'%'  : null;
                        }
                    }
                }]
            };
        }
    },
    //流量分析 - 訪客組成 - 地域
    pie_drilldown   : {
        draw_type: "pie",
        height: 600,
        custom_options: function(procd_data){
            return {
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.y:.2f}%'
                        }
                    }
                },
                series: [{
                    name: '地域',
                    colorByPoint: true,
                    data: procd_data.categories
                }],
                drilldown: {
                    series: procd_data.drilldown
                }
            };
        }
    }
};

Chart.timezone_init = function(){
    Highcharts.setOptions({
        global: {
            timezoneOffset: -8 * 60
        }
    });
};

Chart.init = false;
Chart.proc_init = function(){
    if (!this.init){
        this.color_init.gen_colors();
        this.timezone_init();
        this.init = true;
    }
};

Chart.color_init = {
    colors : [],
    color_limit : 30,
    brightness_gap : 0.2,
    gen_colors : function(){
        var gap_count,
            color_init_length;

        this.colors = Highcharts.getOptions().colors;
        color_init_length = this.colors.length;

        if (this.colors.length>0){
            for (var i = color_init_length; i < this.color_limit; i += 1){
                var color_index = i%color_init_length;
                gap_count = Math.floor(i/this.colors.length);
                this.colors.push(Highcharts.Color(this.colors[color_index]).brighten(this.brightness_gap*gap_count).get());
            }
        }
    }
};

Chart.get_custom_options = function (chart_type){
    var custom_options = {};
    if (this.type_info.hasOwnProperty(chart_type)){
        if (this.type_info[chart_type].hasOwnProperty('custom_options')){
            if (Util.isFunction(this.type_info[chart_type]['custom_options'])){
                Util.extendObj(
                    custom_options,
                    this.type_info[chart_type]['custom_options'].apply(
                        null,
                        Array.prototype.slice.call(arguments,1)
                    )
                );
            }else{
                Util.extendObj(custom_options,this.type_info[chart_type]['custom_options']);
            }
        }
        if (this.type_info[chart_type].hasOwnProperty('ajax_options')){
            Util.extendObj(custom_options,this.type_info[chart_type]['ajax_options']);
        }
    }
    return custom_options;
};

/// return plotOptions, tooltip & series
Chart.gen_options = function(chart_type,procd_data, option){
    var return_options,
        custom_options,
        custom_func,
        default_pie_options = {
                credits: {
                    enabled: false
                },
                exporting : {
                    enabled: false
                },
                chart: {
                    type:this.type_info[chart_type]['draw_type'],
                    height: this.type_info[chart_type]['height'],
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                legend:{
                    enabled:false
                },
                title: {
                    text: option.title
                }
        },
        default_column_options = {
                credits: {
                    enabled: false
                },
                colors: [
                    "#40cf5f", "#40d6de", "#4058cf", "#7e40cf", "#cf409f",
                    "#cf5840", "#f7312a", "#f77731", "#f7d631", "#cfcf40",
                    "#b88858", "#679e8d", "#40b7cf", "#2af7c7", "#72f72a"
                ],
                chart: {
                    height: this.type_info[chart_type]['height'],
                    type: this.type_info[chart_type]['draw_type']
                },
                title: {
                    text: option.title
                },
                subtitle: {
                    text: ''
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: Util.hasStrValue(option.subtitle)?
                              option.subtitle:''
                    }
                }
        },
        default_table_options = {
                bJQueryUI: true,
                bDestroy:true,
                //bProcessing: true,
                bInfo:false,
                iDisplayLength:25,
                sDom: '<"">t<"F"p>',
                sPaginationType: "full_numbers",
                fnHeaderCallback: function( nHead, aData, iStart, iEnd, aiDisplay ) {
                    tip_init(nHead);
                }
        },
        default_stock_options = {
                credits: {
                    enabled: false
                },
                colors: [
                    '#058DC7',
                    '#50B432',
                    '#ED561B',
                    '#DDDF00',
                    '#24CBE5',
                    '#64E572',
                    '#FF9655',
                    '#FFF263',
                    '#6AF9C4'
                ],
                exporting : {
                    enabled: false
                },
                legend:{
                    enabled:true
                },
                title : {
                    text : option.title
                },
                yAxis: {
                    min: 0
                },
                chart: {
                    height: this.type_info[chart_type]['height'],
                }
                /*series : [{
                    name : response.subtitle,
                    data : response.data
                }]*/
                // series: response.series
        };
    if (this.type_info.hasOwnProperty(chart_type)){
        if (this.type_info[chart_type]['draw_type']==="stock"){
            //if (chart_type==="stock_by_hour")
            //if (chart_type==="stock_by_day")
            custom_options = this.get_custom_options(chart_type);
            if (procd_data !== null){
                custom_options['series'] = procd_data;
            }
        } else if (this.type_info[chart_type]['draw_type']==="table"){
            //if (chart_type==="table_item_detail_report")
            //if (chart_type==="table_shop_sourceranking_report")
            //if (chart_type==="table_item_bestsellers_report")
            //if (chart_type==="table_itemflow_report")
            //if (chart_type==="table_sellreportdata_report")
            //if (chart_type==="table_sellreportbuyer_report")
            //if (chart_type==="table_home2category_report")
            //if (chart_type==="table_home2item_report")
            //if (chart_type==="table_hometotal_detailreport")
            //if (chart_type==="table_catflow")
            custom_options = this.get_custom_options(chart_type, option);
            if (procd_data !== null){
                custom_options['aaData'] = procd_data;
            }
        } else if (this.type_info[chart_type]['draw_type']==="custom_table"){
            //if (chart_type==="table_sellreportbuyer_overview")
            //if (chart_type==="table_hometotal_overview")
            if (chart_type==="table_sellreportdata_overview" && option.keyword!==undefined){
                custom_func = function(target){
                    $($(target).find('tr:nth-child(1) > td:nth-child(5) > div')[0]).addClass('hide');
                    $(target).find('tr:nth-child(1) > td:nth-child(6)')[0].innerHTML = '';
                };
            }else if (chart_type==="table_shop_coredata_day" ||
                      chart_type==="table_shop_overview_rank"){
                custom_func = function(target){
                    $(target).find('.plan-container .plan-features li strong').each(function(){
                        var e = $(this),
                            li = e.parent('li');
                        if (Util.hasStrValue(e.html())){
                            e.siblings('div.signal').css('display','inline-block');
                            if (e.html().charAt(0)==="-"){
                                e.html(e.html().replace("-",""));
                                if (li.hasClass('up')){
                                    li.toggleClass('up');
                                }
                                li.addClass('down');
                            }else{
                                if (li.hasClass('down')){
                                    li.toggleClass('down');
                                }
                                li.addClass('up');
                            }
                        }else{
                            e.siblings('div.signal').css('display','none');
                        }
                    });
                };
            }
            custom_options = {
                mapping : procd_data,
                func: custom_func
            };
        } else if (this.type_info[chart_type]['draw_type']==="column"){
            //if (chart_type==="column_ranking"){
            custom_options = this.get_custom_options(chart_type, procd_data);
        } else if (this.type_info[chart_type]['draw_type']==="pie"){
            //if (chart_type==="pie_basic"){
            //if (chart_type==="pie_drilldown"){
            //if (chart_type==="pie_donut"){
            custom_options = this.get_custom_options(chart_type, option, procd_data);
        }
        /// merget custom_options to defualt_options
        if (this.type_info[chart_type]['draw_type']==="stock"){
            return_options = Util.extendObj(default_stock_options,custom_options);
            if (this.type_info[chart_type]['draw_subtype']==="day_plain"){
                custom_options = {
                    scrollbar : {
                        enabled: false
                    },
                    "navigator" : {
                        enabled : false
                    },
                    rangeSelector : {
                        enabled : false
                    },
                    xAxis: {
                        tickInterval: 24 * 3600 * 1000
                    }
                };
                return_options = Util.extendObj(return_options,custom_options);
            }
        }else if (this.type_info[chart_type]['draw_type']==="column"){
            return_options = Util.extendObj(default_column_options,custom_options);
        }else if (this.type_info[chart_type]['draw_type']==="pie"){
            return_options = Util.extendObj(default_pie_options,custom_options);
        }else if (this.type_info[chart_type]['draw_type']==="table"){
            return_options = Util.extendObj(default_table_options,custom_options);
        }else if (this.type_info[chart_type]['draw_type']==="custom_table"){
            return_options = custom_options;
        }
    }
    custom_options = null;
    return return_options;
};

/* Chart Exporting */
Chart.exporting_type = {
    png : "image/png",
    pdf : "application/pdf",
    csv : "data:application/csv;charset=utf-8,"
};

Chart.exporting_init = function (){
    $('[data-exporting]').click(function(){
        var array = $(this).data('chart'),
            chart,
            chart_id,
            type,
            csvContent = Chart.exporting_type.csv,
            activeButtom;

        if (Util.hasArrayObj(array)){
            chart_id = array[0];
            activeButtom = Util.getActiveTipBottom();

            if (Util.hasArrayObj(activeButtom) &&
                Util.hasArrayObj($(activeButtom[0]).data("chart")) &&
                jQuery.inArray($(activeButtom[0]).data("chart")[0],array)!==-1)
            {
                // Active tip-buttom's first registered chart_id in exporting pool
                chart_id = $(activeButtom[0]).data("chart")[0];
            }
            chart = $(chart_id).highcharts();
            type = $(this).attr('data-exporting');
            if (chart){
                switch(type){
                    case 'png':
                    case 'pdf':
                        chart.exportChart({
                            type: Chart.exporting_type[$(this).attr('data-exporting')]
                        });
                        break;
                    case 'csv':
                        csvContent += Chart.gen_csv_string();
                        csvContent = encodeURI(csvContent);
                        $(this)
                            .attr({
                            'download': "chart.csv",
                                'href': csvContent,
                                'target': '_blank'
                        });
                        // doesn't work for Firefox,don't know why
                        // var link = document.createElement("a");
                        // link.setAttribute("href",encodeURI(csvContent));
                        // link.setAttribute("download","my_data.csv");
                        // link.setAttribute("target","_blank");
                        // link.click();
                        break;
                    default:
                        break;
                }
            }
        }
    });
};

Chart.exporting_assign = function(chart_id){
    if (Util.hasElement(chart_id)) {
        $('[data-exporting]').each
        (function(){
            if ($(this).data('chart')===undefined){
                $(this).data('chart',[]);
            }
            if (jQuery.inArray(chart_id,$(this).data('chart'))===-1){
                $(this).data('chart').push(chart_id);
            }
        });
    }
};

Chart.gen_csv_string = function(){
    var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]],
        dataString,
        csvContent;
    data.forEach(function(infoArray, index){
       dataString = infoArray.join(",");
       csvContent += index < infoArray.length ? dataString+ "\n" : dataString;
    });
    return csvContent;
};