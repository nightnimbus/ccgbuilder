define([
	"jquery",
	"backbone",
	"managers/hbs.manager",
	"managers/view.manager",
	"genlib/objectevent.class"],
function(
	$,
	Backbone,
	HbsManager,
	ViewManager,
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
		lastBgUrl: "",
		events:
		{
			"click #addComponentBtn": "onClickAddComponent"
		},

		initialize: function()
		{
			this.reqFields.hasComponents = false;

			this.selectors.templatePreview = "#componentsTemplatePreview";
		},
		checkReqFields: function(context)
		{
			if(
				context.hasComponents
				)
				ViewManager.views.stepButtons.enableNextButton();
			else
				ViewManager.views.stepButtons.enableNextButton();
		},
		render: function(onComplete)
		{
			if(this.rendered == false)
			{
				var self = this;

				HbsManager.loadTemplate("js/app/hbs/step-templateComponents.hbs",
				function(template)
				{
					self.$el.html(HbsManager.templates["step-templateComponents"]());
					onComplete();
				});

				this.rendered = true;
			}

			else
				onComplete();

			return this;
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
			
		},
		initTemplatePreview: function()
		{
			var data = ViewManager.views.chooseTemplate.cardTemplateData["300x400"];
			var url = "url(" + data + ") no-repeat center";

			if(typeof data !== "undefined" && this.lastBgUrl != url)
			{
				$(this.selectors.templatePreview).css("background", url);
				this.lastBgUrl = url;
			}
		}
	});

	return TemplateComponentsView;
});