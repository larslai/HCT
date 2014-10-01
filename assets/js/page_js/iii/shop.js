/* global Util, Chart, dataajax, Host */
var Shop = {
    url : Host.url["18"]+"shopAjaxAction"
};

Shop.pass_ajax_check = function(spicker_id,target_id){
    if (Util.hasElement(spicker_id) &&
        Util.hasElement(target_id))
    {
        return true;
    }
    else
    {
        return false;
    }
};
///品台灣店舖分析 - 入店來源
Shop.ajax_shop_source_ranking = function(spicker_id, target_id){
    if (this.pass_ajax_check(spicker_id, target_id))
    {
        dataajax
        (
            this.url,
            "action=ShopStats_SourceRanking&from="+Util.getDateString(spicker_id)+"&to="+Util.getDateString(spicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "table_shop_sourceranking_report");
                //Chart.exporting_assign(target_id);
            }
        );
    }
};
///品台灣店舖分析 - 店舖核心數據(月)
Shop.ajax_shop_core_data_month = function(index, spicker_id, target_id){
    if (this.pass_ajax_check(spicker_id, target_id))
    {
        var from = Util.getDate(-29, new Date(Util.getDateString(spicker_id)));
        dataajax
        (
            this.url,
            "action=ShopStats_CoreData_Month&index="+index+"&from="+Util.getDateString(from)+"&to="+Util.getDateString(spicker_id),
            function(response) {
                response.name = response.title;
                response = {title:response.title,series:[response]};
                Chart.draw_chart(response, target_id, "stock_by_day_plain");
            }
        );
    }
};
///品台灣店舖分析 - 店舖核心數據(單日)
Shop.ajax_shop_core_data_day = function(spicker_id, target_id){
    if (this.pass_ajax_check(spicker_id, target_id))
    {
        var day = Util.getDateString(spicker_id);
        dataajax
        (
            this.url,
            "action=ShopStats_CoreData_Day&from="+day+"&to="+day,
            function(response) {
                Chart.draw_chart(response, target_id, "table_shop_coredata_day");
            }
        );
    }
};
///品台灣店舖分析 - 店舖排行
Shop.ajax_shop_overview_rank = function(spicker_id, target_id){
	if (this.pass_ajax_check(spicker_id, target_id))
    {
		dataajax
		(
			this.url,
			"action=Overview_Rank&from="+Util.getDateString(spicker_id),
			function(response) {
				Chart.draw_chart(response, target_id, "table_shop_overview_rank");
			}
		);
    }
};
///品台灣店舖分析 - 店舖排行 – 店舖總商品數
Shop.ajax_shop_overview_product_total = function(spicker_id, target_id){
    if (this.pass_ajax_check(spicker_id, target_id))
    {
        dataajax
        (
            this.url,
            "action=Overview_ProductTotalNumber&from="+Util.getDateString(spicker_id),
            function(response) {
                Chart.draw_chart(response, target_id, "table_shop_overview_product_total");
            }
        );
    }
};

