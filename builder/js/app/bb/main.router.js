define(
	[
		"backbone",
		"managers/view.manager"
	],
function(Backbone, ViewManager)
{
	var MainRouter = Backbone.Router.extend(
	{
		routes:
		{
			"": "index"
		},

		boot: function(el)
		{
			// Initially render out each step, so that going back and next is instantaneous.
			// Also, it's easier to cache data since all the data is still there, just not being displayed.

			ViewManager.views.chooseTemplate = new ChooseTemplateView();
			ViewManager.views.chooseTemplate.render();
		},

		// Route Functions
		index: function()
		{
			// first step
		}
	});

	return new MainRouter;
});