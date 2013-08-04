define(
	[
		"backbone",
		"managers/hbs.manager",
		"managers/view.manager",
		"jcanvas"
	],
function(
	Backbone,
	HbsManager,
	ViewManager)
{
	var ComponentModelView = Backbone.View.extend(
	{
		el: "#componentsCanvas",
		canvasHelper: null,
		events:
		{

		},

		initialize: function(options)
		{
			if(typeof options !== "undefined")
				this.canvasHelper = options.canvasHelper;

			var self = this;

			this.listenTo(this.model, "change:x change:y", function(model)
			{
				var boundX = 0;
				var boundY = 0;


				if(model.get("x") > (this.canvasHelper.canvas.width - model.get("width")))
					boundX = this.canvasHelper.canvas.width - model.get("width");
				else if(model.get("x") < 0)
					boundX = 0;
				else
					boundX = model.get("x");

				if(model.get("y") > (this.canvasHelper.canvas.height - model.get("height")))
					boundY = this.canvasHelper.canvas.height - model.get("height");
				else if(model.get("y") < 0)
					boundY = 0;
				else
					boundY = model.get("y");


				self.model.set({x: boundX, y: boundY});
			});
		},
		render: function()
		{
			if(this.model.get("selected"))
			{
				$(this.canvasHelper.canvasSelector).drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y"),
					width: this.model.get("width"),
					height: this.model.get("height"),
					fillStyle: this.model.get("fillColor"),
					strokeWidth: 2,
					strokeStyle: "#FFF",
					fromCenter: false
				});
			}

			else
			{
				$(this.canvasHelper.canvasSelector).drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y"),
					width: this.model.get("width"),
					height: this.model.get("height"),
					fillStyle: this.model.get("fillColor"),
					fromCenter: false
				});
			}

			var fontSize = "12pt";
			var nameHeight = this.canvasHelper.getTextHeight(12);

			if(this.model.get("name").length > 15)
				fontSize = "9pt";

			$(this.canvasHelper.canvasSelector).drawText(
			{
				x: this.model.get("x") + this.model.get("width") / 2,
				y: this.model.get("y") + this.model.get("height") / 2 - (nameHeight / 2),
				text: this.model.get("name"),
				align: "left",
				fillStyle: "red",
				strokeStyle: "white",
				fontSize: fontSize,
				fontFamily: "Calibri",
				fromCenter: false
			});
		}
	});

	return ComponentModelView;
});