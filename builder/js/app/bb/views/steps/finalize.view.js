define(
	[
		"backbone",
		"managers/view.manager",
		"managers/step.manager"
	],
function(Backbone, ViewManager, StepManager)
{
	var FinalizeView = Backbone.View.extend(
	{
		tagName: "div",

		checkReqFields: function(context)
		{

		},
		render: function(onComplete)
		{
			this.$el.html('<p style="margin: 0 auto; margin-top: 100px;">Finish Step</p>');
			onComplete();

			return this;
		},
		show: function()
		{

		},
		hide: function()
		{

		},
		finalize: function()
		{
			StepManager.finalizeAll(
			function(stepTitle)
			{
				console.log("finalized: " + stepTitle);
			},
			function(stepTitle, msg)
			{
				console.error(stepTitle + " - finalize - " + msg);
			});
		},
		deFinalize: function(start)
		{
			StepManager.deFinalizeAll(start,
			function(stepTitle)
			{
				console.log("definalized: " + stepTitle);
			},
			function(stepTitle, msg)
			{
				console.error(stepTitle + " - definalize - " + msg);
			});
		}
	});

	return FinalizeView;
});