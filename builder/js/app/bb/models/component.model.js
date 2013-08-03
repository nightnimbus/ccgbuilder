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
			mousedown: false,
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			zIndex: 0,
		}
	});

	return ComponentModel;
});