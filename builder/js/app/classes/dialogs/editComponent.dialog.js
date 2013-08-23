define(
	[
		"jquery",
		"shared/classes/managers/view.manager",
		"shared/classes/helpers/general.helper",
		"shared/classes/dialog.class"
	],
function(
	$,
	ViewManager,
	GeneralHelper,
	Dialog)
{
	var EditComponentDialog = Dialog.extend(
	{
		selectors: {},
		errors: {},
		infos: {},
		component: null,

		initialize: function(componentViewManager)
		{
			var self = this;

			this.selectors.containerMessages = ".container-dialog-messages";
			this.selectors.layerInput = "input[name=layer]";

			this.getDialog().dialog(
			{
				autoOpen: false,
				width: 300,
				height: 350,
				modal: true,
				resizable: false,
				buttons:
				{
					"Update": function()
					{
						if(!self.displayMessages())
						{
							if(typeof self.component !== "undefined" && self.component != null)
							{
								var name = $(self.selector + " [name='name']").val();
								var type = $(self.selector + " [name='type'] option:selected").attr("value");
								var layer = $(self.selector + " [name='layer']").val();

								// If nothing changes, then don't update.
								if(name != self.component.model.get("name") && name.length > 0)
									self.component.model.set({name: name});

								if(type != self.component.model.get("type"))
									self.component.model.set({type: type});

								if(layer != self.component.model.get("layer"))
									self.component.model.set({layer: layer});
							}

							$(this).dialog("close");
						}

						else
							$(this).scrollTop(0);
					},
					Cancel: function()
					{
						$(this).dialog("close");
					}
				},
				open: function()
				{
					self.attachEvents();
					self.removeMessages();
					self.component.model.set({editing: true});
				},
				close: function()
				{
					self.detachEvents();
					self.sortModelViewsByLayer();
					self.component.model.set({editing: false});
					ViewManager.views.templateComponents.renderCanvas();
				}
			});
		},
		attachEvents: function()
		{
			var self = this;

			this.infos.layerInfo =
			'<h4>Please note:</h4>' +
			'<ul>' +
			'<li>The highest layer value is the forward-most layer.</li>' +
			'<li>Only 1 component is allowed per layer.</li>' +
			'<li>The <b>background</b> layer is on <b>layer ' + ViewManager.views.templateComponents.componentsSubView.backgroundLayer + '</b>.</li>' +
			'</ul>';

			$(this.selectors.layerInput).on("input", function(e)
			{
				self.errors.layerError = '';

				if($(this).val().length > 0)
				{
					if(
						(ViewManager.views.templateComponents.componentsSubView.isLayer($(this).val()) &&
						$(this).val() != self.component.model.get("layer")) ||
						$(this).val() == ViewManager.views.templateComponents.componentsSubView.backgroundLayer)
					{
						if($(this).val() == ViewManager.views.templateComponents.componentsSubView.backgroundLayer)
						{
							self.errors.layerError = 'Layer "' + $(this).val() + '" is the background layer. ' +
							'To put this component behind the background, the layer must be below layer "' + $(this).val() + '".';
						}

						else
							self.errors.layerError = 'Layer "' + $(this).val() + '" is already assigned to a component.';

						GeneralHelper.setInputFail(self.selectors.layerInput);
					}

					else
						GeneralHelper.setInputSuccess(self.selectors.layerInput);
				}

				else
					GeneralHelper.setInputDefault(self.selectors.layerInput);
			});

			// Display initial messages.
			this.displayMessages();
		},
		detachEvents: function()
		{
			$(this.selectors.layerInput).off("input");
		},
		displayMessages: function()
		{
			$(this.selectors.containerMessages).empty();

			var frag = document.createDocumentFragment();


			// LAYER ERROR
			if(
				typeof this.errors.layerError !== "undefined" &&
				this.errors.layerError.length > 0)
			{
				var el = document.createElement("div");
				el.className = "dialog-message dialog-error";

				el.innerHTML = this.errors.layerError;
				frag.appendChild(el);
			}

			// LAYER INFO
			if(
				typeof this.infos.layerInfo !== "undefined" &&
				this.infos.layerInfo.length > 0)
			{
				var el = document.createElement("div");
				el.className = "dialog-message dialog-info";
				el.style.fontSize = "10px";

				el.innerHTML = this.infos.layerInfo;
				frag.appendChild(el);
			}


			$(this.selectors.containerMessages).append(frag);

			if($(this.selectors.containerMessages).html().length > 0)
				return true;
			else
				return false;
		},
		removeMessages: function()
		{
			this.errors = {};
			this.infos = {};
		},
		sortModelViewsByLayer: function()
		{
			ViewManager.views.templateComponents.componentsSubView.componentViewManager.modelViewsArray.sort(function(a, b)
			{
				return a.model.get("layer") - b.model.get("layer");
			});
		}
	});

	return EditComponentDialog;
});