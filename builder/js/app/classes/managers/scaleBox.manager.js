define(
	[
		"shared/enums/position.enum",
		"shared/classes/helpers/canvas.helper",
		"shared/classes/helpers/math.helper",
		"classes/scaleBox.class",
		"shared/classes/class.class"
	],
function(
	Position,
	CanvasHelper,
	MathHelper,
	ScaleBox)
{
	var ScaleBoxManager = Class.extend(
	{
		canvasHelper: null,
		scaleBoxes: [],
		parentModel: false,

		init: function(canvas, parentModel)
		{
			this.canvasHelper = new CanvasHelper(canvas);
			this.parentModel = parentModel;
		},
		initLayout: function(boxWidth, boxHeight, boxColor, positions)
		{
			for(var i = 0; i < positions.length; i++)
			{
				this.scaleBoxes.push(
					new ScaleBox(boxWidth, boxHeight, boxColor, positions[i]));
			}
		},
		updateCursor: function(scaleBox)
		{
			scaleBox =
			(typeof scaleBox !== "undefined" && scaleBox)
			? scaleBox
			: {position: Position.DEFAULT};

			switch(scaleBox.position)
			{
				case Position.DEFAULT:
					this.canvasHelper.getCanvas().css("cursor", "default");
					break;

				case Position.TOP_LEFT:
					this.canvasHelper.getCanvas().css("cursor", "nw-resize");
					break;

				case Position.TOP_MID:
					this.canvasHelper.getCanvas().css("cursor", "n-resize");
					break;

				case Position.TOP_RIGHT:
					this.canvasHelper.getCanvas().css("cursor", "ne-resize");
					break;

				case Position.MID_LEFT:
					this.canvasHelper.getCanvas().css("cursor", "w-resize");
					break;

				case Position.MID_RIGHT:
					this.canvasHelper.getCanvas().css("cursor", "e-resize");
					break;

				case Position.BOTTOM_LEFT:
					this.canvasHelper.getCanvas().css("cursor", "sw-resize");
					break;

				case Position.BOTTOM_MID:
					this.canvasHelper.getCanvas().css("cursor", "s-resize");
					break;

				case Position.BOTTOM_RIGHT:
					this.canvasHelper.getCanvas().css("cursor", "se-resize");
					break;
			}
		},
		scaleParent: function(scalePointX, scalePointY, scaleBoxPosition)
		{
			switch(scaleBoxPosition)
			{
				case Position.DEFAULT:
					break;

				case Position.TOP_LEFT:
					this.scaleTopLeft(scalePointX, scalePointY);
					break;

				case Position.TOP_MID:
					this.scaleTopMid(scalePointX, scalePointY);
					break;

				case Position.TOP_RIGHT:
					this.scaleTopRight(scalePointX, scalePointY);
					break;

				case Position.MID_LEFT:
					this.scaleMidLeft(scalePointX, scalePointY);
					break;

				case Position.MID_RIGHT:
					this.scaleMidRight(scalePointX, scalePointY);
					break;

				case Position.BOTTOM_LEFT:
					this.scaleBottomLeft(scalePointX, scalePointY);
					break;

				case Position.BOTTOM_MID:
					this.scaleBottomMid(scalePointX, scalePointY);
					break;

				case Position.BOTTOM_RIGHT:
					this.scaleBottomRight(scalePointX, scalePointY);
					break;
			}
		},
		scaleTopLeft: function(scalePointX, scalePointY)
		{
			var displacedX = Math.round(scalePointX - this.parentModel.get("x"));
			var displacedY = Math.round(scalePointY - this.parentModel.get("y"));
			var absDisplacedX = Math.abs(displacedX);
			var absDisplacedY = Math.abs(displacedY);

			// Drag left.
			if(displacedX < 0)
			{
				// Calculate how much the X actually changed.
				// It may not be displacedX since the X is bound to the canvas.
				var xDifference = this.parentModel.get("x");
				this.parentModel.set({x: this.parentModel.get("x") - absDisplacedX});
				xDifference = xDifference - this.parentModel.get("x");

				this.parentModel.set({width: this.parentModel.get("width") + xDifference});
			}

			// Drag right.
			else if(displacedX > 0)
			{
				// Calculate how much the width actually changed.
				// It may not be displacedX since the width is bound by minWidth.
				var widthDifference = this.parentModel.get("width");
				this.parentModel.set({width: this.parentModel.get("width") - absDisplacedX});
				widthDifference = widthDifference - this.parentModel.get("width");

				this.parentModel.set({x: this.parentModel.get("x") + widthDifference});
			}

			// Drag up.
			if(displacedY < 0)
			{
				// Calculate how much the Y actually changed.
				// It may not be displacedY since the Y is bound to the canvas.
				var yDifference = this.parentModel.get("y");
				this.parentModel.set({y: this.parentModel.get("y") - absDisplacedY});
				yDifference = yDifference - this.parentModel.get("y");

				this.parentModel.set({height: this.parentModel.get("height") + yDifference});
			}

			// Drag down.
			else if(displacedY > 0)
			{
				// Calculate how much the height actually changed.
				// It may not be displacedY since the height is bound by minHeight.
				var heightDifference = this.parentModel.get("height");
				this.parentModel.set({height: this.parentModel.get("height") - absDisplacedY});
				heightDifference = heightDifference - this.parentModel.get("height");

				this.parentModel.set({y: this.parentModel.get("y") + heightDifference});
			}
		},
		scaleTopMid: function(scalePointX, scalePointY)
		{
			var displacedY = Math.round(scalePointY - this.parentModel.get("y"));
			var absDisplacedY = Math.abs(displacedY);

			// Drag up.
			if(displacedY < 0)
			{
				// Calculate how much the Y actually changed.
				// It may not be displacedY since the Y is bound to the canvas.
				var yDifference = this.parentModel.get("y");
				this.parentModel.set({y: this.parentModel.get("y") - absDisplacedY});
				yDifference = yDifference - this.parentModel.get("y");

				this.parentModel.set({height: this.parentModel.get("height") + yDifference});
			}

			// Drag down.
			else if(displacedY > 0)
			{
				// Calculate how much the height actually changed.
				// It may not be displacedY since the height is bound by minHeight.
				var heightDifference = this.parentModel.get("height");
				this.parentModel.set({height: this.parentModel.get("height") - absDisplacedY});
				heightDifference = heightDifference - this.parentModel.get("height");

				this.parentModel.set({y: this.parentModel.get("y") + heightDifference});
			}
		},
		scaleTopRight: function(scalePointX, scalePointY)
		{
			var displacedWidth = Math.round(
				scalePointX - (this.parentModel.get("x") + this.parentModel.get("width")));

			var displacedY = Math.round(scalePointY - this.parentModel.get("y"));
			var absDisplacedWidth = Math.abs(displacedWidth);
			var absDisplacedY = Math.abs(displacedY);

			// Drag left.
			if(displacedWidth < 0)
				this.parentModel.set({width: this.parentModel.get("width") - absDisplacedWidth});

			// Drag right.
			else if(displacedWidth > 0)
				this.parentModel.set({width: this.parentModel.get("width") + absDisplacedWidth});

			// Drag up.
			if(displacedY < 0)
			{
				// Calculate how much the Y actually changed.
				// It may not be displacedY since the Y is bound to the canvas.
				var yDifference = this.parentModel.get("y");
				this.parentModel.set({y: this.parentModel.get("y") - absDisplacedY});
				yDifference = yDifference - this.parentModel.get("y");

				this.parentModel.set({height: this.parentModel.get("height") + yDifference});
			}

			// Drag down.
			else if(displacedY > 0)
			{
				// Calculate how much the height actually changed.
				// It may not be displacedY since the height is bound by minHeight.
				var heightDifference = this.parentModel.get("height");
				this.parentModel.set({height: this.parentModel.get("height") - absDisplacedY});
				heightDifference = heightDifference - this.parentModel.get("height");

				this.parentModel.set({y: this.parentModel.get("y") + heightDifference});
			}
		},
		scaleMidLeft: function(scalePointX, scalePointY)
		{
			var displacedX = Math.round(scalePointX - this.parentModel.get("x"));
			var absDisplacedX = Math.abs(displacedX);

			// Drag left.
			if(displacedX < 0)
			{
				// Calculate how much the X actually changed.
				// It may not be displacedX since the X is bound to the canvas.
				var xDifference = this.parentModel.get("x");
				this.parentModel.set({x: this.parentModel.get("x") - absDisplacedX});
				xDifference = xDifference - this.parentModel.get("x");

				this.parentModel.set({width: this.parentModel.get("width") + xDifference});
			}

			// Drag right.
			else if(displacedX > 0)
			{
				// Calculate how much the width actually changed.
				// It may not be displacedX since the width is bound by minWidth.
				var widthDifference = this.parentModel.get("width");
				this.parentModel.set({width: this.parentModel.get("width") - absDisplacedX});
				widthDifference = widthDifference - this.parentModel.get("width");

				this.parentModel.set({x: this.parentModel.get("x") + widthDifference});
			}
		},
		scaleMidRight: function(scalePointX, scalePointY)
		{
			var displacedWidth = Math.round(
				scalePointX - (this.parentModel.get("x") + this.parentModel.get("width")));

			var absDisplacedWidth = Math.abs(displacedWidth);

			// Drag left.
			if(displacedWidth < 0)
				this.parentModel.set({width: this.parentModel.get("width") - absDisplacedWidth});

			// Drag right.
			else if(displacedWidth > 0)
				this.parentModel.set({width: this.parentModel.get("width") + absDisplacedWidth});
		},
		scaleBottomLeft: function(scalePointX, scalePointY)
		{
			var displacedX = Math.round(scalePointX - this.parentModel.get("x"));
			var displacedHeight = Math.round(
				scalePointY - (this.parentModel.get("y") + this.parentModel.get("height")));

			var absDisplacedX = Math.abs(displacedX);
			var absDisplacedHeight = Math.abs(displacedHeight);

			// Drag left.
			if(displacedX < 0)
			{
				// Calculate how much the X actually changed.
				// It may not be displacedX since the X is bound to the canvas.
				var xDifference = this.parentModel.get("x");
				this.parentModel.set({x: this.parentModel.get("x") - absDisplacedX});
				xDifference = xDifference - this.parentModel.get("x");

				this.parentModel.set({width: this.parentModel.get("width") + xDifference});
			}

			// Drag right.
			else if(displacedX > 0)
			{
				// Calculate how much the width actually changed.
				// It may not be displacedX since the width is bound by minWidth.
				var widthDifference = this.parentModel.get("width");
				this.parentModel.set({width: this.parentModel.get("width") - absDisplacedX});
				widthDifference = widthDifference - this.parentModel.get("width");

				this.parentModel.set({x: this.parentModel.get("x") + widthDifference});
			}

			// Drag up.
			if(displacedHeight < 0)
				this.parentModel.set({height: this.parentModel.get("height") - absDisplacedHeight});

			// Drag down.
			else if(displacedHeight > 0)
				this.parentModel.set({height: this.parentModel.get("height") + absDisplacedHeight});
		},
		scaleBottomMid: function(scalePointX, scalePointY)
		{
			var displacedHeight = Math.round(
				scalePointY - (this.parentModel.get("y") + this.parentModel.get("height")));

			var absDisplacedHeight = Math.abs(displacedHeight);

			// Drag up.
			if(displacedHeight < 0)
				this.parentModel.set({height: this.parentModel.get("height") - absDisplacedHeight});

			// Drag down.
			else if(displacedHeight > 0)
				this.parentModel.set({height: this.parentModel.get("height") + absDisplacedHeight});
		},
		scaleBottomRight: function(scalePointX, scalePointY)
		{
			var displacedWidth = Math.round(
				scalePointX - (this.parentModel.get("x") + this.parentModel.get("width")));

			var displacedHeight = Math.round(
				scalePointY - (this.parentModel.get("y") + this.parentModel.get("height")));

			var absDisplacedWidth = Math.abs(displacedWidth);
			var absDisplacedHeight = Math.abs(displacedHeight);

			// Drag left.
			if(displacedWidth < 0)
				this.parentModel.set({width: this.parentModel.get("width") - absDisplacedWidth});

			// Drag right.
			else if(displacedWidth > 0)
				this.parentModel.set({width: this.parentModel.get("width") + absDisplacedWidth});

			// Drag up.
			if(displacedHeight < 0)
				this.parentModel.set({height: this.parentModel.get("height") - absDisplacedHeight});

			// Drag down.
			else if(displacedHeight > 0)
				this.parentModel.set({height: this.parentModel.get("height") + absDisplacedHeight});
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
		renderAll: function()
		{
			for(var i = 0; i < this.scaleBoxes.length; i++)
			{
				this.scaleBoxes[i].render(
					this.canvasHelper.getCanvas(),
					this.parentModel.get("x"), this.parentModel.get("y"),
					this.parentModel.get("width"), this.parentModel.get("height"));
			}
		}
	});

	return ScaleBoxManager;
});