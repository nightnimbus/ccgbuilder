<?php

require_once("../../php/pdo_connect.php");

$ccgName = $_POST["ccgName"];

if(strlen($db_exceptionMsg) == 0)
{
	try
	{
		$delete = $db->prepare("DELETE FROM ccgs WHERE name=?");
		$delete->execute(array($ccgName));
		$delete->closeCursor();
	}

	catch(PDOException $e) {}
}

?>