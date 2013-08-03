define(
	[
		"jquery",
		"backbone",
		"managers/hbs.manager",
		"managers/step.manager",
		"managers/view.manager",
		"helpers/canvas.helper",
		"genlib/objectevent.class",
		"bb/views/steps/step.view",
		"jcanvas"
	],
function(
	$,
	Backbone,
	HbsManager,
	StepManager,
	ViewManager,
	CanvasHelper,
	ObjectEvent,
	Step)
{
	var TemplateComponentsView = Step.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		reqFields: {},
		selectors: {},
		stepTitle: "Template Components",
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
				        '<h1>Assign Template Components</h1>' +
				    '</div>' +
				'</div>' +

				'<div class="row">' +
				    '<span class="span12">' +
				    	'<div class="container-addComponent">' +
				    		'<button id="addComponentBtn" class="btn btn-large">Add Component</button>' +
				    	'</div>' +
				    	
				    	'<div>' +
				    		'<canvas id="componentsCanvas" width="300" height="400"></canvas>' +
				    	'</div>' +
				    '</span>' +
				'</div>';

				this.$el.html(html);

				// This doesn't even append to the body...
				// But it works if I have this here. Why? I have no fucking clue.
				$("body").append(this.el);

				var canvasSelector = this.selectors.canvas.split("#")[1];
				this.canvasHelper = new CanvasHelper(document.getElementById(canvasSelector));
				this.componentsSubView.canvasHelper = this.canvasHelper;
				this.componentsSubView.attachEvents();

				onComplete();
				this.rendered = true;
			}

			else
				onComplete();

			return this;
		},
		renderCanvas: function()
		{
			$(this.selectors.canvas).drawImage(
			{
				source: ViewManager.views.chooseTemplate.cardTemplateData["300x400"],
				fromCenter: false
			});

			this.componentsSubView.render();
		},
		show: function()
		{
			this.initTemplatePreview();
		},
		hide: function()
		{

		},
		remove: function()
		{
			this.componentsSubView.detachEvents();
		},
		finalize: function(onSuccess, onError)
		{
			var self = this;

			/*$.ajax(
			{
				url: "php/step.finalize.ajax.php",
				method: "POST",
				dataType: "json",
				timeout: 5000,
				data:
				{
					
				}
			})
			.done(function(data)
			{
				onSuccess();
			})
			.fail(function()
			{
				onError("Ajax request failed.");
			});*/
		},
		deFinalize: function()
		{
			var self = this;

			/*$.ajax(
			{
				url: "php/step.definalize.ajax.php",
				method: "POST",
				dataType: "json",
				timeout: 5000,
				data:
				{
					
				}
			})
			.done(function(data)
			{
				onSuccess();
			})
			.fail(function()
			{
				onError("Ajax request failed.");
			});*/
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
			var data = ViewManager.views.chooseTemplate.cardTemplateData["300x400"];

			if(typeof data !== "undefined" && this.lastBgData != data)
			{
				this.renderCanvas(data);
				this.lastBgData = data;
			}
		}
	});

	return TemplateComponentsView;
});