define(
	[
		"jquery",
		"other/dialogs/dialog.class",
		"managers/view.manager"
	],
function(
	$,
	Dialog,
	ViewManager)
{
	var EditComponentDialog = Dialog.extend(
	{
		component: null,

		initialize: function(componentViewManager)
		{
			var self = this;

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
					},
					Cancel: function()
					{
						$(this).dialog("close");
					}
				},
				open: function()
				{
					self.component.model.set({editing: true});
				},
				close: function()
				{
					self.component.model.set({editing: false});
					ViewManager.views.templateComponents.renderCanvas();
				}
			});
		}
	});

	return EditComponentDialog;
});