define(
	[
		"jquery",
		"backbone",
		"managers/hbs.manager",
		"managers/step.manager",
		"managers/view.manager",
		"helpers/canvas.helper",
		"genlib/objectevent.class"
	],
function(
	$,
	Backbone,
	HbsManager,
	StepManager,
	ViewManager,
	CanvasHelper,
	ObjectEvent)
{
	var TemplateComponentsView = Backbone.View.extend(
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

			this.selectors.canvas = "componentsCanvas";
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

				HbsManager.loadTemplate("js/app/hbs/step-templateComponents.hbs",
				function(template)
				{
					self.$el.html(template());

					self.canvasHelper = new CanvasHelper(document.getElementById(self.selectors.canvas));
					self.componentsSubView.canvasHelper = self.canvasHelper;

					onComplete();
				});

				this.rendered = true;
			}

			else
				onComplete();

			return this;
		},
		renderCanvas: function(cardTemplate)
		{
			this.canvasHelper.drawImage(cardTemplate, 0, 0);
		},
		show: function()
		{
			this.initTemplatePreview();
		},
		hide: function()
		{

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