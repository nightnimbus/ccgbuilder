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
		"other/dialogs/chooseTemplate.dialog",
		"other/dialogs/sortType.enum",
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
	Step,
	ChooseTemplateDialog,
	SortType)
{
	var ChooseTemplateStep = Step.extend(
	{
		tagName: "div",
		finalized: false,
		rendered: false,
		requiredIndicator: false,
		reqFields: {},
		selectors: {},
		finalizeId: "chooseTemplateFinalize",
		title: "Choose a Template",
		cardTemplateSizes: [],
		cardTemplateDataBack: {},
		cardTemplateDataFront: {},
		fileReqs: null,
		chooseTemplateDialog: null,
		events:
		{
			"click #imgreqsDropdown": "onClickImgReqs"
		},

		initialize: function()
		{
			this.canvasHelper = new CanvasHelper(document.getElementById("hiddenCanvas"));
			this.cardTemplateSizes = new Array("150x200", "300x400");
			this.chooseTemplateDialog = new ChooseTemplateDialog("#chooseTemplateDialog");
			this.fileReqs = new FileRequirements();
			this.fileReqs.maxSize = 500*1000;
			this.fileReqs.aspectRatio = 3/4;
			this.fileReqs.types =
			[
				"image/jpeg",
				"image/pjpeg", // For <= IE 8.
				"image/png"
			];

			this.reqFields.cardTemplate = false;

			this.selectors.alertContainer = ".container-alerts";
			this.selectors.imgReqsAlert = "#imgReqsAlert";
			this.selectors.templatePreviewBack = "#templatePreviewBack";
			this.selectors.templatePreviewFront = "#templatePreviewFront";
			this.selectors.templatePreviews = ".container-card-template-previews .card-template-preview";
			this.selectors.containerTemplatePreviews = ".container-card-template-previews";
			this.selectors.templateSwitchButton = "#templateSwitchButton";
			this.selectors.selectPreBuiltButton = "#selectPreBuiltButton";
			this.selectors.templateFileBack = "#templateFileBack";
			this.selectors.templateFileFront = "#templateFileFront";
			this.selectors.dragAndDropHint = ".container-drag-and-drop-hint";
			this.selectors.imgreqsDropdownContent = "#imgreqsDropdownContent";

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
				        '<h2>Choose a Card Template</h2>' +
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
				            'Select Your Card Templates:' +
				        '</h4>' +
				        '<div id="container-imgreqsDropdown">' +
				        	'<a id="imgreqsDropdown" href="#">Image Requirements</a>' +
				        '</div>' +
				        '<div id="imgreqsDropdownContent" style="display: none;">' +
			                '<ul>' +
			                    '<li>JPEG,PNG</li>' +
			                    '<li>< 500 KB</li>' +
			                    '<li>3:4 aspect ratio</li>' +
			                '</ul>' +
			            '</div>' +

			            '<div class="container-card-template-previews">' +
				            '<div class="container-card-template-preview" style="margin-left: 13%;">' +
						        '<span class="btn btn-success fileinput-button" style="margin-bottom: 8px;">' +
					                '<span>Select Template</span>' +
					                '<input type="file" id="templateFileBack" name="templateFile">' +
					            '</span>' +
						        '<div id="templatePreviewBack" class="card-template-preview above-lights-off">' +
						        	'<div class="non-selectable"></div>' +
						        '</div>' +
					        '</div>' +

					        '<div id="container-templateSwitchButton">' +
						        '<button id="templateSwitchButton" class="btn btn-large btn-primary">' +
						        	'<span class="glyphicon glyphicon-refresh"></span>' +
						       ' </button>' +
						    '</div>' +

					        '<div class="container-card-template-preview">' +
						        '<span class="btn btn-success fileinput-button" style="margin-bottom: 8px;">' +
					                '<span>Select Template</span>' +
					                '<input type="file" id="templateFileFront" name="templateFile">' +
					            '</span>' +
						        '<div id="templatePreviewFront" class="card-template-preview above-lights-off">' +
						        	'<div class="non-selectable"></div>' +
						        '</div>' +
						    '</div>' +
					    '</div>' +

					    '<div class="tip builder-tip" style="margin-top: 5px;">' +
			            	'Tip: You can also <i>drag and drop</i> templates from your desktop.' +
			            '</div>' +
				    '</span>' +

				    '<span class="span2"><h3>OR</h3></span>' +

				    '<span class="span5">' +
				        '<button id="selectPreBuiltButton" class="btn">' +
				        	'Select a Pre-Built Template' +
				        '</button>' +
				    '</span>' +
				'</div>' +
				'<div id="chooseTemplateDialog" title="Choose a Pre-Built Template">' +
					'<div class="container-sortLinks text-center">' +
						'<b>Sort By:</b>' +
						'<a href="#" id="sortFrontLink" class="sort-link">Front</a>' +
						'<a href="#" id="sortBackLink" class="sort-link">Back</a>' +
					'</div>' +
					'<div class="container-preBuiltTemplates">' +
						'<div id="sortFront" style="display: none;">' +
							'<div class="prebuilt-template front-template template01-front-150-200"></div>' +
							'<div class="prebuilt-template front-template template01-front-150-200"></div>' +
						'</div>' +
						'<div id="sortBack" style="display: none;">' +
							'<div class="prebuilt-template back-template template01-back-150-200"></div>' +
							'<div class="prebuilt-template back-template template01-back-150-200"></div>' +
						'</div>' +
					'</div>' +
				'</div>';

				this.$el.html(html);

				// This doesn't even append to the body...
				// But it works if I have this here. Why? I have no fucking clue.
				$("body").append(this.el);

				this.loadPolyfills();
				this.initFeatures(false);

				this.attachEvents();

				this.chooseTemplateDialog.initialize();

				onComplete();

				this.rendered = true;
			}

			else
				onComplete();

			return this;
		},
		show: function()
		{
			if(this.rendered)
				this.attachEvents();
		},
		hide: function()
		{
			if(this.rendered)
				this.detachEvents();
		},
		remove: function()
		{
			this.detachEvents();
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
		onUploadSuccess: function(data, preview)
		{
			if(data.result.success)
			{
				var self = this;
				var img = new Image();

				img.onload = function(e)
				{
					if(self.checkAndResizeImage(img, data.result.file, preview))
						self.setPreviewBackground(preview);

					else
						BootstrapAlertHelper.showAlert(self.selectors.imgReqsAlert);

					// Prevent IE 6 memory leak.
					img = null;
				}

				img.onerror = function(e)
				{
					BootstrapAlertHelper.showAlert(self.selectors.imgReqsAlert);
				}

				img.src = data.result.imageData;
			}

			else
				BootstrapAlertHelper.showAlert(this.selectors.imgReqsAlert);
		},
		onClickImgReqs: function(e)
		{
			this.onPreventDefault(e);

			if($(this.selectors.imgreqsDropdownContent).css("display") == "none")
				$(this.selectors.imgreqsDropdownContent).slideDown(300);
			else
				$(this.selectors.imgreqsDropdownContent).slideUp(300);
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
		resizeImageToAllSizes: function(image, type, preview, ctx)
		{
			var templateData = {};

			for(var i = 0; i < this.cardTemplateSizes.length; i++)
			{
				var sizeStr = this.cardTemplateSizes[i];
				var size = StringHelper.getResComponents(sizeStr);

				// Don't resize if image's native resolution is the same as the target resolution.
				if(image.width != size[0] || image.height != size[1])
				{
					templateData[sizeStr] = this.canvasHelper.resizeImage(
					image, size[0], size[1], type, ctx);
				}

				else
				{
					// Can't read image.src in IE 8.
					if(this.canvasHelper.isFlashCanvasEnabled())
						templateData[sizeStr] = $(image).attr("src");
					else
						templateData[sizeStr] = image.src;
				}
			}

			if(preview == this.selectors.templatePreviewBack)
				this.cardTemplateDataBack = templateData;
			else
				this.cardTemplateDataFront = templateData;
		},
		resizePreBuiltTemplateToAllSizes: function(data, type, sortType)
		{
			var self = this;

			var preview =
			(sortType == SortType.Back)
			? this.selectors.templatePreviewBack
			: this.selectors.templatePreviewFront;

			var img = new Image();
			img.onload = function()
			{
				self.resizeImageToAllSizes(img, type, preview);
				self.setPreviewBackground(preview);

				// Prevent IE 6 memory leak.
				img = null;
			};

			img.src = data;
		},
		checkAndResizeImage: function(image, file, preview)
		{
			var imageAspectRatio = image.width / image.height;

			// This renders black pixels, but at least it renders something.
			// canvas.toDataUrl() changes image/pjpeg to image/png, which won't work in IE 8.
			//file.type = "image/jpeg";

			// Check image against requirements.
			if(this.fileReqs.check(file.size, file.type, imageAspectRatio))
			{
				this.resizeImageToAllSizes(image, file.type, preview);
				return true;
			}

			else
				BootstrapAlertHelper.showAlert(this.selectors.imgReqsAlert);

			return false;
		},
		initFeatures: function()
		{
			this.defaultPreview(this.selectors.templatePreviewBack);
			this.defaultPreview(this.selectors.templatePreviewFront);

			$(".alert").alert();
			BootstrapAlertHelper.initAllAlerts(this.selectors.alertContainer, function(alertSelector)
			{
				BootstrapAlertHelper.hideAlert(alertSelector, 200);
			});
		},
		registerUploadButtons: function(supportFileReader)
		{
			var self = this;

			$(this.selectors.templateFileBack).fileupload(
			{
				url: "php/choose-template-uploader.ajax.php",
				dataType: "json",
				dropZone: $(self.selectors.templatePreviewBack),
				formData:
				{
					supportFileReader: supportFileReader,
					fileReqs: JSON.stringify(self.fileReqs)
				},
				done: function(e, data)
				{
					self.onUploadSuccess(data, self.selectors.templatePreviewBack);
				},
				fail: function(e, data)
				{
					console.error(data.jqXHR.responseText);
				}
			});

			$(this.selectors.templateFileFront).fileupload(
			{
				url: "php/choose-template-uploader.ajax.php",
				dataType: "json",
				dropZone: $(self.selectors.templatePreviewFront),
				formData:
				{
					supportFileReader: supportFileReader,
					fileReqs: JSON.stringify(self.fileReqs)
				},
				done: function(e, data)
				{
					self.onUploadSuccess(data, self.selectors.templatePreviewFront);
				},
				fail: function(e, data)
				{
					console.error(data.jqXHR.responseText);
				}
			});
		},
		setPreviewBackground: function(preview, blank)
		{
			blank = (typeof blank === "boolean") ? blank : false;

			if(blank)
			{
				this.defaultPreview(preview);
				ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", false, this.checkReqFields);
			}

			else
			{
				var url = "";

				if(preview == this.selectors.templatePreviewBack)
					url = this.cardTemplateDataBack[this.cardTemplateSizes[0]];
				else
					url = this.cardTemplateDataFront[this.cardTemplateSizes[0]];

				$(preview + " > div").text("");
				$(preview).css("background", "url(" + url + ") no-repeat");

				if(
					typeof this.cardTemplateDataFront[this.cardTemplateSizes[0]] !== "undefined" &&
					typeof this.cardTemplateDataBack[this.cardTemplateSizes[0]] !== "undefined")
				{
					ObjectEvent.changeObjAttr(this.reqFields, "cardTemplate", true, this.checkReqFields);
				}
			}
		},
		defaultPreview: function(preview)
		{
			$(preview).css("background", "none");

			var text = (preview == this.selectors.templatePreviewBack) ? "Back" : "Front";
			$(preview + " > div").text(text);
		},
		enableDragNDropStyles: function()
		{
			$("#lights-off").show();
			$(this.selectors.templatePreviewBack).addClass("dropzone-hilite");
			$(this.selectors.templatePreviewFront).addClass("dropzone-hilite");
		},
		disableDragNDropStyles: function()
		{
			$("#lights-off").hide();
			$(this.selectors.templatePreviewBack).removeClass("dropzone-hilite");
			$(this.selectors.templatePreviewFront).removeClass("dropzone-hilite");
		},
		attachEvents: function()
		{
			var self = this;

			$(this.selectors.templateSwitchButton).on("click", function(e)
			{
				if(
					typeof self.cardTemplateDataBack[self.cardTemplateSizes[0]] !== "undefined" &&
					typeof self.cardTemplateDataFront[self.cardTemplateSizes[0]] !== "undefined")
				{
					for(var i = 0; i < self.cardTemplateSizes.length; i++)
					{
						var attr = self.cardTemplateSizes[i];
						var cacheBack = self.cardTemplateDataBack[attr];
						var cacheFront = self.cardTemplateDataFront[attr];

						self.cardTemplateDataBack[attr] = cacheFront;
						self.cardTemplateDataFront[attr] = cacheBack;
					}

					self.setPreviewBackground(self.selectors.templatePreviewBack);
					self.setPreviewBackground(self.selectors.templatePreviewFront);
				}
			});

			$(this.selectors.selectPreBuiltButton).on("click", function(e)
			{
				self.chooseTemplateDialog.getDialog().dialog("open");
			});


			if(Modernizr.draganddrop && !Globals.isLtIEVersion(10))
			{
				$(this.selectors.dragAndDropHint).show();

				$(document).on("mouseup", function(e)
				{
					$("#lights-off").hide();
					$(self.selectors.templatePreviewBack).removeClass("dropzone-hilite");
					$(self.selectors.templatePreviewFront).removeClass("dropzone-hilite");
				});

				$(document).on("drop dragover", function(e)
				{
					self.onPreventDefault(e);
				});

				$(document).on("dragenter", function(e)
				{
					// Don't trigger this event if we are hovering over any of the children of containerTemplatePreviews.
					if(
						$(e.target).hasClass("non-selectable") ||
						$(e.target).hasClass("card-template-preview") ||
						$(e.target).hasClass("container-card-template-previews"))
					{
						return;
					}

					self.enableDragNDropStyles();
				});


				$(this.selectors.containerTemplatePreviews).on("dragover", function(e)
				{
					$("#lights-off").hide();
					$(self.selectors.templatePreviewBack).addClass("dropzone-hilite");
					$(self.selectors.templatePreviewFront).addClass("dropzone-hilite");
				});

				$(this.selectors.containerTemplatePreviews).on("drop", function(e)
				{
					self.disableDragNDropStyles();
				});

				$("#lights-off").on("drop dragleave", function(e)
				{
					self.disableDragNDropStyles();
				});
			}
		},
		detachEvents: function()
		{
			$(this.selectors.templateSwitchButton).off("click");
			$(this.selectors.selectPreBuiltButton).off("click");

			if(Modernizr.draganddrop && !Globals.isLtIEVersion(10))
			{
				$(document).off("mouseup drop dragover dragenter");
				$(this.selectors.containerTemplatePreviews).off("drop dragover");
				$("#lights-off").off("drop dragleave");
			}
		}
	});

	return ChooseTemplateStep;
});