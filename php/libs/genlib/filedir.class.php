<?php

class FileDir
{
	public static function rrmdir($dir)
	{
		if(strlen($dir) > 0)
		{
			foreach(glob($dir.'/*') as $file)
			{
		    	if(is_dir($file))
		    		self::rrmdir($file);
		    	else
		    		unlink($file);
		  	}

		  	rmdir($dir);
		}
	}
}

?>