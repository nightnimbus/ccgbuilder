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
		"bootstrap",
		"uploadify"
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
					html = '' +
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
					        '<div id="noFlashWarning" class="alert alert-warning alert-block>' +
					        	'<button type="button" class="close">&times;</button>' +
					            '<h4 class="alert-heading">You have no Adobe Flash Player!</h4><br/>' +
					            '<a href="#">Download Adobe Flash Player</a> in order to upload your own card template.' +
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
					        '<div style="margin-left: 37%;">' +
					        	'<input type="file" id="templateFile" name="templateFile">' +
					        '</div>' +
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

				this.attachEvents();
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
			this.defaultStep.setPreviewBackground(
				this.defaultStep.cardTemplateData[this.defaultStep.cardTemplateSizes[0]], true);
		},
		onUploadSuccess: function(file, data)
		{
			if(data.length > 0)
			{
				var self = this;
				var img = new Image();
				img.src = data;
				
				if(file.type == ".jpg" || file.type == ".jpeg")
					file.type = "image/jpeg";

				else if(file.type == ".png")
					file.type = "image/png";

				img.onload = function(e)
				{
					if(self.defaultStep.checkAndResizeImage(img, file))
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
		onUploadifyFallback: function()
		{
			BoostrapAlertHelper.showAlert(this.selectors.noFlashWarning);
		},
		attachEvents: function()
		{
			var self = this;

			$(this.selectors.templateFile).uploadify(
			{
				"swf": "../js/vendor/plugins/jquery/uploadify/uploadify.swf",
				"uploader": "php/choose-template-uploader.fallback.ajax.php",
				"multi": false,
				"buttonText": "Select Template",

				"onUploadSuccess": function(file, data)
				{
					self.onUploadSuccess(file, data);
				},
				"onFallback": function()
				{
					self.onUploadifyFallback();
				}
			});

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