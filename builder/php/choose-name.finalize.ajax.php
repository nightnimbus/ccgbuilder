<?php

require_once("../../php/pdo_connect.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");

$ret = array("success"=>true, "msg"=>"");
$ccgName = $_POST["ccgName"];

if(strlen($db_exceptionMsg) == 0)
{
	try
	{
		$finalize = $db->prepare("INSERT INTO ccgs(author,name) VALUES('',?)");
		$finalize->execute(array($ccgName));

		if($finalize->rowCount() == 0)
		{
			$ret["success"] = false;
			$ret["msg"] = "Inserting this CCG in to our database has failed. Sorry!";
		}

		$finalize->closeCursor();
	}

	catch(PDOException $e)
	{
		$ret["success"] = false;
		$ret["msg"] = "Oops! We can't check if your name is valid at this time. The database may be down. Please try again later. Sorry!";
	}
}

else
{
	$ret["success"] = false;
	$ret["msg"] = "Oops! Our database is down. Please try again later. Sorry!";
}

echo json_encode($ret);

?>