define([], function()
{
	var ComponentType =
	{
		TEXT: 0,
		IMAGE: 1,

		getComponentType: function(strType)
		{
			if(strType == "text")
				return this.TEXT;
			
			else if(strType == "image")
				return this.IMAGE;
		}
	};

	return ComponentType;
});