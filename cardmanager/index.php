<?php

require_once("../php/libs/ChromePHP/ChromePhp.php");
require_once("../php/pdo_connect.php");
require_once("../php/libs/genlib/globals.class.php");

$ccgData = array();
$componentData = array();

if(strlen($db_exceptionMsg) == 0)
{
	try
	{
		$id = (isset($_GET["id"])) ? $_GET["id"] : "";

		if(strlen($id) > 0)
		{
			$getCcgData = $db->prepare("SELECT * FROM ccgs WHERE public_id=?");
			$getCcgData->execute(array($id));
            $ccgData = $getCcgData->fetch(PDO::FETCH_ASSOC);
            $getCcgData->closeCursor();

			if($ccgData)
			{
                $getComponentData = $db->query("SELECT * FROM components WHERE ccgid='$ccgData[id]'");
                $componentData = $getComponentData->fetchAll(PDO::FETCH_ASSOC);
                $getComponentData->closeCursor();

                if(!$componentData)
                    die("an error occurred");
            }

            else
                die("ccg does not exist");
		}

        else
        {
            header("Location: http://".Globals::BASE_URL());
            exit;
        }
	}

	catch(PDOException $e)
	{
		die("an error occurred");
	}
}

else
	die("cannot connect to db");

?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie10 lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie10 lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie10 lt-ie9"> <![endif]-->
<!--[if IE 9]>         <html class="no-js lt-ie10"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="../css/bootstrap.min.css">
        <style>
            /*body {
                padding-top: 60px;
                padding-bottom: 40px;
            }*/
        </style>
        <link rel="stylesheet" href="../css/bootstrap-responsive.min.css">
        <link rel="stylesheet" href="../css/bootstrap-glyphicons.css">
        <link rel="stylesheet" href="../css/main.css">
        <link rel="stylesheet" href="css/main.css">

        <!-- External CSS Libraries -->
        <link rel="stylesheet" href="../css/libs/helper.lib.css">
        
        <link rel="stylesheet" href="../js/vendor/jquery-ui/css/smoothness/jquery-ui.custom.min.css">

        <!-- Plugin CSS -->
        <link rel="stylesheet" href="../js/vendor/plugins/jquery/socialMedia/css/socialMedia.css">
        <link rel="stylesheet" href="../js/vendor/plugins/jquery/jqte/jquery-te.css">
    </head>
    <body>
        <div class="container-fluid">
            <div class="container-header">
                <div class="row-fluid">
                    <div class="container">
                        <div class="container-logo" style="background: url(../assets/img/logo.png);"></div>
                        <div class="container-navbar">
                            <div class="navbar">
                                <div class="navbar-inner">
                                    <span class="container-nav-search pull-right">
                                        <span id="search-show" class="search-show pull-right"><i class="icon-search"></i></span>
                                        <form id="nav-search-form" class="navbar-search-form navbar-form pull-left">
                                            <input type="text" class="search-query" placeholder="Search">
                                        </form>
                                    </span>

                                    <ul class="nav">
                                        <li><a href="../">Home</a></li>
                                        <li><a href="../builder">Build a CCG</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="row-fluid">
                <span class="span12 container-main-content">
                    <div class="container main-content text-center">
                        <div class="row-fluid">
                            <span class="span5">
                                <div id="container-components">
                                    <?php

                                    $html = '<legend>Components</legend><fieldset>';

                                    foreach($componentData as $row)
                                    {
                                        $componentId = "component_".$row["id"];

                                        // LABEL
                                        $html .= '<label for="component_'.$componentId.'">'.$row["name"].'</label>';

                                        // COMPONENT CONTROL
                                        switch($row["type"])
                                        {
                                            case 0:
                                                $html .= '<div style="width: 70%; margin: 0 auto;"><textarea class="editor" id="'.$componentId.'"></textarea></div>';
                                                break;

                                            case 1:
                                                $html .= '<span id="'.$componentId.'" class="btn btn-success">Select Image</span>';
                                                break;
                                        }
                                    }

                                    $html .= "</fieldset>";

                                    echo $html;

                                    ?>
                                </div>
                            </span>

                            <span class="span7">
                            </span>
                        </div>
                    </div>
                </span>
            </div>

            <div class="row-fluid">
                <span class="span12 footer">
                    <div class="container">
                        <div class="container-contact-us footer-container pull-left">
                            <form method="POST">
                                <h3>Contact Us</h3>
                                <fieldset>
                                    <span class="help-block"><strong class="required-star">*</strong> - indicates a required field.</span>
                                    <label>Email:</label>
                                    <input type="text" name="contactEmail">
                                    <label>Message<strong class="required-star">*</strong>:</label>
                                    <textarea name="contactMessage"></textarea><br />
                                    <button type="submit" name="contactSubmit" class="btn">Submit</button>
                                </fieldset>
                            </form>
                        </div>

                        <div class="container-social-media footer-container pull-left">
                            <h3>Social Media</h3>
                            <ul id="footer-social-media" class="social css3-social-media">
                                <li class="facebook">
                                    <a href="#"><strong>Facebook</strong></a>
                                </li>
                                <li class="twitter">
                                    <a href="#"><strong>Twitter</strong></a>
                                </li>
                                <li class="linkedin">
                                    <a href="#"><strong>LinkedIn</strong></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </span>
            </div>
        </div>

        <!-- Console Polyfill For <= IE8 -->
        <script>
            if(typeof window.Console === "undefined")
            {
                window.Console = {};
                window.Console.log = function(msg){};
                window.Console.error = function(msg){};
            }
        </script>
        
        <!-- Vendor Fallback JS -->
        <script src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js"></script>
        <script>window.Modernizr || document.write('<script src="../js/vendor/modernizr.min.js"><\/script>')</script>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="../js/vendor/jquery.min.js"><\/script>')</script>

        <!-- Vendor Non-Fallback JS -->

        <!-- Plugins -->
        <script src="../js/vendor/plugins/jquery/hoverIntent/js/hoverIntent.min.js"></script>

        <!-- Polyfills -->
        <script>
            window.Modernizr.load(
            [
                {
                    test: window.Modernizr.csstransitions,
                    nope: ["../js/vendor/plugins/jquery/socialMedia/js/socialMedia.js"]
                },
                {
                    test: window.Modernizr.input.placeholder,
                    nope: ["../js/vendor/plugins/jquery/polyfills/placeholder/placeholder.min.js"]
                }
            ]);
        </script>

        <!-- Custom JS -->
        <script src="../js/general.js"></script>

        <!-- RequireJS -->
        <!--<script data-main="js/release/main.js" src="../js/vendor/require/require.min.js"></script>-->
        <script data-main="js/app.js" src="../js/vendor/requirejs/require.min.js"></script>

        <script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>

        <div style="display: none;">
            <canvas id="hiddenCanvas"></canvas>
        </div>
        <div id="lights-off"></div>
    </body>
</html>