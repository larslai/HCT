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
			<link href="<?=base_url()?>assets/css/taiwan_competition_result.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/seller_comment_lighbox.css" rel="stylesheet" >
			<link href="<?=base_url()?>assets/css/jquery.datepick.css" rel="stylesheet" >
			<link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">

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

		<div class="main">
			<div class="warning" id="warning" <?php if(!isset($msg)){ echo 'style="display:none;"' ;}?> >
				<div class="warning-redline"></div>
				<div class="warning-display" id="warning_msg"><?php if(isset($msg)){ echo $msg;}?></div>
			</div>
			<div class="left-side">
				<form name="input_form" id="input_form" action="./doTaiwanCompetition" method="post">
					<input type="hidden" name="cat_lv" id="cat_lv" value="<?php if(isset($record['cat_lv']) && $record['cat_lv'] != null){ echo $record['cat_lv'];} ?>" >
					<div class="widget stacked">
						<div class="widget-header">
							<i class="icon-pencil"></i>
							<h3>搜尋資訊</h3>
							<i class="icon-question-sign pointer" title="商品名稱過濾規則:去除特殊符號/空白/無相關文字/單位量詞"></i>
						</div> <!-- /widget-header -->
						<div class="widget-content">
							<div class="input-block">
								<em class="red">類別</em>
								<input type="text" id="cat_name" name="cat_name" readonly="readonly" value="<?php if(isset($record['cat_name']) && $record['cat_name'] != null){ echo $record['cat_name'];} ?>" />
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
								<em class="red">商品</em>
								<select class="taiwan-products" id="product_name" name="product_name">
								<?php
									foreach($taiwan_products AS $key=>$taiwan_product){
										if($record['product_key'] == $key){
								?>
											<option value="<?php echo $key;?>" selected="selected"><?php echo $taiwan_product;?></option>
								<?php
										}else{
								?>
											<option value="<?php echo $key;?>"><?php echo $taiwan_product;?></option>
								<?php
										}
								?>

								<?php
									}
								?>
								</select>
							</div>
							<div class="input-block disabled">
								<em>商品關鍵字</em>
								<div class="product-keyword-filter-block">
									<span><?php echo $record['filter_product_keyword'];?></span>
								</div>
							</div>
							<button type="button" class="btn btn-default pull-right category-btn" onclick="checkForm();">查詢</button>
						</div>
					</div>
				</form>

				<div class="widget stacked" id="pos_tags">
					<div class="widget-header">
						<i class="icon-thumbs-up"></i>
						<h3>好評率</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<table class="table table-striped table-bordered">
							<tbody>
								<tr>
									<td>評論數</td>
									<td><?php echo $pos_comments['find'];?></td>
								</tr>
								<tr>
									<td>總評數</td>
									<td><?php echo $pos_comments['total'];?></td>
								</tr>
							</tbody>
						</table>
						<hr>
						<div class="commend-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>評論內容</th>
										<th>評論數</th>
									</tr>
								</thead>
								<tbody>
									<?php
										if( isset($pos_comments['contents'])  && $pos_comments['contents'] != null){
											foreach($pos_comments['contents'] AS $num=>$value){
									?>
											<tr>
												<td><?php echo $value;?></td>
												<td><?php echo $num;?></td>
											</tr>
									<?php
											}
										}
									?>

								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="widget stacked"  id="pos_tags_taiwan">
					<div class="widget-header">
						<i class="icon-thumbs-up"></i>
						<h3>好評率</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<table class="table table-striped table-bordered">
							<tbody>
								<tr>
									<td>評論數</td>
									<td><?php echo $pos_comments_taiwan['find'];?></td>
								</tr>
								<tr>
									<td>總評數</td>
									<td><?php echo $pos_comments_taiwan['total'];?></td>
								</tr>
							</tbody>
						</table>
						<hr>
						<div class="commend-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>評論內容</th>
										<th>評論數</th>
									</tr>
								</thead>
								<tbody>
									<?php
										if(isset($pos_comments_taiwan['contents']) && $pos_comments_taiwan['contents'] != null){
											foreach($pos_comments_taiwan['contents'] AS $num=>$value){
									?>
											<tr>
												<td><?php echo $value;?></td>
												<td><?php echo $num;?></td>
											</tr>
									<?php
											}
										}
									?>

								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="widget stacked" id="nag_tags">
					<div class="widget-header">
						<i class="icon-thumbs-down"></i>
						<h3>壞評率</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<table class="table table-striped table-bordered">
							<tbody>
								<tr>
									<td>評論數</td>
									<td><?php echo $nag_comments['find'];?></td>
								</tr>
								<tr>
									<td>總評數</td>
									<td><?php echo $nag_comments['total'];?></td>
								</tr>
							</tbody>
						</table>
						<hr>
						<div class="commend-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>評論內容</th>
										<th>評論數</th>
									</tr>
								</thead>
								<tbody>
									<?php
										if(isset($nag_comments['contents']) && $nag_comments['contents'] != null){
											foreach($nag_comments['contents'] AS $num=>$value){
									?>
											<tr>
												<td><?php echo $value;?></td>
												<td><?php echo $num;?></td>
											</tr>
									<?php
											}
										}
									?>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="widget stacked" id="location_tradeNum">
					<div class="widget-header">
						<i class="icon-globe"></i>
						<h3>地區銷量</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<div class="commend-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>地區</th>
										<th>銷量</th>
									</tr>
								</thead>
								<tbody>
									<?php
										if(isset($tradeNum_by_location) && $tradeNum_by_location != null){
											foreach($tradeNum_by_location AS $location=>$tradeInfo){
									?>
											<tr>
												<td><?php echo $location;?></td>
												<td><?php echo $tradeInfo['tradeNum'].$tradeInfo['rate'];?></td>
											</tr>
									<?php
											}
										}
									?>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="widget stacked" id="nag_tags_taiwan">
					<div class="widget-header">
						<i class="icon-thumbs-down"></i>
						<h3>壞評率</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<table class="table table-striped table-bordered">
							<tbody>
								<tr>
									<td>評論數</td>
									<td><?php echo $nag_comments_taiwan['find'];?></td>
								</tr>
								<tr>
									<td>總評數</td>
									<td><?php echo $nag_comments_taiwan['total'];?></td>
								</tr>
							</tbody>
						</table>
						<hr>
						<div class="commend-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>評論內容</th>
										<th>評論數</th>
									</tr>
								</thead>
								<tbody>
									<?php
										if(isset($nag_comments_taiwan['contents']) && $nag_comments_taiwan['contents'] != null){
											foreach($nag_comments_taiwan['contents'] AS $num=>$value){
									?>
											<tr>
												<td><?php echo $value;?></td>
												<td><?php echo $num;?></td>
											</tr>
									<?php
											}
										}
									?>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="widget stacked" id="location_tradeNum_taiwan">
					<div class="widget-header">
						<i class="icon-globe"></i>
						<h3>地區銷量</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<div class="commend-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>地區</th>
										<th>銷量</th>
									</tr>
								</thead>
								<tbody>
									<?php
										if(isset($tradeNum_by_location_taiwan) && $tradeNum_by_location_taiwan != null){
											foreach($tradeNum_by_location_taiwan AS $location=>$tradeInfo){
									?>
											<tr>
												<td><?php echo $location;?></td>
												<td><?php echo $tradeInfo['tradeNum'].$tradeInfo['rate'];?></td>
											</tr>
									<?php
											}
										}
									?>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div class="right-side">
				<div class="indicator-area">
					<div class="widget stacked">
						<div class="widget-header">
							<i class="icon-exclamation-sign"></i>
							<h3>指標數據</h3>
							<i id="hide_indicator_info" class="icon-chevron-up" style="cursor: pointer;"></i>
							<i id="show_indicator_info" class="icon-chevron-down" style="cursor: pointer;"></i>
						</div>
						<div id="indicator_info" class="widget-content indicator" style="display:none;">
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												獨特性
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['special']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data['special']['selected']['brand'];?></td>
											<td><?php echo $arrange_data['special']['selected']['cat'];?></td>
											<td><?php echo $arrange_data['special']['selected']['product'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data['special']['all']['brand'];?></td>
											<td><?php echo $arrange_data['special']['all']['cat'];?></td>
											<td><?php echo $arrange_data['special']['all']['product'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												熱門性
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['famous']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data['famous']['selected']['brand'];?></td>
											<td><?php echo $arrange_data['famous']['selected']['cat'];?></td>
											<td><?php echo $arrange_data['famous']['selected']['product'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data['famous']['all']['brand'];?></td>
											<td><?php echo $arrange_data['famous']['all']['cat'];?></td>
											<td><?php echo $arrange_data['famous']['all']['product'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												熱賣性
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['hot']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data['hot']['selected']['brand'];?></td>
											<td><?php echo $arrange_data['hot']['selected']['cat'];?></td>
											<td><?php echo $arrange_data['hot']['selected']['product'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data['hot']['all']['brand'];?></td>
											<td><?php echo $arrange_data['hot']['all']['cat'];?></td>
											<td><?php echo $arrange_data['hot']['all']['product'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												評論
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['comments']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data['comments']['selected']['brand']['pos'];?></td>
											<td><?php echo $arrange_data['comments']['selected']['cat']['pos'];?></td>
											<td><?php echo $arrange_data['comments']['selected']['product']['pos'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data['comments']['all']['brand']['pos'];?></td>
											<td><?php echo $arrange_data['comments']['all']['cat']['pos'];?></td>
											<td><?php echo $arrange_data['comments']['all']['product']['pos'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block price">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												價格
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['price']['all']; ?>"></i>
											</th>
											<th>最低</th>
											<th>最高</th>
											<th>平均</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td>
												淘寶<?php echo $record['product_name'];?>相關前100名
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['price']['top']; ?>"></i>
											</td>
											<td><?php echo $top_product_info['min']?></td>
											<td><?php echo $top_product_info['max']?></td>
											<td><?php echo $top_product_info['avg']?></td>
										</tr>
										<tr>
											<td>
												<?php echo $record['cat_name'];?>/產地台灣相關前100名
												<i class="icon-question-sign pointer"  title="<?php echo $radar_data_function['price']['top_taiwan']; ?>"></i>
											</td>
											<td><?php echo $top_product_info_taiwan['min']?></td>
											<td><?php echo $top_product_info_taiwan['max']?></td>
											<td><?php echo $top_product_info_taiwan['avg']?></td>
										</tr>
										<tr>
											<td>
												<?php echo $record['product_name'];?>-淘寶前100名找出<?php echo $find_product_info['find'];?>件
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function['price']['find']; ?>"></i>
											</td>
											<td><?php echo $find_product_info['info']['min'];?></td>
											<td><?php echo $find_product_info['info']['max'];?></td>
											<td><?php echo $find_product_info['info']['avg'];?></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div id="indicator_info_taiwan" class="widget-content indicator" style="display:none;">
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												獨特性
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['special']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data_taiwan['special']['selected']['brand'];?></td>
											<td><?php echo $arrange_data_taiwan['special']['selected']['cat'];?></td>
											<td><?php echo $arrange_data_taiwan['special']['selected']['product'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data_taiwan['special']['all']['brand'];?></td>
											<td><?php echo $arrange_data_taiwan['special']['all']['cat'];?></td>
											<td><?php echo $arrange_data_taiwan['special']['all']['product'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												熱門性
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['famous']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data_taiwan['famous']['selected']['brand'];?></td>
											<td><?php echo $arrange_data_taiwan['famous']['selected']['cat'];?></td>
											<td><?php echo $arrange_data_taiwan['famous']['selected']['product'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data_taiwan['famous']['all']['brand'];?></td>
											<td><?php echo $arrange_data_taiwan['famous']['all']['cat'];?></td>
											<td><?php echo $arrange_data_taiwan['famous']['all']['product'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												熱賣性
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['hot']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data_taiwan['hot']['selected']['brand'];?></td>
											<td><?php echo $arrange_data_taiwan['hot']['selected']['cat'];?></td>
											<td><?php echo $arrange_data_taiwan['hot']['selected']['product'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data_taiwan['hot']['all']['brand'];?></td>
											<td><?php echo $arrange_data_taiwan['hot']['all']['cat'];?></td>
											<td><?php echo $arrange_data_taiwan['hot']['all']['product'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												評論
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['comments']; ?>"></i>
											</th>
											<th>品牌</th>
											<th>類別</th>
											<th>商品名</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td><?php echo $record['cat_name'];?>前100名</td>
											<td><?php echo $arrange_data_taiwan['comments']['selected']['brand']['pos'];?></td>
											<td><?php echo $arrange_data_taiwan['comments']['selected']['cat']['pos'];?></td>
											<td><?php echo $arrange_data_taiwan['comments']['selected']['product']['pos'];?></td>
										</tr>

										<tr>
											<td>美食特產前100名</td>
											<td><?php echo $arrange_data_taiwan['comments']['all']['brand']['pos'];?></td>
											<td><?php echo $arrange_data_taiwan['comments']['all']['cat']['pos'];?></td>
											<td><?php echo $arrange_data_taiwan['comments']['all']['product']['pos'];?></td>
										</tr>

									</tbody>
								</table>
							</div>
							<div class="indicator-block price">
								<table class="table table-striped table-bordered">
									<thead class="indicator-thead">
										<tr>
											<th>
												價格
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['price']['all']; ?>"></i>
											</th>
											<th>最低</th>
											<th>最高</th>
											<th>平均</th>
										</tr>
									</thead>
									<tbody  class="indicator-tbody">
										<tr>
											<td>
												淘寶<?php echo $record['product_name'];?>相關前100名
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['price']['top']; ?>"></i>
											</td>
											<td><?php echo $top_product_info['min']?></td>
											<td><?php echo $top_product_info['max']?></td>
											<td><?php echo $top_product_info['avg']?></td>
										</tr>
										<tr>
											<td>
												<?php echo $record['cat_name'];?>/產地台灣相關前100名
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['price']['top_taiwan']; ?>"></i>
											</td>
											<td><?php echo $top_product_info_taiwan['min']?></td>
											<td><?php echo $top_product_info_taiwan['max']?></td>
											<td><?php echo $top_product_info_taiwan['avg']?></td>
										</tr>
										<tr>
											<td>
												<?php echo $record['product_name'];?>-淘寶前100名找出<?php echo $find_product_info_taiwan['find'];?>件
												<i class="icon-question-sign pointer" title="<?php echo $radar_data_function_taiwan['price']['find']; ?>"></i>
											</td>
											<td><?php echo $find_product_info_taiwan['info']['min'];?></td>
											<td><?php echo $find_product_info_taiwan['info']['max'];?></td>
											<td><?php echo $find_product_info_taiwan['info']['avg'];?></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>

				<div class="widget stacked">
					<div class="widget-header">
						<i class="icon-globe"></i>
						<h3>雷達圖</h3>
					</div> <!-- /widget-header -->
					<div class="widget-content">
						<ul class="nav nav-tabs">
							<li class="active"><a href="#all_taobao" data-toggle="tab" onclick="showData('all');">全淘寶</a></li>
							<li class=""><a href="#in_taiwan" data-toggle="tab" onclick="showData('taiwan');">淘寶產地台灣</a></li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane fade active in" id="all_taobao">
								<table class="table table-bordered">
									<tbody>
										<tr>
											<td class="table-td-centered">大陸售價(RMB)</td>
											<td class="table-td-centered"><?php echo $avg_price;?></td>
											<td class="table-td-centered">每一規格售價</td>
											<td class="table-td-centered"><?php echo $avg_unitPrice;?></td>
											<td class="table-td-centered without-line">
												<i id="hide_price_detail" class="icon-chevron-up" style="cursor: pointer; display:none;" onclick="hide_price_detail('price_detail' ,'show_price_detail' , 'hide_price_detail' );"></i>
												<i id="show_price_detail" class="icon-chevron-down" style="cursor: pointer;" onclick="show_price_detail('price_detail' , 'hide_price_detail'  ,  'show_price_detail' );"></i>
											</td>

										</tr>
									</tbody>
								</table>
								<div class="price-detail" id="price_detail">
									<div class="widget stacked">
										<div class="widget-header">
											<h3>大陸售價(RMB)詳細資料</h3>
										</div> <!-- /widget-header -->
										<table class="table table-bordered price-detail">
											<thead>
												<tr>
													<th>價格範圍</th>
													<th>銷量</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($price_detail AS $price_range=>$price_data){
														$reset_price_range = str_replace('_', '~', $price_range);
														$class_name = $price_range;
												?>
														<tr>
															<td class="table-td-centered"><?php echo $reset_price_range;?>
																<?php
																	if($price_data['function'] != null){
																?>
																		<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $price_data['function'];?>"></i>
																<?php
																	}
																?>
																<a class="show-price-detail" href="#every_taobao_price_detail" onclick="showItemDetail('price-item-detail','<?php echo $class_name; ?>' , 'every_taobao_price_detail');">更多資訊</a>
															</td>
															<td class="table-td-centered"><?php echo $price_data['trade']['num'];?>
																<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $price_data['trade']['function'];?>"></i>
															</td>
														</tr>
												<?php
													}
												?>
											</tbody>
										</table>
										<table class="table table-bordered every-price-detail" id="every_taobao_price_detail">
											<thead>
												<tr>
													<th>價格</th>
													<th>商品</th>
													<th>銷量</th>
													<th class="close-price-detail" onclick="closePriceDetailBlock('every_taobao_price_detail');">X</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($price_detail AS $price_range=>$price_data){
														$class_name = $price_range;
														foreach($price_data['item_detail'] AS $price_block=>$items){
															$first = true;
															foreach($items AS $key=>$item){
												?>
																<tr class="price-item-detail <?php echo $class_name; ?>" id="price_item_<?php echo $price_block.'_'.$key;?>">
												<?php
																if($first == false){
												?>
																	<td></td>
												<?php
																}else{
												?>
																	<td><?php echo $price_block; ?></td>
												<?php
																	$first = false;
																}
																if($item['url'] == null){
												?>
																	<td><?php echo $item['item_name']; ?>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>' ,'price_item_<?php echo  $price_block.'_'.$key;?>' ,'comparison_spider_web');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}else{
												?>
																	<td>
																		<a target="_blank" href="<?php echo $item['url'];?>"><?php echo $item['item_name']; ?></a>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>','price_item_<?php echo  $price_block.'_'.$key;?>' ,'comparison_spider_web');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}
												?>
																<td  colspan="2"><?php echo $item['tradeNum']; ?></td>
															</tr>
												<?php
															}
														}
													}
												?>
											</tbody>
										</table>
									</div>
									<div class="widget stacked">
										<div class="widget-header">
											<h3>每一規格售價詳細資料</h3>
										</div> <!-- /widget-header -->
										<table class="table table-bordered price-detail">
											<thead>
												<tr>
													<th>價格範圍</th>
													<th>銷量</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($unitPrice_detail AS $unitPrice_range=>$unitPrice_data){
														$reset_unitPrice_range = str_replace('_', '~', $unitPrice_range);
														$class_name = $unitPrice_range;
												?>
														<tr>
															<td class="table-td-centered"><?php echo $reset_unitPrice_range;?>
																<?php
																	if($unitPrice_data['function'] != null){
																?>
																	<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $unitPrice_data['function'];?>"></i>
																<?php
																	}
																?>
																<a class="show-price-detail" href="#every_taobao_unitPrice_detail" onclick="showItemDetail('unitPrice-item-detail' ,'<?php echo $class_name; ?>' , 'every_taobao_unitPrice_detail');">更多資訊</a>
															</td>
															<td class="table-td-centered"><?php echo $unitPrice_data['trade']['num'];?>
																<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $unitPrice_data['trade']['function'];?>"></i>
															</td>
														</tr>
												<?php
													}
												?>
											</tbody>
										</table>
										<table class="table table-bordered every-price-detail" id="every_taobao_unitPrice_detail">
											<thead>
												<tr>
													<th>價格</th>
													<th>商品</th>
													<th>銷量</th>
													<th class="close-price-detail"  onclick="closePriceDetailBlock('every_taobao_unitPrice_detail');">X</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($unitPrice_detail AS $unitPrice_range=>$unitPrice_data){
														$class_name = $unitPrice_range;
														foreach($unitPrice_data['item_detail'] AS $unitPrice_block=>$items){
															$first = true;
															foreach($items AS $key=>$item){
												?>
																<tr class="unitPrice-item-detail <?php echo $class_name; ?>" id="unitPrice_item_<?php echo $unitPrice_block.'_'.$key;?>">
												<?php
																if($first == false){
												?>
																	<td></td>
												<?php
																}else{
												?>
																	<td><?php echo $unitPrice_block; ?></td>
												<?php
																	$first = false;
																}
																if($item['url'] == null){
												?>
																	<td><?php echo $item['item_name']; ?>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>' ,'unitPrice_item_<?php echo $unitPrice_block.'_'.$key;?>' ,'comparison_spider_web');">詳細資訊</button>
																		</div>
																	</td>
												<?php
																}else{
												?>
																	<td>
																		<a target="_blank" href="<?php echo $item['url'];?>"><?php echo $item['item_name']; ?></a>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>','unitPrice_item_<?php echo $unitPrice_block.'_'.$key;?>' ,'comparison_spider_web');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}
												?>
																<td  colspan="2"><?php echo $item['tradeNum']; ?></td>
															</tr>
												<?php
															}
														}
													}
												?>
											</tbody>
										</table>
									</div>
								</div>
								<?php
									if($product_info['result'] == true){
								?>
										<table class="table table-striped table-bordered">
											<thead>
												<tr>
													<th>日期</th>
													<th>商品</th>
													<th>品牌</th>
													<th>價格</th>
													<th>單價</th>
													<th>上海運費</th>
													<th>總價</th>
													<th>銷量</th>
													<th>評論數</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td><?php echo $product_info['item_info']['date']; ?></td>
													<td><a href="<?php echo $product_info['item_info']['url']; ?>" target="_blank"><?php echo $product_info['item_info']['title']; ?></a></td>
													<td><?php echo $product_info['item_info']['brand']; ?></td>
													<td><?php echo $product_info['item_info']['price']; ?></td>
													<td><?php echo $product_info['item_info']['unitPrice']; ?></td>
													<td><?php echo $product_info['item_info']['shanghai_express']; ?></td>
													<td><?php echo $product_info['item_info']['total_price']; ?></td>
													<td><?php echo $product_info['item_info']['tradeNum']; ?></td>
													<td><?php echo $product_info['item_info']['comments']; ?></td>
													<td>
														<div class="btn-group btn-group-xs ">
															<button type="button" class="btn btn-default" onclick="getSellerCommentsApi('item_<?php echo $product_info['item_info']['item_id'];?>' , 'resetCommentsTable' , false)">詳細評論</button>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
								<?php
									}
								?>
								<table class="table table-striped table-bordered" id="comparison_info">
								</table>
								<div id="spider_web" style="width: 800px; height: 400px; margin: 0 auto; float:left;" ></div>
								<!--
								<div class="spider-web-option" >
									<div id="spider_web_area" class="spider-web-option-block">
										<label>面積:</label>
										<span><?php echo $radar_data_info['polygon_area'];?></span>
									</div>
									<div id="spider_web_tradeNum" class="spider-web-option-block">
										<label>銷量:</label>
										<span><?php echo $product_info['item_info']['tradeNum']; ?></span>
									</div>

									<div id="spider_web_silder" >
										<div>獨特性:<label><?php echo $radar_data_info['special'];?></label><span><?php echo $radar_data_info['special'];?></span></div>
										<div>熱門性:<label><?php echo $radar_data_info['famous'];?></label><span><?php echo $radar_data_info['famous'];?></span></div>
										<div>熱賣性:<label><?php echo $radar_data_info['hot'];?></label><span><?php echo $radar_data_info['hot'];?></span></div>
										<div>價格:<label><?php echo $radar_data_info['price'];?></label><span><?php echo $radar_data_info['price'];?></span></div>
										<div>評論:<label><?php echo $radar_data_info['comments'];?></label><span><?php echo $radar_data_info['comments'];?></span></div>
									</div>
								</div>
								-->
								<div id="comparison_spider_web" style="width: 800px; height: 400px; margin: 0 auto; display:none; float:left;" ></div>
							</div>
							<div class="tab-pane fade" id="in_taiwan">
								<table class="table table-bordered">
									<tbody>
										<tr>
											<td class="table-td-centered">大陸售價(RMB)</td>
											<td class="table-td-centered"><?php echo $avg_price_taiwan;?></td>
											<td class="table-td-centered">每一規格售價</td>
											<td class="table-td-centered"><?php echo $avg_unitPrice_taiwan;?></td>
											<td class="table-td-centered without-line">
												<i id="hide_taiwan_price_detail" class="icon-chevron-up" style="cursor: pointer; display:none;" onclick="hide_price_detail('taiwan_price_detail' ,'show_taiwan_price_detail' , 'hide_taiwan_price_detail' );"></i>
												<i id="show_taiwan_price_detail" class="icon-chevron-down" style="cursor: pointer;" onclick="show_price_detail('taiwan_price_detail' , 'hide_taiwan_price_detail'  ,  'show_taiwan_price_detail' );"></i>
											</td>
										</tr>
									</tbody>
								</table>
								<div class="price-detail" id="taiwan_price_detail">
									<div class="widget stacked">
										<div class="widget-header">
											<h3>大陸售價(RMB)詳細資料</h3>
										</div> <!-- /widget-header -->
										<table class="table table-bordered price-detail">
											<thead>
												<tr>
													<th>價格範圍</th>
													<th>銷量</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($price_detail_taiwan AS $price_range=>$price_data){
														$reset_price_range = str_replace('_', '~', $price_range);
														$class_name = $price_range;
												?>
														<tr>
															<td class="table-td-centered"><?php echo $reset_price_range;?>
																<?php
																	if($price_data['function'] != null){
																?>
																		<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $price_data['function'];?>"></i>
																<?php
																	}
																?>
																<a class="show-price-detail" href="#every_taobao_price_detail_taiwan" onclick="showItemDetail('price-item-detail-taiwan' ,'<?php echo $class_name; ?>' , 'every_taobao_price_detail_taiwan');">更多資訊</a>
															</td>
															<td class="table-td-centered"><?php echo $price_data['trade']['num'];?>
																<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $price_data['trade']['function'];?>"></i>
															</td>
														</tr>
												<?php
													}
												?>
											</tbody>
										</table>
										<table class="table table-bordered every-price-detail" id="every_taobao_price_detail_taiwan">
											<thead>
												<tr>
													<th>價格</th>
													<th>商品</th>
													<th>銷量</th>
													<th class="close-price-detail" onclick="closePriceDetailBlock('every_taobao_price_detail_taiwan');">X</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($price_detail_taiwan AS $price_range=>$price_data){
														$class_name = $price_range;
														foreach($price_data['item_detail'] AS $price_block=>$items){
															$first = true;
															foreach($items AS $key=>$item){
												?>
																<tr class="price-item-detail-taiwan <?php echo $class_name; ?>" id="price_taiwan_item_<?php echo $price_block.'_'.$key;?>">
												<?php
																if($first == false){
												?>
																	<td></td>
												<?php
																}else{
												?>
																	<td><?php echo $price_block; ?></td>
												<?php
																	$first = false;
																}
																if($item['url'] == null){
												?>
																	<td><?php echo $item['item_name']; ?>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>' ,'price_taiwan_item_<?php echo $price_block.'_'.$key;?>' ,'comparison_spider_web_taiwan');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}else{
												?>
																	<td>
																		<a target="_blank" href="<?php echo $item['url'];?>"><?php echo $item['item_name']; ?></a>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>','price_taiwan_item_<?php echo $price_block.'_'.$key;?>' ,'comparison_spider_web_taiwan');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}
												?>
																<td colspan="2"><?php echo $item['tradeNum']; ?></td>
															</tr>
												<?php
															}
														}
													}
												?>
											</tbody>
										</table>
									</div>
									<div class="widget stacked">
										<div class="widget-header">
											<h3>每一規格售價詳細資料</h3>
										</div> <!-- /widget-header -->
										<table class="table table-bordered price-detail">
											<thead>
												<tr>
													<th>價格範圍</th>
													<th>銷量</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($unitPrice_detail_taiwan AS $unitPrice_range=>$unitPrice_data){
														$reset_unitPrice_range = str_replace('_', '~', $unitPrice_range);
														$class_name = $unitPrice_range;
												?>
														<tr>
															<td class="table-td-centered"><?php echo $reset_unitPrice_range;?>
																<?php
																	if($unitPrice_data['function'] != null){
																?>
																		<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $unitPrice_data['function'];?>"></i>
																<?php
																	}
																?>
																<a class="show-price-detail" href="#every_taobao_unitPrice_detail_taiwan" onclick="showItemDetail('unitPrice-item-detail-taiwan' ,'<?php echo $class_name; ?>' , 'every_taobao_unitPrice_detail_taiwan');" alt="every_taobao_unitPrice_detail_taiwan">更多資訊</a>
															</td>
															<td class="table-td-centered"><?php echo $unitPrice_data['trade']['num'];?>
																<i class="icon-question-sign" style="cursor: pointer;" title="<?php echo $unitPrice_data['trade']['function'];?>"></i>
															</td>
														</tr>
												<?php
													}
												?>
											</tbody>
										</table>
										<table class="table table-bordered every-price-detail" id="every_taobao_unitPrice_detail_taiwan" >
											<thead>
												<tr>
													<th>價格</th>
													<th>商品</th>
													<th>銷量</th>
													<th class="close-price-detail" onclick="closePriceDetailBlock('every_taobao_unitPrice_detail_taiwan');">X</th>
												</tr>
											</thead>
											<tbody>
												<?php
													foreach($unitPrice_detail_taiwan AS $unitPrice_range=>$unitPrice_data){
														$class_name =  $unitPrice_range;
														foreach($unitPrice_data['item_detail'] AS $unitPrice_block=>$items){
															$first = true;
															foreach($items AS $key=>$item){
												?>
																<tr class="unitPrice-item-detail-taiwan <?php echo $class_name; ?>"  id="unitPrice_taiwan_item_<?php echo $unitPrice_block.'_'.$key;?>">
												<?php
																if($first == false){
												?>
																	<td></td>
												<?php
																}else{
												?>
																	<td><?php echo $unitPrice_block; ?></td>
												<?php
																	$first = false;
																}
																if($item['url'] == null){
												?>
																	<td><?php echo $item['item_name']; ?>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>' ,'unitPrice_taiwan_item_<?php echo $unitPrice_block.'_'.$key;?>' ,'comparison_spider_web_taiwan');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}else{
												?>
																	<td>
																		<a target="_blank" href="<?php echo $item['url'];?>"><?php echo $item['item_name']; ?></a>
																		<div class="pull-right">
																			<div class="btn-group btn-group-xs ">
																				<button type="button" class="btn btn-default" onclick="getCompetitionRateApi('<?php echo $item['id'];?>','unitPrice_taiwan_item_<?php echo $unitPrice_block.'_'.$key;?>' ,'comparison_spider_web_taiwan');">詳細資訊</button>
																			</div>
																		</div>
																	</td>
												<?php
																}
												?>
																<td colspan="2"><?php echo $item['tradeNum']; ?></td>
															</tr>
												<?php
															}
														}
													}
												?>
											</tbody>
										</table>
									</div>
								</div>
								<?php
									if($product_info['result'] == true){
								?>
										<table class="table table-striped table-bordered">
											<thead>
												<tr>
													<th>日期</th>
													<th>商品</th>
													<th>品牌</th>
													<th>價格</th>
													<th>單價</th>
													<th>上海運費</th>
													<th>總價</th>
													<th>銷量</th>
													<th>評論數</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td><?php echo $product_info['item_info']['date']; ?></td>
													<td><a href="<?php echo $product_info['item_info']['url']; ?>" target="_blank"><?php echo $product_info['item_info']['title']; ?></a></td>
													<td><?php echo $product_info['item_info']['brand']; ?></td>
													<td><?php echo $product_info['item_info']['price']; ?></td>
													<td><?php echo $product_info['item_info']['unitPrice']; ?></td>
													<td><?php echo $product_info['item_info']['shanghai_express']; ?></td>
													<td><?php echo $product_info['item_info']['total_price']; ?></td>
													<td><?php echo $product_info['item_info']['tradeNum']; ?></td>
													<td><?php echo $product_info['item_info']['comments']; ?></td>
													<td>
														<div class="btn-group btn-group-xs ">
															<button type="button" class="btn btn-default" onclick="getSellerCommentsApi('item_<?php echo $product_info['item_info']['item_id'];?>' , 'resetCommentsTable' ,false)">詳細評論</button>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
								<?php
									}
								?>
								<table class="table table-striped table-bordered" id="comparison_info_taiwan">
								</table>
								<div id="spider_web_taiwan" style="width: 800px; height: 400px; margin: 0 auto; float:left;"></div>
								<!--
								<div class="spider-web-option" >
									<div id="spider_web_area" class="spider-web-option-block">
										<label>面積:</label>
										<span><?php echo $radar_data_info_taiwan['polygon_area'];?></span>
									</div>
									<div id="spider_web_tradeNum" class="spider-web-option-block">
										<label>銷量:</label>
										<span><?php echo $product_info['item_info']['tradeNum']; ?></span>
									</div>

									<div id="spider_web_silder_taiwan" >
										<div>獨特性:<label><?php echo $radar_data_info_taiwan['special'];?></label><span><?php echo $radar_data_info_taiwan['special'];?></span></div>
										<div>熱門性:<label><?php echo $radar_data_info_taiwan['famous'];?></label><span><?php echo $radar_data_info_taiwan['famous'];?></span></div>
										<div>熱賣性:<label><?php echo $radar_data_info_taiwan['hot'];?></label><span><?php echo $radar_data_info_taiwan['hot'];?></span></div>
										<div>價格:<label><?php echo $radar_data_info_taiwan['price'];?></label><span><?php echo $radar_data_info_taiwan['price'];?></span></div>
										<div>評論:<label><?php echo $radar_data_info_taiwan['comments'];?></label><span><?php echo $radar_data_info_taiwan['comments'];?></span></div>
									</div>
								</div>
								-->
								<div id="comparison_spider_web_taiwan" style="width: 800px; height: 400px; margin: 0 auto; display:none; float:left;"></div>
							</div>
						</div>
					</div>
				</div>
				<!--
				<div class="widget stacked">
					<div class="widget-header">
						<i class="icon-tag"></i>
						<h3>品牌銷售前10名</h3>
					</div>
					<div class="widget-content">
						<div class="product-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>品牌</th>
										<th>商品名稱</th>
										<th>價格</th>
										<th>月銷量</th>
										<th>重量</th>
										<th>產地</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="widget stacked">
					<div class="widget-header">
						<i class="icon-flag"></i>
						<h3>關鍵字銷售前10名</h3>
					</div>
					<div class="widget-content">
						<div class="product-block">
							<table class="table table-striped table-bordered">
								<thead>
									<tr>
										<th>品牌</th>
										<th>商品名稱</th>
										<th>價格</th>
										<th>月銷量</th>
										<th>重量</th>
										<th>產地</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
									<tr>
										<td>金蘭</td>
										<td>金蘭醬油</td>
										<td>100</td>
										<td>13</td>
										<td>30</td>
										<td>台灣</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				-->
			</div>
		</div>
		<div class="comment-lightbox" id="comment_lightbox" style="display:none;">
			<form name="comment_form" id="comment_form" action="../ec_system/doExportSingleData" method="post">
				<input type='hidden' id="comments_item_id" name='comments_item_id'/>
				<input type='hidden' id="comments_item_name" name='comments_item_name'/>
				<div class="lightbox comment">
					<div class="box-inner">
						<div class="lb-top-comment">
							<span>評論</span>
							<div class="comment-concel" onclick="lbRemove('comment_lightbox',0)">X</div>
						</div>
						<div class="details-exprot-btn"><input type="submit"  value="匯出評論"/></div>
						<div class="lb-content-keyword-tag" id="keyword_tag">
							<ul class="keyword-tag-ul"  id="keyword_tag_ul">
							</ul>
						</div>
						<div class="lb-content-comment" id="comment_content">
						</div>
					</div>
				</div>
			</form>
		</div>

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
		<script type="text/javascript"  src="<?=base_url()?>assets/js/page_js/taiwan_competition_result.js"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/page_js/common_api_function.js"></script>
		<script type="text/javascript"  src="<?=base_url()?>assets/js/page_js/seller_comment_lighbox.js"></script>
		<!--<script type="text/javascript"  src="<?=base_url()?>assets/js/page_js/draggable-points.js"></script>-->
		<script type="text/javascript" src="<?=base_url()?>assets/js/plugin_js/jquery.datepick.min.js"></script>


		<script  type="text/javascript">
			var now_show = 'all';
			var displaying = false;
			var radar_data = [<?php echo $radar_data; ?>];
			var radar_data_taiwan = [<?php echo $radar_data_taiwan; ?>];
			var record_obj = {
				cat_name:"<?php echo $record['cat_name']; ?>",
				cat_lv:"<?php echo $record['cat_lv']; ?>",
				startDate:"<?php echo $record['startDate']; ?>",
				product_name:"<?php echo $record['product_name']; ?>",
			};
			$(document).ready(function() {

				$('#competition_btn').addClass('active');
				$('#taiwan_competition_btn').addClass('active');
				//點擊隱藏指標數據
				$('#hide_indicator_info').click(function(){
					displaying = false;
					$('#indicator_info').hide();
					$('#indicator_info_taiwan').hide();
					$('#hide_indicator_info').hide();
					$('#show_indicator_info').show();
				})

				//點擊顯示指標數據
				$('#show_indicator_info').click(function(){
					displaying = true;
					if(now_show == 'all'){
						$('#indicator_info').show();
					}else{
						$('#indicator_info_taiwan').show();
					}
					$('#hide_indicator_info').show();
					$('#show_indicator_info').hide();
				})

				$('.show-price-detail').click(function(e){
					 e.preventDefault();
					$('html, body').animate({scrollTop: $( $.attr(this, 'href') ).offset().top}, 500);
					return false;
				})

				 $( "#spider_web_silder > div > span" ).each(function() {
					// read initial values from markup and remove that
					var value = parseInt( $( this ).text(), 10 );
					$( this ).empty().slider({
					value: value,
					range: "min",
					min: 1,
					max: 10,
					step: 0.01,
					animate: true,
					slide: function( event, ui ) {
					 	$(this).parent().find('label').html( ui.value );
					 	updatePolygonArea('spider_web','spider_web_silder');
						}
					});
				});

				 $( "#spider_web_silder_taiwan > div > span" ).each(function() {
					// read initial values from markup and remove that
					var value = parseInt( $( this ).text(), 10 );
					$( this ).empty().slider({
					value: value,
					range: "min",
					min: 1,
					max: 10,
					step: 0.01,
					animate: true,
					slide: function( event, ui ) {
					 	$(this).parent().find('label').html( ui.value );
					 	updatePolygonArea('spider_web_taiwan','spider_web_silder_taiwan');
						}
					});
				});
				initCompetition(radar_data,radar_data_taiwan,record_obj.cat_name ,record_obj.product_name);
			});
		</script>
	</body>
</html>
