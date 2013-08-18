define(
	[
		"jquery",
		"backbone",
		"managers/view.manager",
		"managers/step.manager",
		"bb/views/steps/step.view",
		"bb/models/component-type.enum",
	],
function(
	$,
	Backbone,
	ViewManager,
	StepManager,
	Step,
	ComponentType)
{
	var FinalizeStep = Step.extend(
	{
		tagName: "div",
		selectors: {},
		pendingString: "",
		finalizedString: "",
		notFinalizedString: "",
		errorString: "",


		initialize: function()
		{
			this.selectors.finalizing = "#finalizing";
			this.selectors.finalizingEllipse = "#finalizingEllipse";
			this.selectors.finalizingErrorBox = "#finalizingErrorBox";
			this.selectors.finalizingButtons = "#finalizingButtons";
			this.selectors.finalizingButtonsError = "#finalizingButtonsError";

			this.pendingString = "Pending";
			this.finalizedString = "Finalized";
			this.notFinalizedString = "Not Finalized";
			this.errorString = "Error Finalizing";
		},
		render: function(onComplete)
		{
			var html =
			'<div class="main-content-header">' +
			    '<div class="row">' +
			        '<h2>Finalize</h2>' +
			    '</div>' +
			'</div>' +

			'<div style="margin-top: 7%;">' +
				'<div class="row">' +
					'<span class="span12">' +
						'<div id="finalizing">Finalizing</div>' +
						'<div id="finalizingEllipse" style="width: 1px;">...</div>' +
						'<div id="finalizingErrorBox" class="validator validator-fail" style="display: none; margin-top: 6%;">' +
							'Oops! Our database may be down. We are so sorry! :\'(' +
						'</div>' +
						'<div id="finalizingButtons" style="display: none;">' +
							'<div><button class="btn btn-primary btn-finalize">Add Cards</button></div>' +
							'<div><button class="btn btn-primary btn-finalize">View Your CCG</button></div>' +
						'</div>' +
						'<div id="finalizingButtonsError" style="display: none;">' +
							'<button class="btn btn-primary btn-finalize">Retry</button>' +
						'</div>' +
					'</span>' +
				'</div>' +
			'</div>';

			this.$el.html(html);
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
			var self = this;


			// Parse/make some finalization data.
			var componentsArray = [];
			var modelViewsArray = ViewManager.views.templateComponents.componentsSubView.componentViewManager.modelViewsArray;

			for(var i = 0; i < modelViewsArray.length; i++)
			{
				componentsArray.push(JSON.stringify(
				{
					name: modelViewsArray[i].model.get("name"),
					type: ComponentType.getComponentType(modelViewsArray[i].model.get("type")),
					layer: modelViewsArray[i].model.get("layer"),
					width: modelViewsArray[i].model.get("width"),
					height: modelViewsArray[i].model.get("height"),
					posX: modelViewsArray[i].model.get("x"),
					posY: modelViewsArray[i].model.get("y")
				}));
			}



			var ellipseInterval = setInterval(function()
			{
				var text = $(self.selectors.finalizingEllipse).text();

				if(text.length < 3)
					$(self.selectors.finalizingEllipse).append('.');
				else
					$(self.selectors.finalizingEllipse).text('.');
			}, 200);


			$.ajax(
			{
				url: "php/finalizeAll.ajax.php",
				method: "POST",
				dataType: "json",
				data:
				{
					ccgName: $(ViewManager.views.chooseName.selectors.ccgName).val(),
					templateSizes: ViewManager.views.chooseTemplate.cardTemplateSizes,
					templateDataBack: ViewManager.views.chooseTemplate.cardTemplateDataBack,
					templateDataFront: ViewManager.views.chooseTemplate.cardTemplateDataFront,
					componentsArray: componentsArray

				}
			})
			.done(function(data)
			{
				clearInterval(ellipseInterval);

				if(data.success)
					self.onFinalizeSuccess();
				else
					self.onFinalizeError();
			})
			.fail(function()
			{
				clearInterval(ellipseInterval);
				self.onFinalizeError();
			});
		},
		onFinalizeSuccess: function()
		{
			$(this.selectors.finalizing).css(
			{
				"color": "green",
				"margin-top": "0"
			}).text("Finalized");

			$(this.selectors.finalizingEllipse).css(
			{
				"color": "green",
				"margin-top": "0"
			}).text("!");

			$(this.selectors.finalizingButtons).show();
		},
		onFinalizeError: function()
		{
			$(this.selectors.finalizing).css(
			{
				"color": "red",
				"margin-top": "0"
			}).text(this.errorString);

			$(this.selectors.finalizingEllipse).hide();
			$(this.selectors.finalizingErrorBox).show();
			$(this.selectors.finalizingButtonsError).show();
		}
	});

	return FinalizeStep;
});