<?php

require_once("../../php/pdo_connect.php");
require_once("../../php/libs/ChromePHP/ChromePhp.php");
require_once("../../php/libs/genlib/globals.class.php");
require_once("../../php/libs/helpers/string.helper.php");
require_once("../../php/libs/helpers/rand.helper.php");

$ret = array("success"=>true);

// Globals
$chooseNameFinalized = false;
$chooseTemplateFinalized = false;
$templateComponentsFinalized = false;

$ccgid = 0;
$thisPublicId = "";

if(strlen($db_exceptionMsg) == 0)
{
	try
	{
		/**************************************/
		/**************************************/
		/*      CHOOSE NAME FINALIZATION      */
		/**************************************/
		/**************************************/
		finalizeChooseName();





		/**************************************/
		/**************************************/
		/*    CHOOSE TEMPLATE FINALIZATION    */
		/**************************************/
		/**************************************/
		if($chooseNameFinalized)
			finalizeChooseTemplate();
		else
			definalizeAll();





		/**************************************/
		/**************************************/
		/*  TEMPLATE COMPONENTS FINALIZATION  */
		/**************************************/
		/**************************************/
		if($chooseTemplateFinalized)
			finalizeTemplateComponents();
		else
			definalizeAll();
	}

	catch(PDOException $e)
	{
		definalizeAll();
		$ret["success"] = false;
	}
}

else
{
	definalizeAll();
	$ret["success"] = false;
}

echo json_encode($ret);











/**************************************/
/**************************************/
/*         FINALIZE FUNCTIONS         */
/**************************************/
/**************************************/
function finalizeChooseName()
{
	global $db;
	global $ret;
	global $chooseNameFinalized;
	global $ccgid;

	$ccgName = $_POST["ccgName"];
	$finalize = $db->prepare("INSERT INTO ccgs(author,name) VALUES('',?)");
	$finalize->execute(array($ccgName));

	if($finalize->rowCount() == 0)
		$ret["success"] = false;

	else
	{
		$chooseNameFinalized = true;
		$ccgid = $db->lastInsertId();
	}

	$finalize->closeCursor();
}

function finalizeChooseTemplate()
{
	global $db;
	global $ret;
	global $ccgid;
	global $chooseTemplateFinalized;
	global $thisPublicId;

	RandHelper::seed_rand();
	$publicIdCheck = $db->prepare("SELECT COUNT(id) FROM ccgs WHERE public_id=?");

	for($i = 0; $i < 3; $i++)
	{
		$thisPublicId = StringHelper::getRandomString(8, 12);
		$publicIdCheck->execute(array($thisPublicId));

		if($publicIdCheck->rowCount() == 1)
			break;
	}

	if(strlen($thisPublicId) > 0)
	{
		$update = $db->query("UPDATE ccgs SET public_id='$thisPublicId' WHERE id='$ccgid'");

		if($update->rowCount() == 0)
			$ret["success"] = false;

		$update->closeCursor();

		$templateSizes = ($_POST["templateSizes"]) ? $_POST["templateSizes"] : array();
		$templateDataBack = ($_POST["templateDataBack"]) ? $_POST["templateDataBack"] : array();
		$templateDataFront = ($_POST["templateDataFront"]) ? $_POST["templateDataFront"] : array();

		$templateImages = array();
		$firstSize = $templateSizes[0];
		$fileDir = Globals::ROOT_DIR()."assets/ccgs/".$thisPublicId."/templates/";
		$fileSuffix = ".jpg";


		// Turn both arrays in to one.
		for($i = 0; $i < count($templateSizes); $i++)
		{
			$templateImages["back_".$templateSizes[$i]] = $templateDataBack[$templateSizes[$i]];
			$templateImages["front_".$templateSizes[$i]] = $templateDataFront[$templateSizes[$i]];
		}


		if(!is_dir($fileDir))
			mkdir($fileDir, 0, true);

		foreach($templateImages as $size=>$image)
		{
			$from = stripos($image, "/") + 1;
			$to = stripos($image, ";") - $from;
			$fileSuffix = ".".substr($image, $from, $to);

			if($fileSuffix == ".jpeg") $fileSuffix = ".jpg";
			
			$image = str_replace(array("data:image/jpeg;base64,", "data:image/png;base64,"), "", $image);
			$image = str_replace(" ", "+", $image);
			
			$fileName = $fileDir.$size.$fileSuffix;
			$rawImgData = base64_decode($image);

			if(!file_put_contents($fileName, $rawImgData))
			{
				$ret["success"] = false;
				break;
			}
		}
	}

	else
		$ret["success"] = false;

	if($ret["success"])
		$chooseTemplateFinalized = true;
}

function finalizeTemplateComponents()
{
	global $db;
	global $ret;
	global $templateComponentsFinalized;
	global $ccgid;

	$componentsArray = $_POST["componentsArray"];

	$finalize = $db->prepare("INSERT INTO components(ccgid,name,type,layer,width,height,posX,posY) VALUES(?,?,?,?,?,?,?,?)");

	foreach($componentsArray as $component)
	{
		$component = json_decode($component);

		$finalize->execute(array(
			$ccgid,
			$component->name,
			$component->type,
			$component->layer,
			$component->width,
			$component->height,
			$component->posX,
			$component->posY
		));
	}

	$finalize->closeCursor();

	$templateComponentsFinalized = true;
}













/**************************************/
/**************************************/
/*         DEFINALIZE FUNCTIONS       */
/**************************************/
/**************************************/
function definalizeAll()
{
	global $chooseNameFinalized;
	global $chooseTemplateFinalized;
	global $templateComponentsFinalized;

	if($templateComponentsFinalized)
		definalizeTemplateComponents();

	if($chooseTemplateFinalized)
		definalizeChooseTemplate();

	if($chooseNameFinalized)
		definalizeChooseName();
}

function definalizeChooseName()
{
	global $db;
	global $ret;
	global $chooseNameFinalized;

	$ccgName = $_POST["ccgName"];

	$delete = $db->prepare("DELETE FROM ccgs WHERE name=?");
	$delete->execute(array($ccgName));
	$delete->closeCursor();

	$chooseNameFinalized = false;
}

function definalizeChooseTemplate()
{
	global $chooseTemplateFinalized;
	global $thisPublicId;

	FileDir::rrmdir($thisPublicId);

	$chooseTemplateFinalized = false;
}

function definalizeTemplateComponents()
{
	global $db;
	global $ret;
	global $templateComponentsFinalized;
	global $ccgid;

	$db->query("DELETE FROM components WHERE ccgid='$ccgid'");

	$templateComponentsFinalized = false;
}

?>