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
		"helpers/modernizr.helper",
		"genlib/objectevent.class",
		"genlib/globals.class",
		"bb/views/steps/step.view",
		"bootstrap",
		"modernizr.on"
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
	ModernizrHelper,
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
			
		},

		initialize: function(defaultStep)
		{
			this.defaultStep = defaultStep;

			this.selectors.templatePreviewFallback = "#templatePreviewFallback";
			this.selectors.templateSelectionFallback = "#cardTemplateSelectionFallback > span";
			this.selectors.templateFile = "#templateFile";
			this.selectors.mobileWarning = "#mobileWarning";
			this.selectors.noFlashWarning = "#noFlashWarning";
		},
		render: function(onComplete)
		{
			if(this.defaultStep.rendered == false)
			{
				var html = "";

				if(Globals.IS_MOBILE_DEVICE)
				{
					html = '' +
					'<div class="main-content-header">' +
				    	'<div class="row"><h1>Choose a Card Template</h1></div>' +
					'</div>' +

					'<div class="container-alerts">' +
			            '<div id="mobileWarning" class="alert alert-block alert-warning" style="margin-left: 15%; margin-right: 10%;">' +
			                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
			                '<h4 class="alert-heading">We are sincerely sorry but...</h4><br />' +
			                '<p>' +
			                    'You cannot upload your own card template because you are using a <strong>mobile</strong> device.' +
			                '</p>' +
			            '</div>' +
			        '</div>' +

					'<div class="row">' +
					    '<span class="span5">' +
					        '<h4 class="text-center">Upload a Card Template <strong class="required-star text-med">*</strong>:</h4>' +
					        '<div id="templatePreviewFallback" class="card-template-preview-fallback stretch-background"></div>' +
					    '</span>' +

					    '<span class="span2"><h2>OR</h2></span>' +

					    '<span class="span5">' +
					        '<h4>Click to Choose a Template Background:</h4>' +
					        '<div id="cardTemplateSelectionFallback" class="card-template-selection text-left">' +
					            '<span id="template01"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
					            '<span id="template01"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
					            '<span id="template01" class="no-margin-bottom"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
					            '<span id="template01" class="no-margin-bottom"><img src="../assets/img/card-templates/template01_150x200.jpg"></span>' +
					        '</div>' +
					    '</span>' +
					'</div>';
				}

				else
				{
					// Link fileupload stylesheet here so that the unstyled button never shows.
					html = '<link rel="stylesheet" href="../js/vendor/plugins/jquery/fileUpload/css/jquery.fileupload-ui.css">' +
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
					        '<div id="templatePreviewFallback" class="card-template-preview-fallback stretch-background"></div>' +
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
				}

				this.defaultStep.$el.html(html);

				// This doesn't even append to the body...
				// But it works if I have this here. Why? I have no fucking clue.
				$("body").append(this.defaultStep.el);

				this.defaultStep.initFeatures(true);
				BootstrapAlertHelper.showAlert(this.selectors.mobileWarning);

				onComplete();
			}

			else
				onComplete();

			return this;
		},
		show: function()
		{
			if(!this.loaded)
			{
				this.loadPolyfills();
				this.attachEvents();

				this.loaded = true;
			}
		},
		hide: function()
		{
			
		},
		remove: function()
		{
			if(this.loaded)
				this.detachEvents();
		},
		loadPolyfills: function()
		{
			var self = this;

			// Have to use require and not Modernizr.load for fileupload
			if(
				Modernizr.draganddrop &&
				window.FileReader &&
				!Globals.IS_MOBILE_DEVICE)
			{
				var supportDataUri = false;
				
				Modernizr.on("datauri", function(result)
				{
					console.log(result);
					require(["fileupload", "iframe.transport"], function()
					{
						$(self.selectors.templateFile).fileupload(
						{
							url: "php/choose-template-uploader.fallback.ajax.php",
							dataType: "json",
							formData:
							{
								supportDataUri: result
							},
							done: function(e, data)
							{
								self.onUploadSuccess(data);
							}
						});
					});
				});
			}
		},
		onClickSelection: function(e)
		{
			this.defaultStep.getAllUrlSizes(e.target.src);
			this.defaultStep.setPreviewBackground(
				this.defaultStep.cardTemplateData[this.defaultStep.cardTemplateSizes[0]], true);
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
					if(self.defaultStep.checkAndResizeImage(img, data.result.file))
					{
						self.defaultStep.setPreviewBackground(
							self.defaultStep.cardTemplateData[self.defaultStep.cardTemplateSizes[0]], true);
					}

					else
						BootstrapAlertHelper.showAlert(self.defaultStep.selectors.imgReqsAlert);
					
					return false;
				}

				img.onerror = function(e)
				{
					BootstrapAlertHelper.showAlert(self.defaultStep.selectors.imgReqsAlert);
					return false;
				}
			}

			else
				BootstrapAlertHelper.showAlert(this.defaultStep.selectors.imgReqsAlert);
		},
		attachEvents: function()
		{
			var self = this;

			$(this.selectors.templateSelectionFallback).on("click", function(e)
			{
				self.onClickSelection(e);
			});
		},
		detachEvents: function()
		{
			$.off("click", this.selectors.templateSelectionFallback);
		}
	});

	return ChooseTemplateFallbackStep;
});