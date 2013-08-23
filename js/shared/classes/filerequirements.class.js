define(["shared/classes/class.class"], function()
{
	var FileRequirements = Class.extend(
	{
		maxSize: false,
		types: [],
		aspectRatio: false,

		init: function(maxSize, types, aspectRatio)
		{
			maxSize = (typeof maxSize === "integer") ? maxSize : 50;
			types = (typeof types !== "undefined") ? types : ["image/jpeg"];
			aspectRatio = (typeof aspectRatio !== "undefined") ? aspectRatio : 4/3;

			this.maxSize = maxSize;
			this.types = types;
			this.aspectRatio = aspectRatio;
		},
		check: function(size, type, aspectRatio)
		{
			size = (typeof size !== "undefined") ? size : false;
			type = (typeof type === "string") ? type : false;
			aspectRatio = (typeof aspectRatio !== "undefined") ? aspectRatio : false;

			var sizeCheck = false;
			var typeCheck = false;
			var aspectRatioCheck = false;

			if(size && size <= this.maxSize)
				sizeCheck = true;

			if(aspectRatio && aspectRatio == this.aspectRatio)
				aspectRatioCheck = true;

			if(type && sizeCheck && aspectRatioCheck)
			{
				for(var i = 0; i < this.types.length; i++)
				{
					if(type == this.types[i])
					{
						typeCheck = true;
						break;
					}
				}
			}

			return (sizeCheck && typeCheck && aspectRatioCheck);
		}
	});

	return FileRequirements;
});