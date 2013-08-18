define(
	[
		"jquery",
		"genlib/async.class"
	],
function($, ASync)
{
	var StepManager =
	{
		steps: [],
		currentStep: 0,
		stepContentSelector: "",
		stepGlobalSelector: "",
		preRendered: false,

		addStep: function(step)
		{
			if(typeof step !== "undefined")
				this.steps.push(step);
		},
		start: function(stepGlobalEl, stepContentEl)
		{
			this.stepContentSelector = stepContentEl;
			this.stepGlobalSelector = stepGlobalEl;
			this.showStep(0);
		},
		next: function()
		{
			if(this.currentStep < this.steps.length-1)
			{
				this.hideStep(this.currentStep);
				this.currentStep++;
				this.showStep(this.currentStep);
			}
		},
		prev: function()
		{
			if(this.currentStep > 0)
			{
				this.hideStep(this.currentStep);
				this.currentStep--;
				this.showStep(this.currentStep);
			}
		},
		showStep: function(stepIndex)
		{
			if(stepIndex >= 0 && stepIndex < this.steps.length)
			{
				var self = this;

				this.renderStep(stepIndex, function()
				{
					if(self.steps[stepIndex].requiredIndicator)
					{
						$(self.stepContentSelector).css("height", "80%");
						$(self.stepGlobalSelector).fadeIn(300);
					}

					self.steps[stepIndex].checkReqFields(self.steps[stepIndex].reqFields);
					self.steps[stepIndex].$el.css("display", "block");
					self.steps[stepIndex].visible = true;
					self.steps[stepIndex].show();
				});
			}
		},
		hideStep: function(stepIndex)
		{
			if(stepIndex >= 0 && stepIndex < this.steps.length && this.steps[stepIndex].rendered)
			{
				$(this.stepGlobalSelector).hide();
				$(this.stepContentSelector).css("height", "90%");

				this.steps[stepIndex].checkReqFields(this.steps[stepIndex].reqFields);
				this.steps[stepIndex].$el.css("display", "none");
				this.steps[stepIndex].visible = false;
				this.steps[stepIndex].hide();
			}
		},
		renderStep: function(stepIndex, onComplete)
		{
			if(stepIndex >= 0 && stepIndex < this.steps.length && this.stepContentSelector.length > 0)
			{
				onComplete = (typeof onComplete === "function") ? onComplete : function(){};

				if(!this.steps[stepIndex].rendered)
					$(this.stepContentSelector).append(this.steps[stepIndex].render(onComplete).el);
				else
					onComplete();
			}
		},
		preRenderAll: function(stepContentEl)
		{
			if(this.preRendered == false)
			{
				var frag = document.createDocumentFragment();

				for(var i = 0; i < this.steps.length; i++)
				{
					if(i > 0)
						this.hideStep(i);

					frag.appendChild(this.steps[i].render().el);
				}

				this.showStep(0);

				$(stepContentEl).html(frag);
				this.preRendered = true;
			}
		},
		finalizeAll: function(onFinalizedStep, onError, onComplete)
		{
			var self = this;

			// defaults
			var onFinalizedStep = (typeof onFinalizedStep === "function") ? onFinalizedStep : function(stepTitle){};
			var onError = (typeof onError === "function") ? onError : function(stepTitle, msg){};
			var onComplete = (typeof onComplete === "function") ? onComplete : function(){};

			// this.steps.length-1 to not include the finalization step
			ASync.syncLoop(this.steps.length-1, function(loop)
			{
				var step = self.steps[loop.iteration()];

				step.finalize(function()
				{
					onFinalizedStep(step);
					loop.next();
				},
				function(msg)
				{
					onError(step, msg);

					// Definalizing the step that failed as well
					// as the finalized steps just to be on the safe side
					self.steps[self.steps.length-1].deFinalize(loop.iteration());

					loop.breakLoop(false);
				});
			},
			function()
			{
				self.cleanupFinalization();
				onComplete();
			});
		},
		deFinalizeAll: function(start, onSuccess, onError)
		{
			var self = this;

			// defaults
			var start = (typeof start !== "undefined") ? start : 0;
			var onSuccess = (typeof onSuccess === "function") ? onSuccess : function(stepTitle){};
			var onError = (typeof onError === "function") ? onError : function(stepTitle, msg){};

			ASync.reverseSyncLoop(start+1, function(loop)
			{
				var step = self.steps[loop.iteration()];
				
				step.deFinalize(function()
				{
					onSuccess(step.stepTitle);
					loop.next();
				},
				function(msg)
				{
					onError(step.stepTitle, msg);
					loop.next();
				});
			});
		},
		cleanupFinalization: function()
		{
			for(var i = 0; i < this.steps.length-1; i++)
			{
				this.steps[i].remove();
				this.steps[i].$el.remove(); // Cleans up js events so no mem leaks. Also removes the DOM element, so DOM reflows happen.
			}
		}
	};

	return StepManager;
});