require(["jquery", "backbone"], function($, Backbone)
{
	defaults:
	[
		name: "",
		selected: false,
		pos:
		{
			top: 0,
			left: 0,
			bottom: 0,
			right: 0
		}
	],

	initialize: function()
	{
		this.on("change:name", function(model, name)
		{
			$("#component-name").text(name);
		});

		this.on("change:selected", function(model, selected)
		{
			if(!selected)
			{
				$("#container-component").removeClass("component-selected");
				$("#container-component").addClass("component-default");
			}

			else
			{
				$("#container-component").removeClass("component-default");
				$("#container-component").addClass("component-selected");
			}
		});

		this.on("change:pos", function(model, pos)
		{
			var finalPos =
			{
				top: 0,
				left: 0,
				bottom: 0,
				right: 0
			};

			
			
			$("#container-component").css(
			{
				"top": pos["top"],
				"left": pos["left"],
				"bottom": pos["bottom"],
				"right": pos["right"]
			});
		});
	},
	render: function()
	{

	}
});