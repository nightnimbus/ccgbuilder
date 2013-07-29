<?php

require_once("../../php/libs/genlib/filedir.class.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");

$ccgRoot = $_POST["ccgRoot"];

FileDir::rrmdir($ccgRoot);

?>