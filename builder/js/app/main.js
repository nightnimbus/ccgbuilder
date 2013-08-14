$(function()
{
	// Hide the canvas quickly.
	// Cannot have the canvas in a display: none;
	// within the DOM from the get-go with FlashCanvas.
	//$("#hiddenCanvas").hide();
});

define(
	[
		"jquery",
		"managers/step.manager",
		"managers/view.manager",
		"helpers/canvas.helper",
		"genlib/globals.class",
		"bb/views/step-buttons.view",
		"bb/views/steps/choose-name.step",
		"bb/views/steps/choose-template.step",
		"bb/views/steps/template-components.step",
		"bb/views/steps/finalize.step",
		"bb/views/subviews/components.subview",
		"bootstrap"
	],
function(
	$,
	StepManager,
	ViewManager,
	CanvasHelper,
	Globals,
	StepButtonsView,
	ChooseNameStep,
	ChooseTemplateStep,
	TemplateComponentsStep,
	FinalizeStep,
	ComponentsSubView)
{
	$(function()
	{
		console.log("App initializing...");

		Globals.initialize();

		if(!Globals.isLtIEVersion(9))
		{
			// Bootstrap and JQuery UI both define $.fn.button, so we always want to use JQuery UI's $.fn.button.
			// Bootstrap always loads after JQuery UI, so this will always work.
			if($.fn.button.noConflict)
				$.fn.button.noConflict();

			ViewManager.views.stepButtons = new StepButtonsView();
			ViewManager.views.stepButtons.render();

			// Steps
			ViewManager.views.chooseName = new ChooseNameStep();
			StepManager.addStep(ViewManager.views.chooseName);
			
			ViewManager.views.chooseTemplate = new ChooseTemplateStep();
			StepManager.addStep(ViewManager.views.chooseTemplate);

			ViewManager.views.templateComponents = new TemplateComponentsStep();
			ViewManager.views.templateComponents.componentsSubView = new ComponentsSubView();
			StepManager.addStep(ViewManager.views.templateComponents);

			ViewManager.views.finalize = new FinalizeStep();
			StepManager.addStep(ViewManager.views.finalize);


			// Update button states after steps initialization
			ViewManager.views.stepButtons.updateButtonStates();


			StepManager.start("#step-content");
			loadGeneralPolyfills();

			// Hide Loading Gif
			$("#loading-templates").hide();
		}

		console.log("App initialized!");
	});
});

function loadGeneralPolyfills()
{

}