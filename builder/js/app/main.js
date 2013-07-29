define(
	[
		"jquery",
		"managers/step.manager",
		"managers/view.manager",
		"bb/views/step-buttons.view",
		"bb/views/steps/choose-name.view",
		"bb/views/steps/choose-template.view",
		"bb/views/steps/template-components.view",
		"bb/views/steps/finalize.view",
		"jqueryui"
	],
function(
	$,
	StepManager,
	ViewManager,
	StepButtonsView,
	ChooseNameView,
	ChooseTemplateView,
	TemplateComponentsView,
	FinalizeView)
{
	$(function()
	{
		console.log("App initializing...");

		ViewManager.views.stepButtons = new StepButtonsView();
		ViewManager.views.stepButtons.render();


		// Steps
		ViewManager.views.chooseName = new ChooseNameView();
		StepManager.addStep(ViewManager.views.chooseName);
		
		ViewManager.views.chooseTemplate = new ChooseTemplateView();
		StepManager.addStep(ViewManager.views.chooseTemplate);

		ViewManager.views.templateComponents = new TemplateComponentsView();
		StepManager.addStep(ViewManager.views.templateComponents);

		ViewManager.views.finalize = new FinalizeView();
		StepManager.addStep(ViewManager.views.finalize);


		// Update button states after steps initialization
		ViewManager.views.stepButtons.updateButtonStates();


		//StepManager.preRenderAll("#step-content");
		StepManager.start("#step-content");

		// Hide Loading Gif
		$("#loading-templates").hide();

		console.log("App initialized!");
	}());
});