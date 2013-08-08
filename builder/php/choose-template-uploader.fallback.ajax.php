<?php

require_once("../../php/globals.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");

$imageData = "";

if(!empty($_FILES))
{
	$targetFile = $_FILES["Filedata"];

	$fileTypes = array("jpg", "jpeg", "png");
	$filePathInfo = pathinfo($targetFile["name"]);
	$targetFileType = "";

	foreach($fileTypes as $ext)
	{
		if(strstr($filePathInfo["extension"], $ext))
		{
			switch($ext)
			{
				case "jpg":
					$targetFileType = "image/jpeg";
					break;

				case "jpeg":
					$targetFileType = "image/jpeg";
					break;

				case "png":
					$targetFileType = "image/png";
					break;
			}
		}
	}

	if(
		strlen($targetFileType) > 0
		&& $targetFile["size"] <= 500*1000)
	{
		$file = fopen($targetFile["tmp_name"], "r");
		$imageData = fread($file, $targetFile["size"]);
		fclose($file);

		// Parse in to css inline image syntax.
		$imageData = base64_encode($imageData);
		$imageData = "data:".$targetFileType.";base64,".$imageData;
	}
}

echo $imageData;

?>