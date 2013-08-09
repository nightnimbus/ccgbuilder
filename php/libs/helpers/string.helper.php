<?php

class StringHelper
{
	public static function pathToUrl($path, $baseUrl, $pathReplace, $protocol="")
	{
		// Replace any duplicate slashes.
		$path = preg_replace("/\/+/", "/", $path);
		$path = preg_replace("/\\+/", "\\", $path);

		$url = $protocol.str_replace($pathReplace, $baseUrl, $path);
		
		return $url;
	}

	public static function extensionToMIME($ext)
	{
		$mimeType = "";
		$ext = str_replace(".", "", $ext);

		switch($ext)
		{
			case "jpg":
				$mimeType = "image/jpeg";
				break;

			case "jpeg":
				$mimeType = "image/jpeg";
				break;

			case "png":
				$mimeType = "image/png";
				break;

			case "gif":
				$mimeType = "image/gif";
				break;
		}

		return $mimeType;
	}
}

?>