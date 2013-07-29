define([], function()
{
	var ViewManager =
	{
		views: {},
		
		exists: function(key)
		{
			if(typeof this.views.key !== "undefined")
				return true;
			else
				return false;
		},
		clear: function()
		{
			this.views = {};
		}
	};

	return ViewManager;
});