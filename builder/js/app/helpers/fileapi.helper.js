define([], function()
{
	var CanvasHelper =
	{
		resizeImage: function(tmpImg, width, height, encoding)
		{
			var data = null;
			var context = null;
			var canvas = document.getElementById("hiddenCanvas");

	        canvas.width = width;
	        canvas.height = height;

	        context = canvas.getContext("2d");
	        context.drawImage(tmpImg, 0, 0, width, height);

	        data = canvas.toDataURL(encoding);

			return data;
		}
	};

	return CanvasHelper;
});