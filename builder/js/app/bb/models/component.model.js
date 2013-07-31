define(
	[
		"jquery",
		"backbone"
	],
function($, Backbone)
{
	var ComponentModel = Backbone.Model.extend(
	{
		defaults:
		{
			name: "",
			selected: false,
			fillColor: "#FF0000",
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			zIndex: 0,
			borderWidth: 0,
			borderColor: "#000000",
			fontString: "12pt Calibri",
			fontColor: "white"
		}
	});

	return ComponentModel;
});