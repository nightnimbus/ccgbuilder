define(
	[
		"jquery",
		"backbone",
		"shared/enums/position.enum",
		"shared/enums/keys.enum",
		"shared/classes/globals.class",
		"shared/classes/objectevent.class",
		"shared/classes/managers/view.manager",
		"shared/classes/managers/modelview.manager",
		"shared/classes/helpers/math.helper",
		"bb/views/modelviews/component.modelview",
		"bb/models/component.model",
		"classes/dialogs/editComponent.dialog",
		"classes/dialogs/deleteComponentYesNo.dialog"
	],
function(
	$,
	Backbone,
	Position,
	Keys,
	Globals,
	ObjectEvent,
	ViewManager,
	ModelViewManager,
	MathHelper,
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
		maxComponents: 8,
		backgroundLayer: 7,
		mouseCoords: {x: 0, y: 0},
		selectedComponent: false,
		isMouseDown: false,
		mouseUpStepButtons: false,
		mouseDownComponent: false,
		mouseScaleBox: false,
		mouseDisplacement:
		{
			x: 0,
			y: 0
		},
		selectors: {},
		events:
		{

		},

		initialize: function(options)
		{
			this.componentViewManager = new ModelViewManager();

			this.editComponentDialog = new EditComponentDialog("#editComponentDialog");
			this.deleteComponentYesNoDialog = new DeleteComponentYesNoDialog("#deleteComponentDialog");
		},
		attachEvents: function()
		{
			var self = this;

			// Have to register my own events because
			// backbone won't work with subview events for some reason.
			$(this.canvasHelper.canvasSelector).on("mousedown", function(e)
			{
				self.onMouseDownCanvas(e);
			});

			$(this.canvasHelper.canvasSelector).on("dblclick", function(e)
			{
				self.onDblClickCanvas(e);
			});

			$(ViewManager.views.stepButtons.selectors.backButton).on("mouseup", function(e)
			{
				self.mouseUpStepButtons = true;
			});

			$(ViewManager.views.stepButtons.selectors.nextButton).on("mouseup", function(e)
			{
				self.mouseUpStepButtons = true;
			});

			$("body").on("mouseup", function(e)
			{
				if(ViewManager.views.templateComponents.visible)
					self.onMouseUp(e);
				else
					self.mouseUpStepButtons = false;
			});

			$("body").on("mousemove", function(e)
			{
				if(ViewManager.views.templateComponents.visible)
					self.onMouseMove(e);
			});

			$("body").on("keydown", function(e)
			{
				if(ViewManager.views.templateComponents.visible)
					self.onKeyDown(e);
			});
		},
		detachEvents: function()
		{
			$(this.canvasHelper.canvasSelector).off("mousedown dblclick");
			$(ViewManager.views.stepButtons.selectors.backButton).off("mouseup");
			$(ViewManager.views.stepButtons.selectors.nextButton).off("mouseup");
			$("body").off("mouseup mousemove keydown");
		},
		render: function()
		{
			this.componentViewManager.renderAll();
		},
		addNewComponent: function()
		{
			if(this.componentViewManager.count < this.maxComponents)
			{
				var self = this;
				var name = "Component" + (this.componentViewManager.count + 1).toString();
				var layer = this.maxComponents;

				if(this.componentViewManager.count > 0)
				{
					layer = parseInt(this.componentViewManager.modelViewsArray[this.componentViewManager.count-1].model.get("layer")) + 1;
					if(layer == this.backgroundLayer)
						layer = this.backgroundLayer + 1;
				}

				this.componentViewManager.add(
					new ComponentModelView(
					{
						canvasHelper: self.canvasHelper,
						model: new ComponentModel(
						{
							name: name,
							x: 0, y: 0,
							width: self.canvasHelper.canvas.width / 2,
							minWidth: 30,
							height: 30,
							minHeight: 30,
							layer: layer
						})
					})
				);

				this.componentViewManager.modelViewsArray[this.componentViewManager.count-1].render();

				if(this.componentViewManager.count > 0)
				{
					ObjectEvent.changeObjAttr(
						ViewManager.views.templateComponents.reqFields,
						"hasComponents", true,
						ViewManager.views.templateComponents.checkReqFields);
				}
			}
		},
		isLayer: function(layer)
		{
			var isLayer = false;

			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				if(layer == this.componentViewManager.modelViewsArray[i].model.get("layer"))
				{
					isLayer = true;
					break;
				}
			}

			return isLayer;
		},
		onMouseDownCanvas: function(e)
		{
			this.isMouseDown = true;

			if(this.mouseScaleBox && this.selectedComponent)
				this.selectedComponent.model.set({scaling: true});

			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				var component = this.componentViewManager.modelViewsArray[i];

				if(MathHelper.pointWithinRect(
					this.mouseCoords.x, component.model.get("x"),
					this.mouseCoords.y, component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					if(e.which == Keys.LEFT_CLICK)
					{
						this.mouseDisplacement =
						{
							x: this.mouseCoords.x - component.model.get("x"),
							y: this.mouseCoords.y - component.model.get("y")
						}

						this.mouseDownComponent = component;
					}
				}
			}

			return false;
		},
		onDblClickCanvas: function(e)
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
			{
				var component = this.componentViewManager.modelViewsArray[i];

				if(MathHelper.pointWithinRect(
					this.mouseCoords.x, component.model.get("x"),
					this.mouseCoords.y, component.model.get("y"),
					component.model.get("width"),
					component.model.get("height")))
				{
					this.openEditComponentDialog(component);
				}
			}

			return false;
		},
		onMouseUp: function(e)
		{
			this.isMouseDown = false;

			if(!this.selectedComponent || !this.selectedComponent.model.get("scaling"))
			{
				if(this.mouseDownComponent)
				{
					this.deselectComponent(this.selectedComponent);
					this.selectComponent(this.mouseDownComponent);
				}

				else if(!this.mouseUpStepButtons)
					this.deselectComponent(this.selectedComponent);

				else
					this.mouseUpStepButtons = false;
			}

			else if(this.selectedComponent)
			{
				this.selectedComponent.model.set({scaling: false});
				this.mouseScaleBox = false;
			}

			this.mouseDownComponent = false;
			ViewManager.views.templateComponents.renderCanvas();

			return false;
		},
		onMouseMove: function(e)
		{
			if(!Globals.IS_MOBILE_DEVICE)
				this.mouseCoords = this.canvasHelper.getMouseCoords(e);

			if(this.selectedComponent)
			{
				if(!this.selectedComponent.model.get("scaling"))
				{
					this.mouseScaleBox = this.selectedComponent.scaleBoxManager.getScaleBoxByPoint(
						this.mouseCoords.x, this.mouseCoords.y);

					this.selectedComponent.scaleBoxManager.updateCursor(this.mouseScaleBox);
				}

				else
				{
					this.selectedComponent.scaleBoxManager.scaleParent(this.mouseCoords.x, this.mouseCoords.y, this.mouseScaleBox.position);
					ViewManager.views.templateComponents.renderCanvas();
				}
			}

			if(
				this.mouseDownComponent &&
				(!this.selectedComponent || !this.selectedComponent.model.get("scaling")))
			{
				this.deselectComponent(this.selectedComponent);
				this.selectComponent(this.mouseDownComponent);

				this.selectedComponent.translate(
					this.mouseCoords.x, this.mouseCoords.y, this.mouseDisplacement);

				ViewManager.views.templateComponents.renderCanvas();
			}

			return false;
		},
		onKeyDown: function(e)
		{
			if(this.selectedComponent)
			{
				// If e.which is any one of the arrow keys
				if(e.which >= 37 && e.which <= 40)
				{
					var step = 1;

					e.preventDefault();


					if(e.which == Keys.LEFT)
						this.selectedComponent.translate(this.selectedComponent.model.get("x") - step);

					else if(e.which == Keys.RIGHT)
						this.selectedComponent.translate(this.selectedComponent.model.get("x") + step);

					else if(e.which == Keys.UP)
						this.selectedComponent.translate(false, this.selectedComponent.model.get("y") - step);

					else if(e.which == Keys.DOWN)
						this.selectedComponent.translate(false, this.selectedComponent.model.get("y") + step);


					ViewManager.views.templateComponents.renderCanvas();
				}

				else if(e.which == Keys.DELETE)
				{
					if(!this.selectedComponent.model.get("editing"))
					{
						this.deleteComponentYesNoDialog.component = this.selectedComponent;

						$(this.deleteComponentYesNoDialog.selector + " [name='componentName']")
						.text(this.selectedComponent.model.get("name"));

						this.deleteComponentYesNoDialog.getDialog().dialog("open");
					}
				}

				else if(e.which == Keys.ENTER)
				{
					if(!this.selectedComponent.model.get("deleting"))
						this.openEditComponentDialog(this.selectedComponent);
				}
			}

			return false;
		},
		deselectComponent: function(component)
		{
			if(component)
			{
				component.model.set({selected: false});
				this.selectedComponent = false;
			}
		},
		deselectAllComponents: function()
		{
			for(var i = 0; i < this.componentViewManager.count; i++)
				this.componentViewManager.modelViewsArray[i].model.set({selected: false});
		},
		selectComponent: function(component)
		{
			if(component)
			{
				component.model.set({selected: true});
				this.selectedComponent = component;
			}
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
		}
	});

	return ComponentsSubView;
});