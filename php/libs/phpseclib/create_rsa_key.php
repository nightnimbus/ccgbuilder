<?php

require_once("Crypt/RSA.php");

$rsa = new Crypt_RSA();
extract($rsa->createKey());

echo $privatekey;
echo "<br /><br />";
echo $publickey;

?>