define(
	[
		"jquery",
		"underscore",
		"genlib/class.class",
		"jqueryui"
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