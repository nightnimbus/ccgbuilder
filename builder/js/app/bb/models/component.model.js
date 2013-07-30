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
			width: 200,
			height: 100,
			pos:
			{
				top: 0,
				left: 0,
				bottom: 0,
				right: 0
			}
		}
	});

	return ComponentModel;
});