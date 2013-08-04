define(
	[
		"jquery",
		"genlib/dialog.class",
		"managers/view.manager"
	],
function(
	$,
	Dialog,
	ViewManager)
{
	var EditComponentDialog = Dialog.extend(
	{
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
						var name = $(self.selector + " [name='name']").val();
						var type = $(self.selector + " [name='type'] option:selected").attr("value");
						var layer = $(self.selector + " [name='layer']").val();
						var component = componentViewManager.modelViews[$(self.selector + " [name='componentCID']").val()];

						// If nothing changes, then don't update.
						if(name != component.model.get("name") && name.length > 0)
							component.model.set({name: name});

						if(type != component.model.get("type"))
							component.model.set({type: type});

						if(layer != component.model.get("layer"))
							component.model.set({layer: layer});

						$(this).dialog("close");
					},
					Cancel: function()
					{
						$(this).dialog("close");
					}
				},
				close: function()
				{
					ViewManager.views.templateComponents.renderCanvas();
				}
			});
		}
	});

	return EditComponentDialog;
});