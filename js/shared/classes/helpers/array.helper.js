define([], function()
{
	var ArrayHelper =
	{
		sortLowToHigh: function(a, b)
		{
			return a - b;
		},
		sortHighToLow: function(a, b)
		{
			return b - a;
		}
	};

	return ArrayHelper;
});