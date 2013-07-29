<?php

require_once("../../php/pdo_connect.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");

$ret = array("success"=>true, "msg"=>"");
$val = $_POST["val"];

if(strlen($db_exceptionMsg) == 0)
{
	try
	{
		$sth = $db->prepare("SELECT COUNT(id) FROM ccgs WHERE name=?");
		$sth->execute(array($val));

		if($sth->fetchColumn() > 0)
		{
			$ret["msg"] =
			"
			There is already a CCG with that name in our database.
			Please choose another name.
			";
			$ret["success"] = false;
		}
	}

	catch(PDOException $e)
	{
		$ret["msg"] =
		"
		Oops! We can't check if your name is valid at this time. 
		The database may be down. Please try again later. Sorry!
		";
		$ret["success"] = false;
	}
}

else
{
	$ret["msg"] =
	"
	Oops! We can't check if your name is valid at this time. 
	The database may be down. Please try again later. Sorry!
	";
	$ret["success"] = false;
}

echo json_encode($ret);

?>