define(
	[
		"jquery",
		"backbone",
		"managers/view.manager",
		"managers/modelview.manager",
		"bb/views/modelviews/component.modelview",
		"bb/models/component.model",
		"other/dialogs/editComponent.dialog",
		"other/dialogs/deleteComponentYesNo.dialog",
		"jqueryui"
	],
function(
	$,
	Backbone,
	ViewManager,
	ModelViewManager,
	ComponentModelView,
	ComponentModel,
	EditComponentDialog,
	DeleteComponentYesNoDialog
	)
{
	var ComponentsSubView = Backbone.View.extend(
	{
		componentViewManager: null,
		canvasHelper: null,
		maxComponents: 10,
		mouseCoords: {x: 0, y: 0},
		selectedComponent: null,
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

			this.editComponentDialog = new EditComponentDialog("#editComponentDialog");
			this.deleteComponentYesNoDialog = new DeleteComponentYesNoDialog("#deleteComponentDialog");

			// Have to register my own events because
			// backbone won't work with the mouse events for some reason.
			$(this.canvasHelper.canvasSelector).on("mousedown", function(e)
			{
				self.onMouseDownCanvas(e);
			});

			$(this.canvasHelper.canvasSelector).on("mouseup", function(e)
			{
				self.onMouseUpCanvas(e);
			});

			$(this.canvasHelper.canvasSelector).on("mousemove", function(e)
			{
				self.onMouseMoveCanvas(e);
			});

			$(this.canvasHelper.canvasSelector).on("dblclick", function(e)
			{
				self.onDblClickCanvas(e);
			});

			$("body").on("keydown", function(e)
			{
				self.onKeyDown(e);
			});

			this.editComponentDialog.initialize(this.componentViewManager);
			this.deleteComponentYesNoDialog.initialize(this.componentViewManager);
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
				var name = "Component" + (this.componentViewManager.count + 1).toString();

				this.componentViewManager.add(
					new ComponentModelView(
					{
						canvasHelper: self.canvasHelper,
						model: new ComponentModel(
						{
							name: name,
							x: 0, y: 0,
							width: self.canvasHelper.canvas.width / 2,
							height: 30
						})
					})
				);

				this.componentViewManager.modelViewsArray[this.componentViewManager.count-1].render();
			}
		},
		onMouseDownCanvas: function(e)
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				var component = this.componentViewManager.modelViewsArray[i];

				if(this.canvasHelper.pointWithinBounds(
					this.mouseCoords.x, this.mouseCoords.y,
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
								x: this.mouseCoords.x - component.model.get("x"),
								y: this.mouseCoords.y - component.model.get("y")
							}
						});
					}
				}
			}
		},
		onMouseUpCanvas: function(e)
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				var component = this.componentViewManager.modelViewsArray[i];

				if(this.canvasHelper.pointWithinBounds(
					this.mouseCoords.x, this.mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					if(component.model.get("mousedown"))
						this.selectComponent(component);
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
		onMouseMoveCanvas: function(e)
		{
			var mouseCoords = this.canvasHelper.getMouseCoords(e);
			this.mouseCoords = mouseCoords;

			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				var component = this.componentViewManager.modelViewsArray[i];

				if(component.model.get("mousedown"))
				{
					if(!component.model.get("selected"))
					{
						this.deselectAllComponents();
						this.selectComponent(component);
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
		onDblClickCanvas: function(e)
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				var component = this.componentViewManager.modelViewsArray[i];

				if(this.canvasHelper.pointWithinBounds(
					this.mouseCoords.x, this.mouseCoords.y,
					component.model.get("x"),
					component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					this.openEditComponentDialog(component);
				}
			}
		},
		onKeyDown: function(e)
		{
			var step = 3;

			// If e.which is any one of the arrow keys
			if(e.which >= 37 && e.which <= 40)
			{
				e.preventDefault();


				// left
				if(e.which == 37)
					this.selectedComponent.model.set({x: this.selectedComponent.model.get("x") - step});

				// right
				else if(e.which == 39)
					this.selectedComponent.model.set({x: this.selectedComponent.model.get("x") + step});

				// up
				else if(e.which == 38)
					this.selectedComponent.model.set({y: this.selectedComponent.model.get("y") - step});

				// down
				else if(e.which == 40)
					this.selectedComponent.model.set({y: this.selectedComponent.model.get("y") + step});


				ViewManager.views.templateComponents.renderCanvas();
			}

			// delete key
			else if(e.which == 46)
			{
				if(!this.selectedComponent.model.get("editing"))
				{
					this.deleteComponentYesNoDialog.component = this.selectedComponent;

					$(this.deleteComponentYesNoDialog.selector + " [name='componentName']")
					.text(this.selectedComponent.model.get("name"));

					this.deleteComponentYesNoDialog.getDialog().dialog("open");
				}
			}

			// enter key
			else if(e.which == 13)
			{
				if(!this.selectedComponent.model.get("deleting"))
					this.openEditComponentDialog(this.selectedComponent);
			}
		},
		deselectAllComponents: function()
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
				this.componentViewManager.modelViewsArray[i].model.set({selected: false});
		},
		selectComponent: function(component)
		{
			component.model.set({selected: true});
			this.selectedComponent = component;
		},
		openEditComponentDialog: function(component)
		{
			var name = component.model.get("name");
			var type = component.model.get("type");
			var layer = component.model.get("layer");

			$(this.editComponentDialog.selector + " [name='name']").val(name);
			$(this.editComponentDialog.selector + " [name='type'] option[value='" + type + "']").prop("selected", true);
			$(this.editComponentDialog.selector + " [name='layer']").val(layer);

			this.editComponentDialog.component = component;
			this.editComponentDialog.getDialog().dialog("open");
		},
		render: function()
		{
			this.componentViewManager.renderAll(null);
		}
	});

	return ComponentsSubView;
});