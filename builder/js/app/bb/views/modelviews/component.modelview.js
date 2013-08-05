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
			// RECT
			var fillColor = "";

			if(this.model.get("type") == "text")
				fillColor = "#F00000";
			else if(this.model.get("type") == "image")
				fillColor = "#0A6800";

			if(this.model.get("selected"))
			{
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y"),
					width: this.model.get("width"),
					height: this.model.get("height"),
					fillStyle: fillColor,
					strokeWidth: 2,
					strokeStyle: "#FFF",
					fromCenter: false
				});
			}

			else
			{
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y"),
					width: this.model.get("width"),
					height: this.model.get("height"),
					fillStyle: fillColor,
					fromCenter: false
				});
			}


			// NAME
			var fontSize = 12;

			if(this.model.get("name").length > 15)
				fontSize = 9;

			var nameHeight = this.canvasHelper.getTextHeight(fontSize);

			fontSize = fontSize.toString() + "pt";

			this.canvasHelper.getCanvas().drawText(
			{
				x: this.model.get("x") + this.model.get("width") / 2,
				y: this.model.get("y") + this.model.get("height") / 2 - (nameHeight / 2),
				text: this.model.get("name"),
				align: "left",
				fillStyle: "red",
				strokeStyle: "white",
				fontSize: fontSize,
				fontFamily: "Arial",
				fromCenter: false
			});


			// SCALE BOXES
			if(this.model.get("selected"))
			{
				var numBoxes = 6;
				var boxWidth = 8;
				var boxHeight = 8;
				var color = "yellow";

				// top-left
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y"),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// top-middle
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x") + (this.model.get("width") / 2),
					y: this.model.get("y"),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// top-right
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x") + this.model.get("width"),
					y: this.model.get("y"),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// side-left
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y") + (this.model.get("height") / 2),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// side-right
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x") + this.model.get("width"),
					y: this.model.get("y") + (this.model.get("height") / 2),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// bottom-left
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y") + this.model.get("height"),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// bottom-middle
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x") + (this.model.get("width") / 2),
					y: this.model.get("y") + this.model.get("height"),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});

				// bottom-right
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x") + this.model.get("width"),
					y: this.model.get("y") + this.model.get("height"),
					width: boxWidth,
					height: boxHeight,
					fillStyle: color,
					fromCenter: true
				});
			}
		}
	});

	return ComponentModelView;
});