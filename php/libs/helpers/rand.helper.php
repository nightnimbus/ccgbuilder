<?php

class RandHelper
{
	private static function make_seed()
	{
		list($usec, $sec) = explode(' ', microtime());
  		return (float) $sec + ((float) $usec * 100000);
	}
	
	public static function seed_rand()
	{
		srand(self::make_seed());
	}
}

?>