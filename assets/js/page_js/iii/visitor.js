/* global Util, Chart, dataajax, Host */
var Visitor = {
    url : Host.url["18"]+"ajaxAction"
};

Visitor.stats_intervals = ["hour","day"];

Visitor.pass_ajax_check = function(spicker_id,epicker_id,target_id,stats_interval){
    if ($(spicker_id).datepicker()!==null &&
        $(epicker_id).datepicker()!==null &&
        Util.hasElement(target_id) &&
        (arguments.length===3 || (arguments.length===4 && jQuery.inArray(stats_interval,this.stats_intervals)!==-1)))
    {
        return true;
    }
    else
    {
        return false;
    }
};

Visitor.ajax_visitor_flow = function(spicker_id, epicker_id,target_id, stats_interval){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id,stats_interval))
    {
        var action = (stats_interval===  'day')? "Visitor_Flow_Daily":
                     (stats_interval=== 'hour')? "Visitor_Flow_Hourly":"";
        var actions = ["action="+action+"&ismobile=false&index=4&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&ismobile=false&index=5&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&ismobile=false&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&ismobile=false&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&index=2&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&index=3&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&ismobile=true&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action="+action+"&ismobile=true&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id)];

        var series = [];
        var count=0;
        for (var i=0;i<actions.length;i++){
            dataajax
            (
                this.url,
                actions[i],
                function(response, index) {
                    response.name = response.subtitle;
                    series[index] = response;
                    count++;
                    if (count===actions.length){
                        response = {title:response.title,series:series};
                        Chart.draw_chart(response,target_id,(stats_interval==="hour"?"stock_by_hour":"stock_by_day"));
                        Chart.exporting_assign(target_id);
                    }
                },
                i
            );
        }
    }
};

Visitor.ajax_visitor_timeslot = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_Timeslot&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response,target,charttype) {
                Chart.draw_chart(response, target_id, "pie_donut");
                Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_source = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_Source&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "pie_basic");
                Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_area = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_Area&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "pie_drilldown");
                Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_return = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_Return&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "pie_basic");
                Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_item_ranking = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_Flow_ItemRanking&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response){//,column_mapping) {
                Chart.draw_chart(response, target_id, "column_ranking");//,column_mapping);
                Chart.exporting_assign(target_id);
            }
            //{name:"description", data:"count"}
        );
    }
};
///品台灣商品分析 - 商品流量趨勢圖 - 寶貝被訪排行榜TOP15
Visitor.ajax_itemflow = function(index,spicker_id,epicker_id,target_id, keyword){
    var ranking_column = ["avg_pv","avg_uv"];
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_ItemFlow"+
                    "&index="+index+
                    "&keyword="+keyword+
                    "&from="+Util.getDateString(spicker_id)+
                    "&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(
                    response,
                    target_id,
                    "column_ranking",
                    { name:"title", data:ranking_column[index], href:"url"} //column_mapping
                );
                Chart.exporting_assign(target_id);
            }
        );
    }
};
///品台灣商品分析 - 商品流量趨勢圖 - 寶貝數據匯總/寶貝被訪明細
Visitor.ajax_itemflow_report = function(index,spicker_id,epicker_id,target_id, keyword){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_ItemFlow_Report"+
                    "&index="+index+
                    "&keyword="+keyword+
                    "&from="+Util.getDateString(spicker_id)+
                    "&to="+Util.getDateString(epicker_id),
            function(response) {
                var charttype = (index===0||index===1)? "table_itemflow_report":
                                (index===2)? "table_itemflow_overview": "";
                Chart.draw_chart(response, target_id, charttype);
                Chart.exporting_assign(target_id);
            }
        );
    }
};


Visitor.ajax_visitor_categoryflow = function(index,spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_CategoryFlow"+
                    "&index="+index+
                    "&from="+Util.getDateString(spicker_id)+
                    "&to="+Util.getDateString(epicker_id),
            function(response,target,charttype) {
                Chart.draw_chart(response, target_id, "table_catflow");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_hometotal_trend = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        var actions = ["action=Visitor_HomeTotal_Trend&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Visitor_HomeTotal_Trend&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Visitor_HomeTotal_Trend&index=2&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Visitor_HomeTotal_Trend&index=3&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Visitor_HomeTotal_Trend&index=4&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id)];
        var series = [];
        var count=0;
        for (var i=0;i<actions.length;i++){
            dataajax
            (
                this.url,
                actions[i],
                function(response, index) {
                    response.name = response.subtitle;
                    series[index] = response;
                    if (index===3 || index===4){
                        series[index].tooltip = { valueSuffix: '%' };
                    }
                    count++;
                    if (count===actions.length){
                        response = {title:response.title,series:series};
                        Chart.draw_chart(response,target_id,"stock_by_day");
                        Chart.exporting_assign(target_id);
                    }
                },
                i
            );
        }
    }
};

Visitor.ajax_visitor_hometotal_report = function(index,spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_HomeTotal_Report"+
                    "&index="+index+
                    "&from="+Util.getDateString(spicker_id)+
                    "&to="+Util.getDateString(epicker_id),
            function(response, target) {
                var charttype = (index===0)? "table_hometotal_detailreport":
                                (index===6)? "table_hometotal_overview": "";
                Chart.draw_chart(response, target_id, charttype);
                //Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_home2item_trend = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        var actions = ["action=Visitor_HomeToItem_Trend&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Visitor_HomeToItem_Trend&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id)];
        var series = [];
        var count=0;
        for (var i=0;i<actions.length;i++){
            dataajax
            (
                this.url,
                actions[i],
                function(response, index) {
                    response.name = response.subtitle;
                    series[index] = response;
                    if (index===1){
                        series[index].tooltip = { valueSuffix: '%' };
                    }
                    count++;
                    if (count===actions.length){
                        response = {title:response.title,series:series};
                        Chart.draw_chart(response,target_id,"stock_by_day");
                        Chart.exporting_assign(target_id);
                    }
                },
                i
            );
        }
    }
};

Visitor.ajax_visitor_home2item_report = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_HomeToItem_Report"+
                    "&from="+Util.getDateString(spicker_id)+
                    "&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "table_home2item_report");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};

Visitor.ajax_visitor_home2category_trend = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        var actions = ["action=Visitor_HomeToCategory_Trend&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Visitor_HomeToCategory_Trend&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id)];
        var series = [];
        var count=0;
        for (var i=0;i<actions.length;i++){
            dataajax
            (
                this.url,
                actions[i],
                function(response,index) {
                    response.name = response.subtitle;
                    series[index] = response;
                    if (index===1){
                        series[index].tooltip = { valueSuffix: '%' };
                    }
                    count++;
                    if (count===actions.length){
                        response = {title:response.title,series:series};
                        Chart.draw_chart(response,target_id,"stock_by_day");
                        Chart.exporting_assign(target_id);
                    }
                },
                i
            );
        }
    }
};

Visitor.ajax_visitor_home2category_report = function(spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Visitor_HomeToCategory_Report"+
                    "&from="+Util.getDateString(spicker_id)+
                    "&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "table_home2category_report");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};

