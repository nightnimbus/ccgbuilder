define(
	[
	"backbone",
	"managers/view.manager"
	],
function(
	Backbone,
	ViewManager)
{
	var Step = Backbone.View.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		visible: false,
		loaded: false,
		reqFields: {},
		selectors: {},
		stepTitle: "Template Components",

		checkReqFields: function(context)
		{
			/*if(
				context.reqField
				)
				ViewManager.views.stepButtons.enableNextButton();
			else
				ViewManager.views.stepButtons.disableNextButton();*/

			ViewManager.views.stepButtons.disableNextButton();
		},
		show: function()
		{
			
		},
		hide: function()
		{

		},
		remove: function()
		{
			
		},
		loadPolyfills: function()
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
		}
	});

	return Step;
});