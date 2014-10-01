
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Sticky footer &middot; Twitter Bootstrap</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">

		<!-- CSS -->
		<link href="<?=base_url()?>assets/css/bootstrap.min.css" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/bootstrap-responsive.min.css" rel="stylesheet">
		<link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/font-awesome.min.css" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/ui-lightness/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/base-admin-3.css" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/base-admin-3-responsive.css" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/pages/signin.css" rel="stylesheet" type="text/css">
		<link href="<?=base_url()?>assets/css/custom.css" rel="stylesheet">
		<link href="<?=base_url()?>assets/css/login.css" rel="stylesheet">

				<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
		<!--[if lt IE 9]>
			<script src="../assets/js/html5shiv.js"></script>
			<![endif]-->

			<!-- Fav and touch icons -->
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
		<link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
		<link rel="shortcut icon" href="../assets/ico/favicon.png">
		</head>

		<body>


			<!-- Part 1: Wrap all page content here -->
			<div id="wrap">
				<?php $this->load->view('templates/navbar.html'); ?>
				<div class="main" style="margin-top:40px">

					<div class="container">

						<div class="row">
							
							<div class="col-md-8">          
								
								<div class="well">

									<h1 style="color:#F90; font-weight:bold">SRM</h1>

									<p>中文字Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
									
									
									<p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
								</div>
								
								<div class="well">

									<h1 style="color:#F90; font-weight:bold">Dashboard</h1>

									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
									
									
									<p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
								</div>
								
							</div> <!-- /span8 -->
							
							
							<div class="col-md-4">

								<div class="account-container stacked" style="margin-top:0px">
									
									<div class="content clearfix">
										
										<form name="input_form" id="input_form" action="./login/doLogin" method="post">
											
											<h1 >登入</h1>    
											
											<div class="login-fields">
												
												<p>Sign in using your registered account:</p>
												<div class="warning" id="warning"  <?php if(!isset($error_msg)){ echo ' style="display:none;" ';}?> >
													<div class="warning-redline"></div>
													<div class="warning-display" id="warning_msg"><?php if(isset($error_msg)){ echo $error_msg;} ?></div>
												</div>		
												<div class="field">
													<label for="username">Username:</label>
													<input type="text" id="username" name="username" value="" placeholder="Username" class="form-control input-lg username-field" />
												</div> <!-- /field -->
												
												<div class="field">
													<label for="password">Password:</label>
													<input type="password" id="password" name="password" value="" placeholder="Password" class="form-control input-lg password-field"/>
												</div> 
										<!--		
												<div class="field">
													<label for="password">Varidation Dode:</label>
													<input type="password" id="password" name="varidationcode" value="" placeholder="Varidationcode" class="form-control input-lg password-field"/>
												</div> 
										-->	
											</div> <!-- /login-fields -->
											
											<div class="login-actions">
									<!--            
												<span class="login-checkbox" style="margin-top:15px">
													<span>aaaa</span>
													<button class="btn btn-default"><span class="icon-refresh"></span></button>
												</span>
									-->			
												<button type="button" class="login-action btn btn-primary" onclick="checkForm();">Sign In</button>
												
											</div> <!-- .actions -->
									<!--	
											<div class="login-social">
												<button class=" btn btn-default">Forgot password?</button>
												<button class=" btn btn-default">Register</button>
											</div>
									-->		
										</form>
										
									</div> <!-- /content -->
									
								</div> <!-- /account-container -->
								
							</div> <!-- /span4 -->
							
						</div> <!-- /row -->

					</div> <!-- /container -->
					
				</div> <!-- /main -->

				<div id="push"></div>
			</div>

	<?php $this->load->view('templates/footer.html'); ?>
		<!-- Le javascript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script src="<?=base_url()?>assets/js/plugin_js/libs/jquery-1.9.1.min.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/libs/jquery-ui-1.10.0.custom.min.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/libs/bootstrap.min.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/plugins/flot/jquery.flot.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/plugins/flot/jquery.flot.pie.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/plugins/flot/jquery.flot.resize.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/Application.js"></script>
		<script src="<?=base_url()?>assets/js/page_js/login.js"></script>
		<!--
		<script src="<?=base_url()?>assets/js/plugin_js/charts/area.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/charts/donut.js"></script>
		<script src="<?=base_url()?>assets/js/plugin_js/charts/donut.js"></script>
		-->
	</body>
	</html>
