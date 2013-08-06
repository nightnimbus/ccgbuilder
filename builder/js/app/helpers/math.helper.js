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
		},
		pointWithinRect: function(x1, x2, y1, y2, w2, h2)
		{
			return(
				x1 >= x2 &&
				x1 <= x2 + w2 &&
				y1 >= y2 &&
				y1 <= y2 + h2);
		}
	};

	return MathHelper;
});