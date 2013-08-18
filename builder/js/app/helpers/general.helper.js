define([], function()
{
	var GeneralHelper =
	{
		setInputDefault: function(selector)
		{
			$(selector).addClass("input-default");
			$(selector).removeClass("input-success input-fail");
		},
		setInputSuccess: function(selector)
		{
			$(selector).addClass("input-success");
			$(selector).removeClass("input-default input-fail");
		},
		setInputFail: function(selector)
		{
			$(selector).addClass("input-fail");
			$(selector).removeClass("input-default input-success");
		}
	}

	return GeneralHelper;
});