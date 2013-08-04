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
			type: "text",
			selected: false,
			mousedown: false,
			editing: false,
			deleting: false,
			mousedownDisplacement: {x: 0, y: 0},
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			layer: 3
		}
	});

	return ComponentModel;
});