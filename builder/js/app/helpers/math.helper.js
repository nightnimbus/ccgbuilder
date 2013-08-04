define([], function()
{
	var MathHelper =
	{
		percentOf: function(sum, percent)
		{
			return ((sum * percent) / 100);
		},
		getPercentage: function(partial, sum)
		{
			return ((partial * 100) / sum);
		}
	};

	return MathHelper;
});