<?php

$db = null;
$db_exceptionMsg = "";

try
{
	global $db;

	$db_host = "localhost";
	$db_name = "ccg_builder";
	$db_username = "root";
	$db_password = "";

	$db = new PDO("mysql:dbname=$db_name;host=$db_host;charset=utf8", $db_username, $db_password);

	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
}

catch(PDOException $e)
{
	global $db_exceptionMsg;

	$db_exceptionMsg = $e->getMessage();
}

?>