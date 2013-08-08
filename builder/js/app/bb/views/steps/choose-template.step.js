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
	ViewManager,
	CanvasHelper,
	BootstrapAlertHelper,
	StringHelper,
	ObjectEvent,
	Globals,
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
		chooseTemplateFallback: null,
		ccgRoot: "",
		events:
		{
			"dragenter #templatePreview": "onPreventDefault",
			"dragover #templatePreview": "onPreventDefault",
			"drop #templatePreview": "onDropTemplatePreview",
			"ondragstart #cardTemplateSelection > span": "onDragStartSelection",
			"mouseover #imgreqsTooltip": "onMouseOverImgReqsTooltip",
			"mouseout #imgreqsTooltip": "onMouseOutImgReqsTooltip",
		},

		initialize: function()
		{
			this.canvasHelper = new CanvasHelper(document.getElementById("hiddenCanvas"));
			this.cardTemplateSizes = new Array("150x200", "300x400");

			this.reqFields.cardTemplate = false;

			this.selectors.alertContainer = ".container-alerts";
			this.selectors.imgReqsAlert = "#imgReqsAlert";
			this.selectors.templatePreview = "#templatePreview";
			this.selectors.selectionTemplates = "#cardTemplateSelection > span";
			this.selectors.templateLink = "#templateLink";

			BootstrapAlertHelper.onShow = function() { $(".main-content-header").addClass("low-margin-bottom"); };
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
				var html = "";

				if(
					Modernizr.draganddrop &&
					!Globals.IS_MOBILE_DEVICE &&
					!Globals.isLtIEVersion(10))
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
					    '</div>' +
					'</div>' +

					'<div class="row">' +
					    '<span class="span5">' +
					        '<h4 class="text-center">' +
					            'Drag and Drop a Card Template <strong class="required-star text-med">*</strong> ' +
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
					        '<div id="templatePreview" class="card-template-preview stretch-background"></div>' +
					    '</span>' +

					    '<span class="span2"><h2>OR</h2></span>' +

					    '<span class="span5">' +
					        '<h4 class="text-center">Drag over a Card Template:</h4>' +
					        '<div id="cardTemplateSelection" class="card-template-selection text-left">' +
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

					this.initFeatures(false);
					onComplete();

					this.rendered = true;
				}

				else
				{
					var self = this;

					this.chooseTemplateFallback.render(function()
					{
						onComplete();
						self.rendered = true;
					},
					function(msg)
					{
						onError(msg);
					});
				}
			}

			else
				onComplete();

			return this;
		},
		show: function()
		{
			this.chooseTemplateFallback.show();
		},
		hide: function()
		{
			this.chooseTemplateFallback.hide();
		},
		remove: function()
		{
			this.chooseTemplateFallback.remove();
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
						if(self.checkAndResizeImage(tmpImg, file))
							self.setPreviewBackground(self.cardTemplateData[self.cardTemplateSizes[0]]);
						else
							BootstrapAlertHelper.showAlert(self.selectors.imgReqsAlert);

						return false;
					}

					tmpImg.onerror = function(e)
					{
						BootstrapAlertHelper.showAlert(self.selectors.imgReqsAlert);
						return false;
					}
				};

				reader.readAsDataURL(file);
			}

			else
			{
				// Checks to make sure your aren't dragging from anther tab in your browser.
				if(templateUrl.indexOf(Globals.ROOT) != -1)
				{
					this.getAllUrlSizes(templateUrl);
					this.setPreviewBackground(this.cardTemplateData[this.cardTemplateSizes[0]]);
				}
			}

			return false;
		},
		onDragStartSelection: function(e)
		{
			e.dataTransfer.setData("Text", e.target.id);
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
			if(
			(file.type == "image/jpeg" ||
			file.type == "image/png") &&
			file.size <= 500*1000 && // 500 KB
			imageAspectRatio == 3/4)
			{
				this.resizeImageToAllSizes(image, file.type);
				return true;
			}

			else
				BootstrapAlertHelper.showAlert(this.selectors.imgReqsAlert);

			return false;
		},
		initFeatures: function(fallback)
		{
			fallback = (typeof fallback === "boolean") ? fallback : false;

			if(!fallback)
				$(this.selectors.selectionTemplates).prop("draggable", "true");

			$(".alert").alert();
			BootstrapAlertHelper.initAllAlerts(this.selectors.alertContainer, function(alertSelector)
			{
				BootstrapAlertHelper.hideAlert(alertSelector, 200, function()
				{
					$(".main-content-header").removeClass("low-margin-bottom");
				});
			});
		},
		setPreviewBackground: function(url, fallback)
		{
			fallback = (typeof fallback === "boolean") ? fallback : false;

			if(url == null)
			{
				if(!fallback)
					$(this.selectors.templatePreview).css("background", "url(assets/img/dragndrop.png) no-repeat");
				else
					$(this.chooseTemplateFallback.selectors.templatePreviewFallback).css("background", "url(assets/img/dragndrop-fallback.png) no-repeat");

				ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", false, this.checkReqFields);
			}

			else
			{
				if(!fallback)
					$(this.selectors.templatePreview).css("background", "url(" + url + ") no-repeat");
				else
					$(this.chooseTemplateFallback.selectors.templatePreviewFallback).css("background", "url(" + url + ") no-repeat");

				ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", true, this.checkReqFields);
			}
		}
	});

	return ChooseTemplateStep;
});