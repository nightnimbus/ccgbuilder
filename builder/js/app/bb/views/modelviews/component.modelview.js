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

			this.listenTo(this.model, "change:name", function(model, name)
			{
				//self.$el.find(".component-name").text(name);
			});

			this.listenTo(this.model, "change:selected", function(model, selected)
			{
				if(!selected)
				{
					//self.$el.removeClass("component-selected");
					//self.$el.addClass("component-default");
				}

				else
				{
					//self.$el.removeClass("component-default");
					//self.$el.addClass("component-selected");
				}

				ViewManager.views.templateComponents.renderCanvas();
			});

			this.listenTo(this.model, "change:x change:y", function(model, pos)
			{
				console.log("change:x change:y");
			});
		},
		render: function()
		{
			$("canvas" + this.canvasHelper.canvasSelector).drawRect(
			{
				x: this.model.get("x"),
				y: this.model.get("y"),
				width: this.model.get("width"),
				height: this.model.get("height"),
				fillStyle: this.model.get("fillColor"),
				fromCenter: false
			});

			var nameHeight = this.canvasHelper.getTextHeight(12);

			$("canvas" + this.canvasHelper.canvasSelector).drawText(
			{
				x: this.model.get("width") / 2,
				y: this.model.get("height") / 2 - (nameHeight / 2),
				text: this.model.get("name"),
				align: "left",
				fillStyle: "red",
				strokeStyle: "white",
				fontSize: "12pt",
				fontFamily: "Calibri",
				fromCenter: false
			});
		}
	});

	return ComponentModelView;
});