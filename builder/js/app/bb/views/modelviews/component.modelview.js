define(
	[
		"backbone",
		"genlib/position.enum",
		"managers/hbs.manager",
		"managers/view.manager",
		"bb/views/modelviews/scaleBox.manager",
		"jcanvas"
	],
function(
	Backbone,
	Position,
	HbsManager,
	ViewManager,
	ScaleBoxManager)
{
	var ComponentModelView = Backbone.View.extend(
	{
		el: "#componentsCanvas",
		canvasHelper: null,
		scaleBoxManager: null,
		events:
		{

		},

		initialize: function(options)
		{
			if(typeof options !== "undefined")
				this.canvasHelper = options.canvasHelper;

			this.scaleBoxManager = new ScaleBoxManager(this.canvasHelper.getRawCanvas(), this.model);
			this.scaleBoxManager.initLayout(6, 6, "yellow",
			[
				Position.TOP_LEFT,
				Position.TOP_MID,
				Position.TOP_RIGHT,
				Position.MID_LEFT,
				Position.MID_RIGHT,
				Position.BOTTOM_LEFT,
				Position.BOTTOM_MID,
				Position.BOTTOM_RIGHT
			]);

			this.listenTo(this.model, "change:x change:y", function(model)
			{
				var boundX = 0;
				var boundY = 0;


				if(model.get("x") > (this.canvasHelper.getRawCanvas().width - model.get("width")))
					boundX = this.canvasHelper.getRawCanvas().width - model.get("width");

				else if(model.get("x") < 0)
					boundX = 0;

				else
					boundX = model.get("x");

				if(model.get("y") > (this.canvasHelper.getRawCanvas().height - model.get("height")))
					boundY = this.canvasHelper.getRawCanvas().height - model.get("height");

				else if(model.get("y") < 0)
					boundY = 0;

				else
					boundY = model.get("y");


				model.set({x: boundX, y: boundY});
			});

			this.listenTo(this.model, "change:width change:height", function(model)
			{
				var boundWidth = model.get("width");
				var boundHeight = model.get("height");

				if(model.get("width") <= model.get("minWidth"))
					boundWidth = model.get("minWidth");

				else if(model.get("x") + model.get("width") >= this.canvasHelper.getRawCanvas().width)
					boundWidth = this.canvasHelper.getRawCanvas().width - model.get("x");

				if(model.get("height") <= model.get("minHeight"))
					boundHeight = model.get("minHeight");

				else if(model.get("y") + model.get("height") >= this.canvasHelper.getRawCanvas().height)
					boundHeight = this.canvasHelper.getRawCanvas().height - model.get("y");

				model.set(
				{
					width: boundWidth,
					height: boundHeight
				});
			});
		},
		translate: function(toX, toY, displacement)
		{
			toX = (typeof toX !== "undefined" && toX != false) ? toX : this.model.get("x");
			toY = (typeof toY !== "undefined" && toY != false) ? toY : this.model.get("y");

			displacement =
			(typeof displacement === "object" && displacement != false)
			? displacement
			: {x: 0, y: 0};

			this.model.set(
			{
				x: toX - displacement.x,
				y: toY - displacement.y
			});
		},
		render: function()
		{
			// RECT
			var fillColor = "";
			var opacity = 1;
			var bBehindBackground =
			(this.model.get("layer") < ViewManager.views.templateComponents.componentsSubView.backgroundLayer)
			? true
			: false;

			if(this.model.get("type") == "text")
				fillColor = "#F00000";
			else if(this.model.get("type") == "image")
				fillColor = "#0A6800";

			if(bBehindBackground)
				opacity = 0.7;

			if(this.model.get("selected"))
			{
				this.canvasHelper.getCanvas().drawRect(
				{
					x: this.model.get("x"),
					y: this.model.get("y"),
					width: this.model.get("width"),
					height: this.model.get("height"),
					fillStyle: fillColor,
					strokeWidth: 1,
					strokeStyle: "#FFF",
					fromCenter: false,
					opacity: opacity
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
					fromCenter: false,
					opacity: opacity
				});
			}


			var fontSize = 10;

			if(this.model.get("name").length > 15)
				fontSize = 8;

			var nameHeight = this.canvasHelper.getTextHeight(fontSize);

			// NAME TEXT
			this.canvasHelper.drawText(
				fontSize + "pt Consolas",
				"white",
				this.model.get("name"),
				this.model.get("x") + this.model.get("width") / 2,
				this.model.get("y") + this.model.get("height") / 2,
				"center",
				true);


			fontSize = 8;
			var layerWidth = this.canvasHelper.getTextWidth(this.model.get("layer").toString());
			var layerHeight = this.canvasHelper.getTextHeight(fontSize);

			// LAYER TEXT
			this.canvasHelper.drawText(
				fontSize + "pt Consolas",
				"white",
				this.model.get("layer").toString(),
				(this.model.get("x") + this.model.get("width")) - layerWidth,
				this.model.get("y") + layerHeight - 4,
				"center",
				true);


			// SCALE BOXES
			if(this.model.get("selected"))
			{
				this.scaleBoxManager.renderAll(
					this.model.get("x"),
					this.model.get("y"),
					this.model.get("width"),
					this.model.get("height"));
			}
		}
	});

	return ComponentModelView;
});