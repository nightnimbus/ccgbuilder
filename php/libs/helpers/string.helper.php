<?php

class StringHelper
{
	private static $alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	private static $randomAlphabet = "JeYDp4G6VfKtPRZQyFcEqH275mTBk1zsl3uSA8rNdWnXbMo9ghUOLvjC0wiIxa";

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

	public static function getRandomString($min, $max)
	{
	    // start with an empty random string
	    $random_string = "";
	    $valid_chars = self::$randomAlphabet;
	    $length = rand($min, $max);

	    // count the number of chars in the valid chars string so we know how many choices we have
	    $num_valid_chars = strlen($valid_chars);

	    // repeat the steps until we've created a string of the right length
	    for ($i = 0; $i < $length; $i++)
	    {
	        // pick a random number from 1 up to the number of valid chars
	        $random_pick = rand(1, $num_valid_chars);

	        // take the random character out of the string of valid chars
	        // subtract 1 from $random_pick because strings are indexed starting at 0, and we started picking at 1
	        $random_char = $valid_chars[$random_pick-1];

	        // add the randomly-chosen char onto the end of our string so far
	        $random_string .= $random_char;
	    }

	    // return our finished random string
	    return $random_string;
	}
}

?>