<?php

require_once("../../php/libs/genlib/globals.class.php");
require_once("../../php/libs/helpers/string.helper.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");

$ret = array("success"=>false, "imageData"=>"", "file"=>null);

if(!empty($_FILES))
{
	$supportFileReader = $_POST["supportFileReader"];
	$fileReqs = json_decode($_POST["fileReqs"]);

	$templateFile = $_FILES["templateFile"];

	// IFrame Transport uploads the image as image/gif.
	if($supportFileReader !== true)
		array_push($fileReqs->types, "image/gif");

	if(
		in_array($templateFile["type"], $fileReqs->types) &&
		$templateFile["size"] <= $fileReqs->maxSize)
	{
		$imageData = "";

		$file = fopen($templateFile["tmp_name"], "r");
		$imageData = fread($file, $templateFile["size"]);
		fclose($file);

		if(strlen($imageData) > 0)
		{
			if($templateFile["type"] == "image/gif")
			{
				$pathInfo = pathinfo($templateFile["name"]);
				$templateFile["type"] = StringHelper::extensionToMIME($pathInfo["extension"]);
			}

			// Parse in to data uri scheme.
			$imageData = base64_encode($imageData);
			$imageData = "data:".$templateFile["type"].";base64,".$imageData;

			$ret["success"] = true;
		}

		$ret["imageData"] = $imageData;
		$ret["file"] = $templateFile;
	}
}

echo json_encode($ret);

?>