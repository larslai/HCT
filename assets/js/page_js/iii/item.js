/* global Util, Chart, dataajax, Host */
var Item = {
    url : Host.url["18"]+"itemAjaxAction"
};

Item.pass_ajax_check = function(spicker_id,epicker_id,target_id){
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
///品台灣商品分析 - 商品銷售/人氣排行
Item.ajax_item_bestsellers_report = function(index, sdate, edate, target_id){
	if (Util.hasElement(target_id))
    {
        dataajax
        (
            this.url,
            "action=Item_Analysis_BestSellers_Report&index="+index+"&from="+sdate+"&to="+edate,
            function(response) {
                Chart.draw_chart(response, target_id, "table_item_bestsellers_report");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};
///品台灣商品分析 - 支付寶成交金額趨勢
Item.ajax_item_trade_amount_flow = function(spicker_id, epicker_id, target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        var actions = [
                       "action=Item_Analysis&index=0&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Analysis&ismobile=false&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Analysis&ismobile=true&index=1&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id)
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
                        response = { title:response.title, series:series};
                        Chart.draw_chart(response,target_id,"stock_by_day_plain");
                        Chart.exporting_assign(target_id);
                    }
                },
                i
            );
        }
    }
};
/// 品台灣商品分析 - 商品詳情 - 寶貝趨勢圖(圖)
Item.ajax_item_detail_flow = function(item_id, is_mobile, spicker_id, epicker_id, target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        var actions = [
                       "action=Item_Detail_Flow&index=0&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Detail_Flow&index=1&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Detail_Flow&index=2&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Detail_Flow&index=3&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Detail_Flow&index=4&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Detail_Flow&index=5&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id),
                       "action=Item_Detail_Flow&index=6&ismobile="+(is_mobile===1)+"&itemid="+item_id+"&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(epicker_id)
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
                        response = { title:response.title, series:series};
                        Chart.draw_chart(response,target_id,"stock_by_day_plain");
                        Chart.exporting_assign(target_id);
                    }
                },
                i
            );
        }
    }
};
/// 品台灣商品分析 - 商品詳情 - 寶貝詳情
Item.ajax_item_detail_overview = function(item_id, is_mobile, spicker_id, epicker_id, target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Item_Detail_Overview"+
                (is_mobile===null? "": "&ismobile="+(is_mobile===1))+
                "&itemid="+item_id+
                "&from="+Util.getDateString(spicker_id)+
                "&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "table_item_detail_overview");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};
/// 品台灣商品分析 - 商品詳情 - 寶貝趨勢圖(表)
Item.ajax_item_detail_report = function(item_id, is_mobile, spicker_id, epicker_id, target_id){
    if (this.pass_ajax_check(spicker_id,epicker_id,target_id))
    {
        dataajax
        (
            this.url,
            "action=Item_Detail_Report"+
                "&ismobile="+(is_mobile===1)+
                "&itemid="+item_id+
                "&from="+Util.getDateString(spicker_id)+
                "&to="+Util.getDateString(epicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "table_item_detail_report");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};
///品台灣商品分析 – 商品詳情 – 商品評價
Item.ajax_item_comment_report = function(item_id, epicker_id, target_id){
    if (Util.hasElement(target_id) &&
        $(epicker_id).datepicker()!==null)
    {
        //item_id="19148421471";
        dataajax(
            Host.url['srm']+"getOneDaySingleSellerListApi",
            "item_id=item_"+item_id+"&selected_date="+Util.getDateString(epicker_id).replace(/-/g,''),
            function(comment_res){
                var result = { title: "商品評價", data: [] };
                if (comment_res['result']===true){
                    result['data'][0] = (comment_res['item_info'])[item_id];
                    result['data'][0]['id'] = item_id;
                    result['post_func'] = function(target){
                        dataajax(
                            Host.url['srm']+"getSellerCommentsApi",
                            "item_id=item_"+item_id,
                            function(count_res){
                                var count = 0;
                                if (count_res['tag']===true){
                                    count = count_res['comments'].length;
                                }
                                $(target).find('tr:nth-child(1) > td:nth-child(9)')[0].innerHTML = count;
                            }
                        );
                    };
                }
                Chart.draw_chart(result, target_id, "table_item_comment_report");
            }
        );
    }
};
/// 品台灣商品分析 - 商品詳情 - 商品庫存
Item.ajax_item_inventory = function(item_id, target_id){
    if (Util.hasElement(target_id)){
        dataajax
        (
            this.url,
            "action=Item_Inventory"+
                "&itemid="+item_id,
            function(response) {
                //Chart.draw_chart(response, target_id, "table_item_inventory");
                Chart.draw_chart(response, target_id, "table_item_inventory_report");
            }
        );
    }
};