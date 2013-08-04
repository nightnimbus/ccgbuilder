define(
	[
		"managers/view.manager",
		"other/dialogs/dialog.class"
	],
function(
	ViewManager,
	Dialog)
{
	var DeleteComponentYesNoDialog = Dialog.extend(
	{
		component: null,

		initialize: function(componentViewManager)
		{
			var self = this;

			this.getDialog().dialog(
			{
				autoOpen: false,
				width: 280,
				height: 200,
				modal: true,
				resizable: false,
				buttons:
				{
					"Yes": function()
					{
						if(typeof self.component !== "undefined" && self.component != null)
							componentViewManager.remove(self.component.model.cid);

						$(this).dialog("close");
					},
					"No": function()
					{
						$(this).dialog("close");
					}
				},
				open: function()
				{
					self.component.model.set({deleting: true});
				},
				close: function()
				{
					self.component.model.set({deleting: false});
					ViewManager.views.templateComponents.renderCanvas();
				}
			});
		}
	});

	return DeleteComponentYesNoDialog;
});