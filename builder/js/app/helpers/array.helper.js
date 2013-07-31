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
		},
		sortByKey: function(array, key, lowToHigh)
		{
			lowToHigh = (typeof lowToHigh !== "undefined") ? lowToHigh : true;

	    	return array.sort(function(a, b)
	    	{
		        var x = a[key];
		        var y = b[key];

		        if (typeof x === "String")
		        {
		            x = x.toLowerCase(); 
		            y = y.toLowerCase();
		        }

		        if(lowToHigh)
		        	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		        else
		        	return ((x < y) ? 1 : ((x > y) ? -1 : 0));
	    	});
		}
	};

	return ArrayHelper;
});