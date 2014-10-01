/* global Util, Chart, dataajax, Host */
var Product = {
    url : Host.url["18"]+"productAjaxAction"
};

Product.pass_ajax_check = function(spicker_id,epicker_id,target_id){
    if ($(spicker_id).datepicker()!==null &&
        $(epicker_id).datepicker()!==null &&
        Util.hasElement(target_id))
    {
        return true;
    }
    else
    {
        return false;
    }
};

Product.ajax_product_buyer = function(index,spicker_id,epicker_id,target_id){
    var ranking_column = ["count","count","amt"];

    if (this.pass_ajax_check(spicker_id,epicker_id,target_id)){
        dataajax
        (
            this.url,
            "action=Product_Buyer_ItemRanking&index="+index+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response,charttype,column_mapping) {
                Chart.draw_chart(response,target_id,charttype,column_mapping);
                Chart.exporting_assign(target_id);
            },
            "column_ranking",
            {name:"description", data:ranking_column[index]}
        );
    }
};


Product.ajax_product_buyer_table = function(index,spicker_id,epicker_id,target_id){

    if (this.pass_ajax_check(spicker_id,epicker_id,target_id)){
        dataajax
        (
            this.url,
            "action=Product_Buyer_Report&index="+index+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response){
                var charttype = (index===3)? "table_sellreportbuyer_report":
                                (index===4)? "table_sellreportbuyer_overview": "";
                Chart.draw_chart(response,target_id,charttype);
                //Chart.exporting_assign(target);
            }
        );
    }
};

Product.ajax_product_promotion = function(index,spicker_id,epicker_id,target_id){
    var ranking_column = ["count","count","count","count","amt","count","amt"];

    if (this.pass_ajax_check(spicker_id,epicker_id,target_id)){
        dataajax
        (
            this.url,
            "action=Product_Promotion_ItemRanking&index="+index+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
            function(response,charttype,column_mapping) {
                Chart.draw_chart(response,target_id,charttype,column_mapping);
                Chart.exporting_assign(target_id);
            },
            "column_ranking",
            {name:"description", data:ranking_column[index]}
        );
    }
};
/// 品台灣商品分析 – 商品銷售趨勢圖 –寶貝信息匯總/寶貝銷售明細
Product.ajax_product_sellreportdata_table = function (isMobile,index,spicker_id,epicker_id,target_id,keyword){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id)){
        dataajax
        (
            this.url,
            "action=Product_SellReportData_Report"+
                "&ismobile="+(isMobile===1)+
                "&index="+index+
                "&keyword="+keyword+
                "&from="+Util.getDateString(spicker_id)+
                "&to="+Util.getDateString(epicker_id),
            function(response){
                var charttype = (index===7)? "table_sellreportdata_report":
                                (index===8)? "table_sellreportdata_overview": "";
                response['keyword'] = keyword;
                Chart.draw_chart(response,target_id,charttype);
                //Chart.exporting_assign(target);
            }
        );
    }
};
/// 品台灣商品分析 - 商品銷售趨勢圖 - 寶貝銷售排行TOP15
Product.ajax_product_data_flow = function(isMobile,index,spicker_id,epicker_id,target_id,keyword){
    var ranking_column = ["count","count","count","count","count","amt","amt"];

    if (this.pass_ajax_check(spicker_id,epicker_id,target_id)){
        dataajax
        (
            this.url,
            "action=Product_Data_Flow_ItemRanking"+
                "&ismobile="+(isMobile===1)+
                "&index="+index+
                "&keyword="+keyword+
                "&from="+Util.getDateString(spicker_id)+
                "&to="+Util.getDateString(epicker_id),
            function(response, charttype,column_mapping) {
                Chart.draw_chart(response, target_id, charttype,column_mapping);
                Chart.exporting_assign(target_id);
            },
            "column_ranking",
            {name:"description", data:ranking_column[index], href:"url"}
        );
    }
};

Product.ajax_product_flow = function(isMobile,spicker_id,epicker_id,target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        var actions = [
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=2&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=3&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=4&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=5&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=6&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=7&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Product_Flow&ismobile="+(isMobile===1)+"&index=8&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       ];
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