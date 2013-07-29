define([], function()
{
	var ObjectEvent =
	{
		changeObjAttr: function(context, attr, value, eventCallback)
		{
			eventCallback = (typeof eventCallback === "function") ? eventCallback : function(context){};

			if(typeof context[attr] !== "undefined")
			{
				context[attr] = value;
				eventCallback(context);
			}
		}
	};

	return ObjectEvent;
});