define(
	[
		"jquery",
		"backbone",
		"modernizr",
		"managers/hbs.manager",
		"managers/view.manager",
		"helpers/fileapi.helper",
		"helpers/bootstrap-alert.helper",
		"helpers/string.helper",
		"genlib/objectevent.class",
		"genlib/globals.class",
		"bootstrap"
	],
function(
	$,
	Backbone,
	Modernizr,
	HbsManager,
	ViewManager,
	FileApiHelper,
	BootstrapAlertHelper,
	StringHelper,
	ObjectEvent,
	Globals)
{
	var ChooseTemplateView = Backbone.View.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		reqFields: {},
		selectors: {},
		stepTitle: "Choose a Template",
		cardTemplateData: {},
		ccgRoot: "",
		events:
		{
			"dragenter #templatePreview": "onPreventDefault",
			"dragover #templatePreview": "onPreventDefault",
			"drop #templatePreview": "onDropTemplatePreview",
			"ondragstart #cardTemplateSelection>span": "onDragStartSelection",
			"click #cardTemplateSelection>span": "onClickSelection",
			"mouseover #imgreqsTooltip": "onMouseOverImgReqsTooltip",
			"mouseout #imgreqsTooltip": "onMouseOutImgReqsTooltip"
		},

		initialize: function()
		{
			this.reqFields.cardTemplate = false;

			this.cardTemplateSizes = new Array("150x200", "300x400");

			this.selectors.templatePreview = "#templatePreview";
			this.selectors.selectionTemplates = "#cardTemplateSelection > span";
		},
		checkReqFields: function(context)
		{
			if(
				context.cardTemplate
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

				if(Modernizr.draganddrop)
				{
					HbsManager.loadTemplate("js/app/hbs/step-chooseTemplate.hbs",
					function(template)
					{
						self.$el.html(HbsManager.templates["step-chooseTemplate"]());
						self.initDragNDropSelection();
						onComplete();
					});
				}

				else
				{
					HbsManager.loadTemplate("js/app/hbs/step-chooseTemplate-fallback.hbs",
					function(template)
					{
						self.$el.html(HbsManager.templates["step-chooseTemplate-fallback"]());
						self.registerFallbackEvents();

						onComplete();
					});
				}

				this.rendered = true;
			}

			else
				onComplete();

			return this;
		},
		show: function()
		{

		},
		hide: function()
		{

		},
		finalize: function(onSuccess, onError)
		{
			var self = this;

			$.ajax(
			{
				url: "php/choose-template.finalize.ajax.php",
				method: "POST",
				dataType: "json",
				timeout: 5000,
				data:
				{
					templateSizes: self.cardTemplateSizes,
					templateImages: self.cardTemplateData
				}
			})
			.done(function(data)
			{
				self.ccgRoot = data.ccgRoot;

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
			var self = this;
			
			$.ajax(
			{
				url: "php/choose-template.definalize.ajax.php",
				method: "POST",
				timeout: 5000,
				data:
				{
					ccgRoot: self.ccgRoot
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
		},
		onPreventDefault: function(e)
		{
			e = e.originalEvent || e;

			e.preventDefault();
			e.stopPropagation();

			return false;
		},
		onDropTemplatePreview: function(e)
		{
			e = e.originalEvent || e;

			e.preventDefault();
			e.stopPropagation();

			var self = this;
			var templateUrl = (e.dataTransfer.getData("Text"))
			? e.dataTransfer.getData("Text")
			: (typeof e.target.src !== "undefined")
			? e.target.src
			: "";

			if(templateUrl.length == 0)
			{
				var file = e.dataTransfer.files[0];
				var reader = new FileReader();

				reader.onload = function(e)
				{
					var tmpImg = new Image();
					tmpImg.src = e.target.result;
					
					tmpImg.onload = function(e)
					{
						var tmpImgAspectRatio = tmpImg.width / tmpImg.height;

						// Check image against requirements.
						if(
						(file.type == "image/jpeg" ||
						file.type == "image/png") &&
						file.size < 500*1000 && // 500 KB
						tmpImgAspectRatio == 3/4)
						{
							// Clear the cardTemplateData array.
							self.cardTemplateData.length = 0;

							for(var i = 0; i < self.cardTemplateSizes.length; i++)
							{
								var sizeStr = self.cardTemplateSizes[i];
								var size = StringHelper.getResComponents(sizeStr);

								// Don't resize if image's native resolution is the same as the target resolution.
								if(tmpImg.width != size[0] && tmpImg.height != size[1])
								{
									self.cardTemplateData[sizeStr] = FileApiHelper.resizeImage(
									tmpImg, size[0], size[1], file.type);
								}

								else
									self.cardTemplateData[sizeStr] = tmpImg.src;
							}

							self.setPreviewBackground(self.cardTemplateData[self.cardTemplateSizes[0]]);
						}

						else
						{
							BootstrapAlertHelper.showAlert("#imgReqsAlert", 200);
							$(".main-content-header").addClass("low-margin-bottom");
						}
					};
				};

				reader.readAsDataURL(file);
			}

			else
			{
				// Checks to make sure your aren't dragging from your browser
				if(templateUrl.indexOf(Globals.ROOT) != -1)
				{
					var prefix = templateUrl.substr(0, templateUrl.indexOf('_')+1);
					var suffix = templateUrl.substr(templateUrl.indexOf('.'));

					for(var i = 0; i < this.cardTemplateSizes.length; i++)
					{
						var sizeStr = this.cardTemplateSizes[i];
						var url = prefix + sizeStr + suffix;
						
						this.cardTemplateData[sizeStr] = url;
					}

					this.setPreviewBackground(prefix + this.cardTemplateSizes[0] + suffix);
				}
			}

			return false;
		},
		onDragStartSelection: function(e)
		{
			e.dataTransfer.setData("Text", e.target.id);
		},
		onClickSelection: function(e)
		{
			this.cardTemplateData[this.cardTemplateSizes[0]] = e.target.src;
			this.setPreviewBackground(self.cardTemplateData[this.cardTemplateSizes[0]]);

			return false;
		},
		onMouseOverImgReqsTooltip: function(e)
		{
			$(e.currentTarget).tooltip("show");
			return false;
		},
		onMouseOutImgReqsTooltip: function(e)
		{
			$(e.currentTarget).tooltip("hide");
			return false;
		},
		initDragNDropSelection: function()
		{
			$(".alert").alert();
			BootstrapAlertHelper.initAllAlerts(".container-alerts", function(alertSelector)
			{
				BootstrapAlertHelper.hideAlert(alertSelector, 200, function()
				{
					$(".main-content-header").removeClass("low-margin-bottom");
				});
			});

			$(this.selectors.selectionTemplates).prop("draggable", "true");
		},
		setPreviewBackground: function(url)
		{
			$(this.selectors.templatePreview).css("background", "url(" + url + ") no-repeat center");
			ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", true, this.checkReqFields);
		}
	});

	return ChooseTemplateView;
});