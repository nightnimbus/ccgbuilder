define(
	[
		"jquery",
		"backbone",
		"managers/view.manager",
		"managers/modelview.manager",
		"bb/views/modelviews/component.modelview",
		"bb/models/component.model"
	],
function(
	$,
	Backbone,
	ViewManager,
	ModelViewManager,
	ComponentModelView,
	ComponentModel)
{
	var ComponentsSubView = Backbone.View.extend(
	{
		componentViewManager: null,
		canvasHelper: null,
		maxComponents: 10,
		events:
		{
			
		},

		initialize: function(options)
		{
			this.componentViewManager = new ModelViewManager();
		},
		attachEvents: function()
		{
			var self = this;
			var selector = "";

			if(this.canvasHelper == null)
				selector = "canvas";
			else
				selector = this.canvasHelper.canvasSelector;

			$(selector).on("mousedown", function(e)
			{
				self.onMouseDownCanvas(e, self);
			});

			$(selector).on("mouseup", function(e)
			{
				self.onMouseUpCanvas(e, self);
			});
		},
		detachEvents: function()
		{
			$.off(["mousedown,mouseup"], this.canvasHelper.canvasSelector);
		},
		addNewComponent: function()
		{
			if(this.componentViewManager.count < this.maxComponents)
			{
				var self = this;
				var name = "Component" + (self.componentViewManager.count + 1).toString();

				this.componentViewManager.add(
					new ComponentModelView(
					{
						canvasHelper: self.canvasHelper,
						model: new ComponentModel(
						{
							name: name,
							x: 0, y: 0,
							width: self.canvasHelper.canvas.width,
							height: 30,
							fillColor: "#FF0000"
						})
					})
				);

				this.componentViewManager.modelViewsArray[this.componentViewManager.count-1].render();
			}
		},
		onMouseDownCanvas: function(e, self)
		{
			var mouseCoords = self.canvasHelper.getMouseCoords(e);

			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];

				if(self.canvasHelper.pointWithinBounds(
					mouseCoords.x, mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					component.model.set({readyForSelect: true});
				}
			}
		},
		onMouseUpCanvas: function(e, self)
		{
			var mouseCoords = self.canvasHelper.getMouseCoords(e);

			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];
				component.model.set({selected: false});

				if(self.canvasHelper.pointWithinBounds(
					mouseCoords.x, mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					if(component.model.get("readyForSelect"))
					{
						alert("clicked " + component.model.get("name"));
						component.model.set({selected: true});
					}
				}

				else
					component.model.set({readyForSelect: false});
			}
		},
		render: function()
		{
			this.componentViewManager.renderAll(null, "zIndex");
		}
	});

	return ComponentsSubView;
});