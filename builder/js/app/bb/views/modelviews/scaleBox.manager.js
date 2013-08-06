define(
	[
		"helpers/canvas.helper",
		"helpers/math.helper",
		"bb/views/modelviews/scaleBox.class",
		"genlib/class.class"
	],
function(
	CanvasHelper,
	MathHelper,
	ScaleBox)
{
	var ScaleBoxManager = Class.extend(
	{
		canvasHelper: null,
		scaleBoxes: [],

		init: function(canvas)
		{
			this.canvasHelper = new CanvasHelper(canvas);
		},
		initLayout: function(boxWidth, boxHeight, boxColor, positions)
		{
			for(var i = 0; i < positions.length; i++)
			{
				this.scaleBoxes.push(
					new ScaleBox(boxWidth, boxHeight, boxColor, positions[i]));
			}
		},
		getScaleBoxByPoint: function(x, y)
		{
			var scaleBox = false;

			for(var i = 0; i < this.scaleBoxes.length; i++)
			{
				if(MathHelper.pointWithinRect(
					x, this.scaleBoxes[i].x,
					y, this.scaleBoxes[i].y,
					this.scaleBoxes[i].width,
					this.scaleBoxes[i].height
					))
				{
					scaleBox = this.scaleBoxes[i];
					break;
				}
			}

			return scaleBox;
		},
		renderAll: function(parentX, parentY, parentWidth, parentHeight)
		{
			for(var i = 0; i < this.scaleBoxes.length; i++)
				this.scaleBoxes[i].render(this.canvasHelper.getCanvas(), parentX, parentY, parentWidth, parentHeight);
		}
	});

	return ScaleBoxManager;
});