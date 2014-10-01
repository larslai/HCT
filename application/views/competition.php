<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
			<title>淘寶競品分析</title>

			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
			<meta name="apple-mobile-web-app-capable" content="yes">
			<link href="<?=base_url()?>assets/css/bootstrap.min.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/bootstrap-responsive.min.css" rel="stylesheet" >
			<link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
			<link href="<?=base_url()?>assets/css/font-awesome.min.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/ui-lightness/jquery-ui-1.10.0.custom.min.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/base-admin-3.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/base-admin-3-responsive.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/pages/dashboard.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/pages/plans.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/pages/pricing.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/custom.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/competition.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/jquery.datepick.css" rel="stylesheet" >

		<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
		<!--[if lt IE 9]>
		  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>
	<body>
		<?php $this->load->view('templates/navbar.html'); ?>
		<div class="lightbox-BG" id="lightbox_BG" style="display:none;"></div>
		<div class="loading-excel" id="loading_excel" style="display:none;">
			<h1>Loading...</h1>
			<div class="slider">
				<div class="line"></div>
			  <div class="break dot1"></div>
			  <div class="break dot2"></div>
			  <div class="break dot3"></div>
			</div>
		</div>

		<div class="warning" id="warning" <?php if(!isset($msg)){ echo 'style="display:none;"' ;}?> >
			<div class="warning-redline"></div>
			<div class="warning-display" id="warning_msg"><?php if(isset($msg)){ echo $msg;}?></div>
		</div>
		<form name="input_form" id="input_form" action="./doCompetition" method="post">
			<input type="hidden" name="cat_lv" id="cat_lv">
			<div class="middle-side">
				<div class="widget stacked">
					<div class="widget-header">
						<i class="icon-pencil"></i>
						<h3>搜尋資訊</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<div class="input-block">
							<em class="red">類別</em>
							<input type="text" id="cat_name" name="cat_name" readonly="readonly" />
							<div  class="category-list">
								<ul class="nav category">
									<li class="dropdown" id="accountmenu">
										<a class="dropdown-toggle category" data-toggle="dropdown" href="#"><b class="caret category"></b></a>
										<?php
											if(isset($categorys['first']) && $categorys['first'] != null){
										?>
											<ul class="dropdown-menu">
										<?php
												foreach($categorys['first'] AS $first_lv=>$first_value){
													if(isset($categorys['second'][$first_lv]) && $categorys['second'][$first_lv] != null){
										?>
														<li class="dropdown-submenu">
															<a tabindex="-1" href="javascript:void(0);"  onclick="recordCategory('<?php echo $first_lv;?>' ,'<?php echo $first_value;?>');"><?php echo $first_value;?></a>
															<ul class="dropdown-menu">
										<?php
															foreach ($categorys['second'][$first_lv] as $second_lv => $second_value) {
																if(isset($categorys['third'][$second_lv]) && $categorys['third'][$second_lv] != null){
										?>
																	<li class="dropdown-submenu">
																		<a tabindex="-1" href="javascript:void(0);" onclick="recordCategory('<?php echo $second_lv;?>' ,'<?php echo $second_value;?>');"><?php echo $second_value;?></a>
																		<ul class="dropdown-menu">
										<?php
																		foreach($categorys['third'][$second_lv] as $third_lv => $third_value){
										?>
																			<li><a href="javascript:void(0);" onclick="recordCategory('<?php echo $third_lv;?>' ,'<?php echo $third_value;?>');"><?php echo $third_value;?></a></li>
										<?php
																		}
										?>
																		</ul>
																	</li>
										<?php
																}else{
										?>
																	<li><a href="javascript:void(0);" onclick="recordCategory('<?php echo $second_lv;?>' ,'<?php echo $second_value;?>');"><?php echo $second_value;?></a></li>
										<?php
																}
															}
										?>
															</ul>
														</li>
										<?php
													}else{
										?>
														<li><a href="javascript:void(0);" onclick="recordCategory('<?php echo $first_lv;?>' ,'<?php echo $first_value;?>');"><?php echo $first_value;?></a></li>
										<?php
													}
												}
										?>
											</ul>
										<?php
											}
										?>

									</li>
								</ul>
							</div>
						</div>
						<div class="input-block disabled">
							<em class="red">日期</em>
							<input type="text" name="startDate" id="startDate" class="date-picker" readonly="readonly"  value="<?php echo $limit_date; ?>"/>
						</div>
						<div class="input-block">
							<em class="red">商品名關鍵字</em>
							<input type="text" name="product_keyword" id="product_keyword"/>
						</div>
						<div class="input-block">
							<em>品牌</em>
							<input type="text" name="brand" id="brand"/>
						</div>
						<!--
						<div class="input-block">
							<em>台灣售價</em>
							<input type="text" name="taiwan_price" id="taiwan_price"/>
						</div>
						<div class="input-block">
							<em>規格</em>
							<input type="text"  name="unit" id="unit"/>
						</div>
						-->
						<button type="button" class="btn btn-default pull-right category-btn" onclick="checkForm();">查詢</button>
					</div>
				</div>
			</div>
		</form>
		<?php $this->load->view('templates/footer.html'); ?>

		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/libs/jquery-1.9.1.min.js" type="text/javascript"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/libs/jquery-ui-1.10.0.custom.min.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/libs/bootstrap.min.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/plugins/flot/jquery.flot.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/plugins/flot/jquery.flot.pie.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/Application.js" type="text/javascript"></script>
		<!--<script type="text/javascript"  src="<?=base_url()?>assets/js/js/charts/area.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/js/charts/donut.js" type="text/javascript"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/respond.min.js"></script>-->
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/highchart/highcharts.js"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/plugin_js/highchart/highcharts-more.js"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/page_js/competition.js"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/page_js/common_api_function.js"></script>
		<script type="text/javascript" src="<?=base_url()?>assets/js/plugin_js/jquery.datepick.min.js"></script>


		<script  type="text/javascript">

			$(document).ready(function() {
				$('#competition_btn').addClass('active');
				$('#taobao_competition_btn').addClass('active');
			});
		</script>
	</body>
</html>
