<?php

require_once("../../php/libs/genlib/globals.class.php");
require_once("../../php/pdo_connect.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");

$ret = array("success"=>true, "msg"=>"", "ccgRoot"=>"");
$thisCcgRoot = Globals::ROOT_DIR()."/ccgs/";

// Defaults
$templateSizes = ($_POST["templateSizes"]) ? $_POST["templateSizes"] : array();
$templateImages = ($_POST["templateImages"]) ? $_POST["templateImages"] : array();

$firstSize = $templateSizes[0];

// If we are connected to the database.
if(strlen($db_exceptionMsg) == 0)
{
	// First step db functionality:
	try
	{
		$ccgNumHandle = $db->query("SELECT id FROM ccgs ORDER BY id DESC LIMIT 1");
		$row = $ccgNumHandle->fetch();
		$ccgNumHandle->closeCursor();

		if($row != false)
		{
			$thisCcgRoot .= ($row["id"] + 1).uniqid();

			$update = $db->query("UPDATE ccgs SET base_path='$thisCcgRoot' WHERE id='$row[id]'");

			if($update->rowCount() == 0)
			{
				$ret["success"] = false;
				$ret["msg"] = "Failed to update database.";
			}

			$update->closeCursor();
		}

		else
		{
			$ret["success"] = false;
			$ret["msg"] = "That CCG doesn't exist.";
		}
	}

	catch(PDOException $e)
	{
		$ret["success"] = false;
		$ret["msg"] = $e->getMessage();
	}


	if($ret["success"])
	{
		$ret["ccgRoot"] = $thisCcgRoot;
		$fileDir = $thisCcgRoot."/template/";
		$filePrefix = "background_";
		$fileSuffix = ".jpg";


		if(!is_dir($fileDir))
			mkdir($fileDir, 0, true);


		if(strpos($templateImages[$firstSize], "http://") === false)
		{
			// DRAGGED FROM DESKTOP

			$first = true;
			foreach($templateImages as $size=>$image)
			{
				if($first)
				{
					$first = false;
					continue;
				}

				$from = stripos($image, "/") + 1;
				$to = stripos($image, ";") - $from;
				$fileSuffix = ".".substr($image, $from, $to);

				if($fileSuffix == ".jpeg") $fileSuffix = ".jpg";
				
				$image = str_replace(array("data:image/jpeg;base64,", "data:image/png;base64,"), "", $image);
				$image = str_replace(" ", "+", $image);
				
				$fileName = $fileDir.$filePrefix.$size.$fileSuffix;
				$rawImgData = base64_decode($image);

				if(!file_put_contents($fileName, $rawImgData))
				{
					$ret["success"] = false;
					$ret["msg"] = "file_put_contents failed!";

					break;
				}
			}
		}

		else
		{
			// DRAGGED FROM TEMPLATE SELECTION BOX

			foreach($templateImages as $size=>$image)
			{
				$imgUrlPrefix = substr($image, 0, strrpos($image, "_"))."_";
				$imgUrlSuffix = substr($image, strrpos($image, "."));

				if($imgUrlSuffix == ".jpeg") $imgUrlSuffix = ".jpg";

				$newImgUrl = $imgUrlPrefix.$size.$imgUrlSuffix;
				$fileName = $fileDir.$filePrefix.$size.$imgUrlSuffix;

				if(!copy($newImgUrl, $fileName))
				{
					$ret["success"] = false;
					$ret["msg"] = "Could not copy template image!";

					break;
				}
			}
		}
	}
}

else
{
	$ret["success"] = false;
	$ret["msg"] =
	"
	Oops! We can't check if your name is valid at this time. 
	The database may be down. Try again later. Sorry!
	";
}

echo json_encode($ret);

?>