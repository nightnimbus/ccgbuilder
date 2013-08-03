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
		"bb/views/steps/step.view",
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
	Globals,
	Step)
{
	var ChooseTemplateView = Step.extend(
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

			this.selectors.alertContainer = ".container-alerts";
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
				var html = '' +
				'<div class="main-content-header">' +
				    '<div class="row">' +
				        '<h1>Choose a Card Template Background</h1>' +
				    '</div>' +
				'</div>' +

				'<div class="row">' +
				    '<div class="container-alerts">' +
				        '<div id="imgReqsAlert" class="alert alert-error alert-block">' +
				            '<button type="button" class="close">&times;</button>' +
				            '<h4 class="alert-heading">That image is invalid!</h4><br/>' +
				            '<b>The image requirements are:</b>' +
				            '<ul>' +
				                '<li>JPEG,PNG</li>' +
				                '<li>< 500 KB</li>' +
				                '<li>3:4 aspect ratio</li>' +
				            '</ul>' +
				        '</div>' +
				    '</div>' +
				'</div>' +

				'<div class="row">' +
				    '<span class="span5">' +
				        '<h4 style="text-align: left; padding-left: 15%">' +

				            'Drag and Drop a Template Background <strong class="required-star text-med">*</strong>' +
				            '<a id="imgreqsTooltip" class="tooltipLink" href="#"' +
				                'data-toggle="tooltip"' +
				                'data-placement="right"' +
				                'data-html="true"' +
				                'title="' +
				                '<h4>Image Requirements:</h4>' +
				                '<ul>' +
				                    '<li>JPEG,PNG</li>' +
				                    '<li>< 500 KB</li>' +
				                    '<li>3:4 aspect ratio</li>' +
				                '</ul>' +
				                '">(?)' +
				            '</a>' +
				            ':' +

				        '</h4>' +
				        '<div id="templatePreview" class="card-template-preview"></div>' +
				    '</span>' +

				    '<span class="span2"><h2>OR</h2></span>' +

				    '<span class="span5">' +
				        '<h4>Drag over a Template Background:</h4>' +
				        '<div id="cardTemplateSelection" class="card-template-selection text-left">' +
				            '<span id="template01"><img src="../img/card-templates/template01_150x200.jpg"></span>' +
				            '<span id="template01"><img src="../img/card-templates/template01_150x200.jpg"></span>' +
				            '<span id="template01" class="no-margin-bottom"><img src="../img/card-templates/template01_150x200.jpg"></span>' +
				         	'<span id="template01" class="no-margin-bottom"><img src="../img/card-templates/template01_150x200.jpg"></span>' +
				        '</div>' +
				    '</span>' +
				'</div>';

				if(Modernizr.draganddrop && !Globals.IS_MOBILE_DEVICE)
				{
					this.$el.html(html);

					// This doesn't even append to the body...
					// But it works if I have this here. Why? I have no fucking clue.
					$("body").append(this.el);

					this.initFeatures();
					onComplete();
				}

				else
				{
					HbsManager.loadTemplate("js/app/hbs/step-chooseTemplate-fallback.hbs",
					function(template)
					{
						var infoText = "";

						if(Globals.IS_MOBILE_DEVICE)
						{
							infoText = 'You are using a <strong>mobile</strong> device. ' +
							'To upload your own card template, you will need to be on a computer. ' +
							'For now, you can choose one of the amazing community card templates on the right.';
						}

						else
						{
							infoText = 'You are using an <strong>outdated</strong> browser. ' +
							'Please <a href="http://browsehappy.com/">upgrade your browser</a> ' +
							'or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> ' +
							'to upload your <b>own</b> template background.';
						}

						self.$el.html(template({infoText: infoText}));

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
		remove: function()
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

					this.setPreviewBackground(this.cardTemplateData[this.cardTemplateSizes[0]]);
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
		initFeatures: function()
		{
			$(".alert").alert();
			BootstrapAlertHelper.initAllAlerts(this.selectors.alertContainer, function(alertSelector)
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