define(["modernizr"], function(Modernizr)
{
	var ModernizrHelper =
	{
		testDataUri: function(onComplete)
		{
			onComplete = (typeof onComplete === "function") ? onComplete : function(result) {};

			if(typeof Modernizr.datauri === "undefined")
			{
				var datauri = new Image();

			  	datauri.onerror = function()
			  	{
			    	Modernizr.addTest('datauri', function () { return false; });
			    	onComplete(Modernizr.datauri);
			  	};

			  	datauri.onload = function()
			  	{
			    	Modernizr.addTest('datauri', function () { return (datauri.width == 1 && datauri.height == 1); });
			    	onComplete(Modernizr.datauri);
			  	};

				datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			}

			else
				onComplete(Modernizr.datauri);
		}
	};

	return ModernizrHelper;
});