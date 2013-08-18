define([
	"jquery",
	"backbone",
	"modernizr",
	"managers/hbs.manager",
	"managers/view.manager",
	"helpers/general.helper",
	"genlib/objectevent.class",
	"genlib/globals.class",
	"bb/views/steps/step.view"
	],
function(
	$,
	Backbone,
	Modernizr,
	HbsManager,
	ViewManager,
	GeneralHelper,
	ObjectEvent,
	Globals,
	Step)
{
	var ChooseNameStep = Step.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		requiredIndicator: false,
		defaultValidatorString: "",
		reqFields: {},
		selectors: {},
		finalizeId: "chooseNameFinalize",
		title: "Choose a Name",
		events:
		{
			"input #ccgName": "onInputCcgName",
			"textchange #ccgName": "onInputCcgName"
		},

		initialize: function()
		{
			this.defaultValidatorString = "Please type your new CCG's name.";

			this.reqFields.ccgName = false;

			this.selectors.ccgName = "#ccgName";
			this.selectors.ccgNameValidator = "#ccgNameValidator";
		},
		checkReqFields: function(context)
		{
			if(
				context.ccgName
				)
				ViewManager.views.stepButtons.enableNextButton();
			else
				ViewManager.views.stepButtons.disableNextButton();
		},
		render: function(onComplete)
		{
			if(this.rendered == false)
			{
				var html = '' +
				'<div class="main-content-header">' +
				    '<div class="row">' +
				        '<h2>Name Your CCG</h2>' +
				    '</div>' +
				'</div>' +

				'<div class="row">' +
				    '<span class="span12">' +
				    	'<div style="margin-top: 12%;">' +
					    	'<div id="ccgNameValidator" class="validator validator-default" style="margin-bottom: 20px;">' +
					    		this.defaultValidatorString +
					    	'</div>' +

					    	'<input id="ccgName" class="chooseName text-center" type="text" placeholder="Choose a Name...">' +
				    	'</div>' +
				    '</span>' +
				'</div>';

				this.$el.html(html);
				this.loadPolyfills();

				onComplete();
				this.rendered = true;
			}

			else
				onComplete();

			return this;
		},
		show: function()
		{
			$(this.selectors.ccgName).focus();
		},
		hide: function()
		{

		},
		remove: function()
		{

		},
		loadPolyfills: function()
		{
			Modernizr.load(
			[
				{
					test: !Globals.isLtIEVersion(10),
					nope:
					[
						"../js/vendor/plugins/jquery/polyfills/onInput/jquery.splendid.textchange.min.js"
					]
				}
			]);
		},
		onPreventDefault: function(e)
		{
			e = e.originalEvent || e;

			e.preventDefault();
			e.stopPropagation();

			return false;
		},
		onInputCcgName: function(e)
		{
			if(e.currentTarget.value.length == 0)
				this.setValidationDefault(this.defaultValidatorString);

			this.handleErrorChecking();
		},
		handleErrorChecking: function()
		{
			var self = this;
			var value = $(this.selectors.ccgName).val();

			// So delay in the ajax request doesn't allow you to press the next button
			// with an invalid CCG name
			ObjectEvent.changeObjAttr(self.reqFields, "ccgName", false, self.checkReqFields);

			if(
				value.length >= 4 &&
				value.length <= 20)
			{
				$.ajax(
				{
					url: "php/choose-name.ajax.php",
					method: "POST",
					dataType: "json",
					data:
					{
						val: value
					}
				})
				.done(function(data)
				{
					if(data.success)
					{
						self.setValidationSuccess("Hurray! Your name is valid and not in use!!!11 ;) <3");
						ObjectEvent.changeObjAttr(self.reqFields, "ccgName", true, self.checkReqFields);
					}

					else
					{
						self.setValidationFail(data.msg);
					}
				})
				.fail(function()
				{
					self.setValidationFail("Oops! We can't check if your name is valid at this time. The database may be down. Please try again later. Sorry!");
				});
			}

			else if(value.length == 0)
				ObjectEvent.changeObjAttr(this.reqFields, "ccgName", false, this.checkReqFields);

			else
			{
				self.setValidationFail("The name must be at least <b>4</b> characters long, " +
				"and no more than <b>20</b> characters long.");
				ObjectEvent.changeObjAttr(this.reqFields, "ccgName", false, this.checkReqFields);
			}
		},
		setValidationDefault: function(msg)
		{
			$(this.selectors.ccgNameValidator).addClass("validator-default");
			$(this.selectors.ccgNameValidator).removeClass("validator-success validator-fail");
			$(this.selectors.ccgNameValidator).html(msg);

			GeneralHelper.setInputDefault(this.selectors.ccgName);
		},
		setValidationSuccess: function(msg)
		{
			$(this.selectors.ccgNameValidator).addClass("validator-success");
			$(this.selectors.ccgNameValidator).removeClass("validator-default validator-fail");
			$(this.selectors.ccgNameValidator).html(msg);

			GeneralHelper.setInputSuccess(this.selectors.ccgName);
		},
		setValidationFail: function(msg)
		{
			$(this.selectors.ccgNameValidator).addClass("validator-fail");
			$(this.selectors.ccgNameValidator).removeClass("validator-default validator-success");
			$(this.selectors.ccgNameValidator).html(msg);

			GeneralHelper.setInputFail(this.selectors.ccgName);
		}
	});

	return ChooseNameStep;
});