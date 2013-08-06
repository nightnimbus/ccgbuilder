define(
	[
		"jquery",
		"managers/step.manager",
		"managers/view.manager",
		"genlib/globals.class",
		"bb/views/step-buttons.view",
		"bb/views/steps/choose-name.view",
		"bb/views/steps/choose-template.view",
		"bb/views/steps/template-components.view",
		"bb/views/steps/finalize.view",
		"bb/views/subviews/components.subview",
		"jqueryui",
		"bootstrap"
	],
function(
	$,
	StepManager,
	ViewManager,
	Globals,
	StepButtonsView,
	ChooseNameView,
	ChooseTemplateView,
	TemplateComponentsView,
	FinalizeView,
	ComponentsSubView)
{
	$(function()
	{
		console.log("App initializing...");

		Globals.initialize();

		// Bootstrap and JQuery UI both define $.fn.button, so we always want to use JQuery UI's $.fn.button.
		// Bootstrap always loads after JQuery UI, so this will always work.
		if($.fn.button.noConflict)
			$.fn.button.noConflict();

		ViewManager.views.stepButtons = new StepButtonsView();
		ViewManager.views.stepButtons.render();

		// Steps
		ViewManager.views.chooseName = new ChooseNameView();
		StepManager.addStep(ViewManager.views.chooseName);
		
		ViewManager.views.chooseTemplate = new ChooseTemplateView();
		StepManager.addStep(ViewManager.views.chooseTemplate);

		ViewManager.views.templateComponents = new TemplateComponentsView();
		ViewManager.views.templateComponents.componentsSubView = new ComponentsSubView();
		StepManager.addStep(ViewManager.views.templateComponents);

		ViewManager.views.finalize = new FinalizeView();
		StepManager.addStep(ViewManager.views.finalize);


		// Update button states after steps initialization
		ViewManager.views.stepButtons.updateButtonStates();


		StepManager.start("#step-content");


		// Hide Loading Gif
		$("#loading-templates").hide();

		console.log("App initialized!");
	}());
});