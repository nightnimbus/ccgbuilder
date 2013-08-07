define(
	[
		"jquery",
		"underscore",
		"backbone",
		"modernizr",
		"managers/hbs.manager",
		"managers/view.manager",
		"helpers/bootstrap-alert.helper",
		"helpers/string.helper",
		"genlib/objectevent.class",
		"genlib/globals.class",
		"bb/views/steps/step.view",
		"bootstrap"
	],
function(
	$,
	_,
	Backbone,
	Modernizr,
	HbsManager,
	ViewManager,
	BootstrapAlertHelper,
	StringHelper,
	ObjectEvent,
	Globals,
	Step)
{
	var ChooseTemplateFallbackStep = Step.extend(
	{
		defaultStep: null,
		selectors: {},
		events:
		{
			"click #cardTemplateData > span": "onClickSelection"
		},

		initialize: function(defaultStep)
		{
			this.defaultStep = defaultStep;

			this.selectors.fallbackWarning = "#fallbackWarning";
		},
		render: function(onComplete)
		{
			if(this.defaultStep.rendered == false)
			{
				var self = this;

				if(Globals.IS_MOBILE_DEVICE)
					infoText = 'You cannot upload your own card template because you are using a <strong>mobile</strong> device.';

				else
				{
					infoText = '' +
					'You cannot upload your own card template because you are using an <strong>outdated</strong> browser. ' +
					'Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> or ' +
					'<a href="http://www.google.com/chromeframe/?redirect=true" target="_blank">activate Google Chrome Frame</a> to improve your experience.';
				}

				HbsManager.loadTemplate("js/app/hbs/step-chooseTemplate-fallback.hbs", function(template)
				{
					self.defaultStep.$el.html(template({infoText: infoText}));

					self.attachEvents();
					self.defaultStep.initFeatures(true);
					BootstrapAlertHelper.showAlert(self.selectors.fallbackWarning);

					onComplete();
				},
				function(msg)
				{
					onError(msg);
				});
			}

			else
				onComplete();

			return this;
		},
		show: function()
		{
			BootstrapAlertHelper.showAlert(this.selectors.fallbackWarning);
		},
		hide: function()
		{
			
		},
		remove: function()
		{
			this.detachEvents();
		},
		onClickSelection: function(e)
		{
			this.defaultStep.getAllUrlSizes(e.target.src);
			this.defaultStep.setPreviewBackground(this.defaultStep.cardTemplateData[this.defaultStep.cardTemplateSizes[0]]);

			return false;
		},
		attachEvents: function()
		{
			var self = this;
			$(this.defaultStep.selectors.selectionTemplates).on("click", function(e)
			{
				self.onClickSelection(e);
			});
		},
		detachEvents: function()
		{
			$(this.defaultStep.selectors.selectionTemplates).off("click");
		}
	});

	return ChooseTemplateFallbackStep;
});