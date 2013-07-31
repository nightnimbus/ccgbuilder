define(
	[
		"backbone",
		"managers/hbs.manager",
		"managers/view.manager",
		"transform"
	],
function(
	Backbone,
	HbsManager,
	ViewManager)
{
	var ComponentModelView = Backbone.View.extend(
	{
		canvasHelper: null,
		events:
		{
			"mousedown #componentsCanvas": "onMouseDownCanvas",
			"mouseup #componentsCanvas": "onMouseUpCanvas"
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

				ViewManager.views.templateComponents.componentsSubView.render();
			});

			this.listenTo(this.model, "change:x change:y", function(model, pos)
			{
				console.log("change:x change:y");
			});
		},
		onMouseDownCanvas: function(e)
		{
			var mouseCoords = this.canvasHelper.withinBounds(e);
			if(this.canvasHelper.withinBounds(
				mouseCoords.x, mouseCoords.y,
				this.model.get("x"),
				this.model.get("y"),
				this.model.get("width"),
				this.model.get("height")))
			{
				this.model.set({selected: true});
			}

			return false;
		},
		onMouseDownCanvas: function(e)
		{
			var mouseCoords = this.canvasHelper.withinBounds(e);
			if(this.canvasHelper.withinBounds(
				mouseCoords.x, mouseCoords.y,
				this.model.get("x"),
				this.model.get("y"),
				this.model.get("width"),
				this.model.get("height")))
			{
				this.model.set({selected: false});
			}

			console.log(this.model.get("name"));

			return false;
		},
		render: function()
		{
			this.canvasHelper.drawRect(
				this.model.get("fillColor"),
				this.model.get("x"), this.model.get("y"),
				this.model.get("width"), this.model.get("height"),
				this.model.get("borderWidth"), this.model.get("borderColor"));

			this.canvasHelper.drawText(
				this.model.get("fontString"),
				this.model.get("fontColor"),
				this.model.get("name"),
				this.model.get("x") + this.model.get("width") / 2,
				this.model.get("y") + (this.model.get("height") / 2) + 5,
				"center");
		}
	});

	return ComponentModelView;
});