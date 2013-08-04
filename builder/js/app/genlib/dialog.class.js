define(
	[
		"jquery",
		"underscore",
		"genlib/class.class"
	],
function(
	$,
	_)
{
	var Dialog = Class.extend(
	{
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