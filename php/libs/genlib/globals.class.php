<?php

class Globals
{
	private static $BASE_URL;
	private static $ROOT_DIR;
	private static $TMP_DIR;

	public function initialize()
	{
		self::$BASE_URL = "192.168.1.4/ccgbuilder/";
		//self::$BASE_URL = "localhost/ccgbuilder/";

		self::$ROOT_DIR = $_SERVER["DOCUMENT_ROOT"]."ccgbuilder/";
		self::$TMP_DIR = self::$ROOT_DIR."tmp/";
	}

	public static function BASE_URL() { return self::$BASE_URL; }
	public static function ROOT_DIR() { return self::$ROOT_DIR; }
	public static function TMP_DIR() { return self::$TMP_DIR; }
}

Globals::initialize();

?>