

###
define(
	[
		"jquery",
		"view.manager",
		"globals.class",
		"jqueryui"
	],
function(
	$,
	ViewManager,
	Globals)
{
	$(function()
	{
		console.log("App initializing...");

		Globals.initialize();

		require(["jqte"], function()
		{
			$(".editor").jqte();

			console.log("App initialized!");
		});
	});
});
###