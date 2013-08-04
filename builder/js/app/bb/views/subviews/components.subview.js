define(
	[
		"jquery",
		"backbone",
		"managers/view.manager",
		"managers/modelview.manager",
		"bb/views/modelviews/component.modelview",
		"bb/models/component.model",
		"jqueryui"
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
		mouseCoords: {x: 0, y: 0},
		selectors: {},
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

			// Have to register my own events because
			// backbone won't work with the mouse events for some reason.
			$(this.canvasHelper.canvasSelector).on("mousedown", function(e)
			{
				self.onMouseDownCanvas(e, self);
			});

			$(this.canvasHelper.canvasSelector).on("mouseup", function(e)
			{
				self.onMouseUpCanvas(e, self);
			});

			$(this.canvasHelper.canvasSelector).on("mousemove", function(e)
			{
				self.onMouseMoveCanvas(e, self);
			});

			$(this.canvasHelper.canvasSelector).on("dblclick", function(e)
			{
				self.onDblClickCanvas(e, self);
			});

			$("body").on("keydown", function(e)
			{
				self.onKeyDown(e, self);
			});

			this.editComponentDialog.initialize(this.componentViewManager);
		},
		detachEvents: function()
		{
			$.off("mousedown", this.canvasHelper.canvasSelector);
			$.off("mouseup", this.canvasHelper.canvasSelector);
			$.off("mousemove", this.canvasHelper.canvasSelector);
			$.off("dblclick", this.canvasHelper.canvasSelector);
			$.off("keydown", "body");
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
							width: self.canvasHelper.canvas.width / 2,
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
			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];

				if(self.canvasHelper.pointWithinBounds(
					self.mouseCoords.x, self.mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					// left click
					if(e.which == 1)
					{
						component.model.set(
						{
							mousedown: true,
							mousedownDisplacement:
							{
								x: self.mouseCoords.x - component.model.get("x"),
								y: self.mouseCoords.y - component.model.get("y")
							}
						});
					}
				}
			}
		},
		onMouseUpCanvas: function(e, self)
		{
			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];

				if(self.canvasHelper.pointWithinBounds(
					self.mouseCoords.x, self.mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					if(component.model.get("mousedown"))
						component.model.set({selected: true});
				}

				else
				{
					if(!component.model.get("mousedown"))
						component.model.set({selected: false});
				}

				component.model.set({mousedown: false});
			}

			ViewManager.views.templateComponents.renderCanvas();
		},
		onMouseMoveCanvas: function(e, self)
		{
			var mouseCoords = self.canvasHelper.getMouseCoords(e);
			self.mouseCoords = mouseCoords;

			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];

				if(component.model.get("mousedown"))
				{
					if(!component.model.get("selected"))
					{
						self.deselectAllComponents();
						component.model.set({selected: true});
					}

					var mdd = component.model.get("mousedownDisplacement");
					var displacedX = mouseCoords.x - mdd.x;
					var displacedY = mouseCoords.y - mdd.y;

					component.model.set({x: displacedX, y: displacedY});
					component.model.set({isMoving: true});

					ViewManager.views.templateComponents.renderCanvas();
					break;
				}
			}
		},
		onDblClickCanvas: function(e, self)
		{
			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];

				if(self.canvasHelper.pointWithinBounds(
					self.mouseCoords.x, self.mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					self.openEditComponentDialog(component);
				}
			}
		},
		onKeyDown: function(e, self)
		{
			for(var i = 0; i < self.componentViewManager.count; i++)
			{
				var component = self.componentViewManager.modelViewsArray[i];

				if(component.model.get("selected"))
				{
					var step = 3;

					// If e.which is any one of the arrow keys
					if(e.which >= 37 && e.which <= 40)
					{
						e.preventDefault();


						// left
						if(e.which == 37)
							component.model.set({x: component.model.get("x") - step});

						// right
						else if(e.which == 39)
							component.model.set({x: component.model.get("x") + step});

						// up
						else if(e.which == 38)
							component.model.set({y: component.model.get("y") - step});

						// down
						else if(e.which == 40)
							component.model.set({y: component.model.get("y") + step});


						ViewManager.views.templateComponents.renderCanvas();
					}

					break;
				}
			}
		},
		deselectAllComponents: function()
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
				this.componentViewManager.modelViewsArray[i].model.set({selected: false});
		},
		registerEditComponentDialog: function()
		{
			var self = this;

			/*$(this.selectors.editComponentDialog).dialog(
			{
				autoOpen: false,
				width: 300,
				height: 350,
				modal: true,
				resizable: false,
				buttons:
				{
					"Update": function()
					{
						var thisSelector = "#" + $(this).attr("id");
						var name = $(thisSelector + " [name='name']").val();
						var type = $(thisSelector + " [name='type'] option:selected").attr("value");
						var layer = $(thisSelector + " [name='layer']").val();
						var component = self.componentViewManager.modelViews[$(thisSelector + " [name='componentCID']").val()];

						// If nothing changes, then don't update.
						if(name != component.model.get("name") && name.length > 0)
							component.model.set({name: name});

						if(type != component.model.get("type"))
							component.model.set({type: type});

						if(layer != component.model.get("layer"))
							component.model.set({layer: layer});

						$(this).dialog("close");
					},
					Cancel: function()
					{
						$(this).dialog("close");
					}
				},
				close: function()
				{
					ViewManager.views.templateComponents.renderCanvas();
				}
			});*/
		},
		openEditComponentDialog: function(component)
		{
			var name = component.model.get("name");
			var type = component.model.get("type");
			var layer = component.model.get("layer");
			var cid = component.model.cid;

			$(this.editComponentDialog.selector + " [name='name']").val(name);
			$(this.editComponentDialog.selector + " [name='type'] option[value='" + type + "']").prop("selected", true);
			$(this.editComponentDialog.selector + " [name='layer']").val(layer);
			$(this.editComponentDialog.selector + " [name='componentCID']").val(cid);

			this.editComponentDialog.getDialog().dialog("open");
		},
		render: function()
		{
			this.componentViewManager.renderAll(null);
		}
	});

	return ComponentsSubView;
});