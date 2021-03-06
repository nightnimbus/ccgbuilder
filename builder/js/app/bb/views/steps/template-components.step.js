define(
	[
		"jquery",
		"backbone",
		"shared/classes/managers/hbs.manager",
		"classes/managers/step.manager",
		"shared/classes/managers/view.manager",
		"shared/classes/helpers/canvas.helper",
		"shared/classes/globals.class",
		"shared/classes/objectevent.class",
		"bb/views/steps/step.view",
		"enums/component-type.enum",
		"jcanvas"
	],
function(
	$,
	Backbone,
	HbsManager,
	StepManager,
	ViewManager,
	CanvasHelper,
	Globals,
	ObjectEvent,
	Step,
	ComponentType)
{
	var TemplateComponentsStep = Step.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		requiredIndicator: false,
		reqFields: {},
		selectors: {},
		finalizeId: "templateComponentsFinalize",
		title: "Template Components",
		lastBgData: "",
		canvasHelper: null,
		componentsSubView: null,
		events:
		{
			"click #addComponentBtn": "onClickAddComponent"
		},

		initialize: function()
		{
			this.reqFields.hasComponents = false;

			this.selectors.canvas = "#componentsCanvas";
		},
		checkReqFields: function(context)
		{
			if(
				context.hasComponents
				)
				ViewManager.views.stepButtons.enableNextButton();
			else
				ViewManager.views.stepButtons.disableNextButton();
		},
		render: function(onComplete)
		{
			if(this.rendered == false)
			{
				var self = this;
				var html = '' +
				'<div class="main-content-header">' +
				    '<div class="row">' +
				        '<h2>Assign Template Components</h2>' +
				    '</div>' +
				'</div>' +

				'<div class="row">' +
				    '<span class="span12">' +
				    	'<div class="container-addComponent">' +
				    		'<button id="addComponentBtn" class="btn">Add Component</button>' +
				    	'</div>' +
				    	
				    	'<div>' +
				    		'<canvas id="componentsCanvas" width="300" height="400"></canvas>' +
				    	'</div>' +
				    '</span>' +
				'</div>' +
				'<div id="editComponentDialog" title="Edit Component">' +
					'<form>' +
						'<div class="container-dialog-messages"></div>' +
					 	'<fieldset>' +
						    '<label for="name">Name</label>' +
						    '<input type="text" name="name" maxlength="20" class="text ui-widget-content ui-corner-all" />' +
						    '<label for="type">Type</label>' +
						    '<select name="type">' +
						    	'<option value="text">Text</option>' +
						    	'<option value="image">Image</option>' +
						    '</select>' +
						    '<label for="layer">Layer</label>' +
						    '<input type="text" name="layer" maxlength="2" class="text ui-widget-content ui-corner-all" onkeypress="return isKeyNumerical(event);" />' +
						'</fieldset>' +
					'</form>' +
				'</div>' +
				'<div id="deleteComponentDialog" title="Delete This Component?">' +
					'<form>' +
						'<fieldset>' +
							'<p>Are you sure you want to <b>delete</b> "<span name="componentName"></span>"?</p>' +
						'</fieldset>' +
					'</form>' +
				'</div>';

				this.$el.html(html);

				// This doesn't even append to the body...
				// But it works if I have this here. Why? I have no fucking clue.
				$("body").append(this.el);

				var canvasSelector = this.selectors.canvas.split("#")[1];
				this.canvasHelper = new CanvasHelper(document.getElementById(canvasSelector));
				this.componentsSubView.canvasHelper = this.canvasHelper;

				this.componentsSubView.attachEvents();

				this.componentsSubView.editComponentDialog.initialize(this.componentsSubView.componentViewManager);
				this.componentsSubView.deleteComponentYesNoDialog.initialize(this.componentsSubView.componentViewManager);

				this.loadPolyfills();

				onComplete();
				this.rendered = true;
			}

			else
				onComplete();

			return this;
		},
		renderCanvas: function()
		{
			var self = this;
			this.canvasHelper.getCanvas().drawImage(
			{
				source: ViewManager.views.chooseTemplate.cardTemplateDataFront["300x400"],
				width: 300, height: 400,
				fromCenter: false,
				load: function()
				{
					self.componentsSubView.render();
 				}
			});
		},
		show: function()
		{
			this.initTemplatePreview();

			if(this.rendered)
				this.componentsSubView.attachEvents();

			if(!this.loaded)
			{
				this.loadPolyfills();
				this.loaded = true;
			}
		},
		hide: function()
		{
			if(this.rendered)
				this.componentsSubView.detachEvents();
		},
		remove: function()
		{
			if(this.loaded)
				this.componentsSubView.detachEvents();
		},
		loadPolyfills: function()
		{
			
		},
		onPreventDefault: function(e)
		{
			e = e.originalEvent || e;

			e.preventDefault();
			e.stopPropagation();

			return false;
		},
		onClickAddComponent: function(e)
		{
			this.componentsSubView.addNewComponent();
			return false;
		},
		initTemplatePreview: function()
		{
			var data = ViewManager.views.chooseTemplate.cardTemplateDataFront["300x400"];

			if(typeof data !== "undefined" && this.lastBgData != data)
			{
				this.renderCanvas();
				this.lastBgData = data;
			}
		}
	});

	return TemplateComponentsStep;
});