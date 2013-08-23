<?php

class EncryptKeys
{
	private static $RSA_1024_PRIVATE;
	private static $RSA_1024_PUBLIC;

	public static function initialize()
	{
		self::$RSA_1024_PRIVATE = "-----BEGIN RSA PRIVATE KEY----- MIICXAIBAAKBgQCQKvIoQrB/8pySgnMUcOKd4xubGtUGT7gxbIoZabvwxWGzP7Eg KCEseZljGoK06sOqjWo5vhZ9w2ZCoFT/1Awud4XzAiuXJuS/vnuT0BJ90yEqFy3W qZ0QGIAtiNvkNfX4CzkGqfUt3p0HV8ZdOYskkZHgBBvHVXCjdCsgLCoGfwIDAQAB AoGAAIbHn5yuvFOMfX8lyxtRGIvYcUvlyezHRWxEt4G1V/8V3kELSozFoj3yG3SL VFHPKR5JwbA6BiI34Le+gmNUhWLSWlTPvHcmLKZ4N0B4LfenY3HGo8d0fHvQdZLY kIE63SB/xsyOZ4rMDMRYAoVKSI8HwQmLesxea0t97CirukECQQCcvqZp62WzrvlH o5IlpfqKUZ6gaIq+9JSTB5H0eHsfldWw+tbILtOhhVgJe/3hgb/qvp+30sfU/M0J PH7ASVexAkEA63V8jXtwrmzl3VDRJ9K7FXGrBUyL/ldBcH73mTt1bgxSGRkk1F1s NPjGarJFtU4C+qKwSk5V8qvRhXDJbtn9LwJAbXwZ32hGfLDefHS7s8Jw80a5p0/+ gg1y7hRelcXGMrTFM76yYdebiXoLmWxbVLX9qOmHxK3dWV9PlIEGBCf2sQJBAI37 f4rVN8KGein1lNn9scChlW4RlY1eUmCiv21QNGSS22K1DcddOmXK6eLm8y/8BcHb HpEAIcW+pA5iT6UfoBMCQAuWy1fOuNrmTbgzQ9id17c3YPyt4BLahjKeyk+evxcr STNSTN0GodFqeApafgQyBsFl/GO1bRibiJDDd+fG4xg= -----END RSA PRIVATE KEY-----";
		self::$RSA_1024_PUBLIC = "-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQKvIoQrB/8pySgnMUcOKd4xub GtUGT7gxbIoZabvwxWGzP7EgKCEseZljGoK06sOqjWo5vhZ9w2ZCoFT/1Awud4Xz AiuXJuS/vnuT0BJ90yEqFy3WqZ0QGIAtiNvkNfX4CzkGqfUt3p0HV8ZdOYskkZHg BBvHVXCjdCsgLCoGfwIDAQAB -----END PUBLIC KEY-----";
	}

	public static function RSA_1024_PRIVATE() { return self::$RSA_1024_PRIVATE; }
	public static function RSA_1024_PUBLIC() { return self::$RSA_1024_PUBLIC; }
}

EncryptKeys::initialize();

?>