define([], function()
{
	var GeneralHelper =
	{
		setInputDefault: function(selector)
		{
			$(selector).addClass("input-default");
			$(selector).removeClass("input-success");
			$(selector).removeClass("input-fail");
		},
		setInputSuccess: function(selector)
		{
			$(selector).removeClass("input-default");
			$(selector).addClass("input-success");
			$(selector).removeClass("input-fail");
		},
		setInputFail: function(selector)
		{
			$(selector).removeClass("input-default");
			$(selector).removeClass("input-success");
			$(selector).addClass("input-fail");
		}
	}

	return GeneralHelper;
});