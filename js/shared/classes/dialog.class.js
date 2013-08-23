define(
	[
		"jquery",
		"underscore",
		"shared/classes/class.class"
	],
function(
	$,
	_)
{
	var Dialog = Class.extend(
	{
		selector: "",

		init: function(dialogSelector)
		{
			this.selector = dialogSelector;
		},
		initialize: function()
		{

		},
		getDialog: function()
		{
			return $(this.selector);
		}
	});

	return Dialog;
});