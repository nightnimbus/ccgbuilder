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
	var Step = Backbone.View.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		reqFields: {},
		selectors: {},
		stepTitle: "Step",
		events:
		{

		},

		initialize: function()
		{
			// define reqFields here
			// define selectors here
		},
		checkReqFields: function(context)
		{
			/*if(
				context.someReqField
				)
				ViewManager.views.stepButtons.enableNextButton();
			else
				ViewManager.views.stepButtons.disableNextButton();*/
		},
		render: function(onComplete)
		{
			if(this.rendered == false)
			{
				var self = this;

				HbsManager.loadTemplate("js/app/boilerplates/hbs/step.hbs",
				function(template)
				{
					self.$el.html(template());
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

		},
		hide: function()
		{

		},
		finalize: function(onSuccess, onError)
		{
			var self = this;

			$.ajax(
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
			});
		},
		deFinalize: function()
		{
			var self = this;

			$.ajax(
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
			});
		},
		onPreventDefault: function(e)
		{
			e = e.originalEvent || e;

			e.preventDefault();
			e.stopPropagation();

			return false;
		}
	});

	return Step;
});