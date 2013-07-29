define(
	[
		"jquery",
		"backbone",
		"managers/step.manager"
	],
function($, Backbone, StepManager)
{
	var StepButtonsView = Backbone.View.extend(
	{
		el: "#step-buttons",
		events:
		{
			"click #backButton": "prev",
			"click #nextButton": "next"
		},

		render: function()
		{
			var html = '' +
			'<button id="backButton" class="btn btn-primary btn-large pull-left">Back</button>' +
			'<button id="nextButton" class="btn btn-primary btn-large pull-right">Next</button>';

			this.$el.html(html);
		},
		updateButtonStates: function()
		{
			if(StepManager.currentStep == 0)
				this.disableBackButton();
			else
				this.enableBackButton();

			// If on finalize step.
			if(StepManager.currentStep == StepManager.steps.length-1)
			{
				this.disableBackButton();
				this.disableNextButton();
			}

			if(StepManager.currentStep >= StepManager.steps.length-2)
				$("#nextButton").text("Finish");
			else
				$("#nextButton").text("Next");
		},
		prev: function()
		{
			StepManager.prev();
			this.updateButtonStates();
		},
		next: function()
		{
			StepManager.next();
			this.updateButtonStates();

			// Call the final step's finalize method to finalize all steps.
			if(StepManager.currentStep == StepManager.steps.length-1)
				StepManager.steps[StepManager.currentStep].finalize();
		},
		enableBackButton: function()
		{
			$("#backButton").prop("disabled", false);
		},
		disableBackButton: function()
		{
			$("#backButton").prop("disabled", true);
		},
		enableNextButton: function()
		{
			$("#nextButton").prop("disabled", false);
		},
		disableNextButton: function()
		{
			$("#nextButton").prop("disabled", true);
		},
		enableButtons: function()
		{
			this.enableNextButton();
			this.enableBackButton();
		},
		disableButtons: function()
		{
			this.disableNextButton();
			this.disableBackButton();
		}
	});

	return StepButtonsView;
});