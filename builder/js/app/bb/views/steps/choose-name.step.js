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
		reqFields: {},
		selectors: {},
		stepTitle: "Choose a Name",
		events:
		{
			"input #ccgName": "onInputCcgName",
			"textchange #ccgName": "onInputCcgName"
		},

		initialize: function()
		{
			this.reqFields.ccgName = false;

			this.selectors.ccgName = "#ccgName";
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
				        '<input id="ccgName" class="chooseName text-center" type="text" placeholder="Choose a Name...">' +
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
		finalize: function(onSuccess, onError)
		{
			var self = this;

			$.ajax(
			{
				url: "php/choose-name.finalize.ajax.php",
				method: "POST",
				dataType: "json",
				timeout: 5000,
				data:
				{
					ccgName: $(self.selectors.ccgName).val()
				}
			})
			.done(function(data)
			{
				if(data.success)
				{
					self.finalized = true;
					onSuccess();
				}

				else
					onError(data.msg);
			})
			.fail(function()
			{
				onError("Ajax request failed.");
			});
		},
		deFinalize: function(onSuccess, onError)
		{
			if(this.finalized)
			{
				var self = this;

				$.ajax(
				{
					url: "php/choose-name.definalize.ajax.php",
					method: "POST",
					timeout: 5000,
					data:
					{
						ccgName: $(self.selectors.ccgName).val()
					}
				})
				.done(function()
				{
					onSuccess();
				})
				.fail(function()
				{
					onError("Ajax request failed.");
				});
			}
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
				GeneralHelper.setInputDefault();

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
						GeneralHelper.setInputSuccess(self.selectors.ccgName);
						ObjectEvent.changeObjAttr(self.reqFields, "ccgName", true, self.checkReqFields);
					}

					else
					{
						console.log(data.msg);
						GeneralHelper.setInputFail(self.selectors.ccgName);
					}
				})
				.fail(function()
				{
					console.log("Oops! We can't check if your name is valid at this time. The database may be down. Please try again later. Sorry!");
				});
			}

			else if(value.length == 0)
			{
				GeneralHelper.setInputDefault(this.selectors.ccgName);
				ObjectEvent.changeObjAttr(this.reqFields, "ccgName", false, this.checkReqFields);
			}

			else
			{
				console.log("The name of your CCG must be at least <b>4</b> characters long, " +
				"and no more than <b>20</b> characters long.");
				GeneralHelper.setInputFail(this.selectors.ccgName);
				ObjectEvent.changeObjAttr(this.reqFields, "ccgName", false, this.checkReqFields);
			}
		}
	});

	return ChooseNameStep;
});