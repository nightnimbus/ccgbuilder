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
			editing: false,
			deleting: false,
			scaling: false,
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			minWidth: 200,
			minHeight: 100,
			layer: 3
		}
	});

	return ComponentModel;
});