define([
	"jquery",
	"backbone",
	"managers/hbs.manager",
	"managers/view.manager",
	"genlib/objectevent.class",
	"bb/views/steps/step.view"
	],
function(
	$,
	Backbone,
	HbsManager,
	ViewManager,
	ObjectEvent,
	Step)
{
	var ChooseNameView = Step.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		reqFields: {},
		selectors: {},
		stepTitle: "Choose a Name",
		events:
		{
			"input #ccgName": "onInputCcgName"
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
				var self = this;
				var html = '' +
				'<div class="main-content-header">' +
				    '<div class="row">' +
				        '<h1>Name Your CCG</h1>' +
				    '</div>' +
				'</div>' +

				'<div class="row">' +
				    '<span class="span12">' +
				        '<input id="ccgName" class="chooseName text-center" type="text" placeholder="Choose a Name...">' +
				    '</span>' +
				'</div>';

				self.$el.html(html);
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
				this.setDefaultInput();

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
						self.setSuccessInput();
						ObjectEvent.changeObjAttr(self.reqFields, "ccgName", true, self.checkReqFields);
					}

					else
					{
						console.log(data.msg);
						self.setFailInput();
					}
				})
				.fail(function()
				{
					console.log("Oops! We can't check if your name is valid at this time. The database may be down. Please try again later. Sorry!");
				});
			}

			else if(value.length == 0)
			{
				this.setDefaultInput();
				ObjectEvent.changeObjAttr(this.reqFields, "ccgName", false, this.checkReqFields);
			}

			else
			{
				console.log("The name of your CCG must be at least <b>4</b> characters long, " +
				"and no more than <b>20</b> characters long.");
				this.setFailInput();
				ObjectEvent.changeObjAttr(this.reqFields, "ccgName", false, this.checkReqFields);
			}
		},
		setDefaultInput: function()
		{
			$(this.selectors.ccgName).addClass("chooseName-default-input");
			$(this.selectors.ccgName).removeClass("chooseName-fail-input");
			$(this.selectors.ccgName).removeClass("chooseName-success-input");
		},
		setFailInput: function()
		{
			$(this.selectors.ccgName).addClass("chooseName-fail-input");
			$(this.selectors.ccgName).removeClass("chooseName-default-input");
			$(this.selectors.ccgName).removeClass("chooseName-success-input");
		},
		setSuccessInput: function()
		{
			$(this.selectors.ccgName).addClass("chooseName-success-input");
			$(this.selectors.ccgName).removeClass("chooseName-default-input");
			$(this.selectors.ccgName).removeClass("chooseName-fail-input");
		}
	});

	return ChooseNameView;
});