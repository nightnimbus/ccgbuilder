define(
	[
		"jquery",
		"underscore",
		"backbone",
		"modernizr",
		"managers/view.manager",
		"helpers/canvas.helper",
		"helpers/bootstrap-alert.helper",
		"helpers/string.helper",
		"helpers/modernizr.helper",
		"genlib/objectevent.class",
		"genlib/globals.class",
		"genlib/filerequirements.class",
		"bb/views/steps/step.view",
		"bootstrap",
		"fileupload"
	],
function(
	$,
	_,
	Backbone,
	Modernizr,
	ViewManager,
	CanvasHelper,
	BootstrapAlertHelper,
	StringHelper,
	ModernizrHelper,
	ObjectEvent,
	Globals,
	FileRequirements,
	Step)
{
	var ChooseTemplateStep = Step.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		reqFields: {},
		selectors: {},
		stepTitle: "Choose a Template",
		cardTemplatesizes: [],
		cardTemplateData: {},
		fileReqs: null,
		ccgRoot: "",
		events:
		{
			"mouseover #imgreqsTooltip": "onMouseOverImgReqsTooltip",
			"mouseout #imgreqsTooltip": "onMouseOutImgReqsTooltip",
		},

		initialize: function()
		{
			this.canvasHelper = new CanvasHelper(document.getElementById("hiddenCanvas"));
			this.cardTemplateSizes = new Array("150x200", "300x400");
			this.fileReqs = new FileRequirements();
			this.fileReqs.maxSize = 50*1000;
			this.fileReqs.aspectRatio = 3/4;
			this.fileReqs.types =
			[
				"image/jpeg",
				"image/png"
			];

			this.reqFields.cardTemplate = false;

			this.selectors.alertContainer = ".container-alerts";
			this.selectors.imgReqsAlert = "#imgReqsAlert";
			this.selectors.templatePreview = "#templatePreview";
			this.selectors.templateFile = "#templateFile";

			BootstrapAlertHelper.onShow = function() { $(".main-content-header").addClass("low-margin-bottom"); };
			BootstrapAlertHelper.onHide = function() { $(".main-content-header").removeClass("low-margin-bottom"); };
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
				// Link fileupload stylesheet here so that the unstyled button never shows.
				var html = '<link rel="stylesheet" href="../js/vendor/plugins/jquery/fileUpload/css/jquery.fileupload-ui.css">' +
				'<div class="main-content-header">' +
				    '<div class="row">' +
				        '<h1>Choose a Card Template</h1>' +
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
				        '<h4 class="text-center">' +
				            'Select a Card Template <strong class="required-star text-med">*</strong> ' +
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
				        '<span class="btn btn-success fileinput-button" style="margin-bottom: 8px;">' +
			                '<span>Select Template</span>' +
			                '<input type="file" id="templateFile" name="templateFile">' +
			            '</span>' +
				        '<div id="templatePreview" class="card-template-preview"></div>' +
				    '</span>' +

				    '<span class="span2"><h2>OR</h2></span>' +

				    '<span class="span5">' +
				        '<h4 class="text-center">Click to Choose a Card Template:</h4>' +
				        '<div id="cardTemplateSelectionFallback" class="card-template-selection text-left">' +
				            '<span id="template01"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
				            '<span id="template01"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
				            '<span id="template01" class="no-margin-bottom"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
				         	'<span id="template01" class="no-margin-bottom"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
				        '</div>' +
				    '</span>' +
				'</div>';

				this.$el.html(html);

				// This doesn't even append to the body...
				// But it works if I have this here. Why? I have no fucking clue.
				$("body").append(this.el);

				this.loadPolyfills();
				this.initFeatures(false);

				onComplete();

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
		loadPolyfills: function()
		{
			var self = this;

			if(!window.FileReader)
			{
				require(["iframe.transport"], function()
				{
					self.registerUploadButtons(false);
				});
			}

			else
				self.registerUploadButtons(true);
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
		onUploadSuccess: function(data)
		{
			if(data.result.success)
			{
				var self = this;
				var img = new Image();
				img.src = data.result.imageData;

				img.onload = function(e)
				{
					if(self.checkAndResizeImage(img, data.result.file))
					{
						self.setPreviewBackground(
							self.cardTemplateData[self.cardTemplateSizes[0]], true);
					}

					else
						BootstrapAlertHelper.showAlert(self.selectors.imgReqsAlert);
					
					return false;
				}

				img.onerror = function(e)
				{
					BootstrapAlertHelper.showAlert(self.selectors.imgReqsAlert);
					return false;
				}
			}

			else
				BootstrapAlertHelper.showAlert(this.selectors.imgReqsAlert);
		},
		getAllUrlSizes: function(url)
		{
			url = (typeof url === "string") ? url : "";
			
			var prefix = url.substr(0, url.indexOf('_')+1);
			var suffix = url.substr(url.lastIndexOf('.'));

			for(var i = 0; i < this.cardTemplateSizes.length; i++)
			{
				var sizeStr = this.cardTemplateSizes[i];
				var url = prefix + sizeStr + suffix;
				
				this.cardTemplateData[sizeStr] = url;
			}
		},
		resizeImageToAllSizes: function(image, type)
		{
			// Clear the cardTemplateData array.
			this.cardTemplateData.length = 0;

			for(var i = 0; i < this.cardTemplateSizes.length; i++)
			{
				var sizeStr = this.cardTemplateSizes[i];
				var size = StringHelper.getResComponents(sizeStr);

				// Don't resize if image's native resolution is the same as the target resolution.
				if(image.width != size[0] || image.height != size[1])
				{
					this.cardTemplateData[sizeStr] = this.canvasHelper.resizeImage(
					image, size[0], size[1], type);
				}

				else
					this.cardTemplateData[sizeStr] = image.src;
			}
		},
		checkAndResizeImage: function(image, file)
		{
			var imageAspectRatio = image.width / image.height;

			// Check image against requirements.
			if(this.fileReqs.check(file.size, file.type, imageAspectRatio))
			{
				this.resizeImageToAllSizes(image, file.type);
				return true;
			}

			else
				BootstrapAlertHelper.showAlert(this.selectors.imgReqsAlert);

			return false;
		},
		initFeatures: function()
		{
			$(".alert").alert();
			BootstrapAlertHelper.initAllAlerts(this.selectors.alertContainer, function(alertSelector)
			{
				BootstrapAlertHelper.hideAlert(alertSelector, 200);
			});
		},
		registerUploadButtons: function(supportFileReader)
		{
			var self = this;
			var previousTemplatePath = $(self.selectors.templatePreview).css("background-image");

			$(this.selectors.templateFile).fileupload(
			{
				url: "php/choose-template-uploader.ajax.php",
				dataType: "json",
				formData:
				{
					supportFileReader: supportFileReader,
					fileReqs: JSON.stringify(self.fileReqs)
				},
				done: function(e, data)
				{
					self.onUploadSuccess(data);
				},
				fail: function(e, data)
				{
					console.error(data.jqXHR.responseText);
				}
			});
		},
		setPreviewBackground: function(url)
		{
			if(url == null)
			{
				$(this.selectors.templatePreview).css("background", "url(assets/img/template-preview.png) no-repeat");
				ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", false, this.checkReqFields);
			}

			else
			{
				$(this.selectors.templatePreview).css("background", "url(" + url + ") no-repeat");
				ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", true, this.checkReqFields);
			}
		}
	});

	return ChooseTemplateStep;
});