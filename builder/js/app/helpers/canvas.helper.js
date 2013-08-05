define(
	[
		"underscore",
		"genlib/class.class"
	],
function(_)
{
	var CanvasHelper = Class.extend(
	{
		init: function(canvas, width, height)
		{
			this.canvas = null;
			this.canvasSelector = "";

			if(typeof canvas !== "undefined")
			{
				this.canvas = canvas;
				this.canvasSelector = "#" + canvas.id;
			}

			else
				this.canvas = this.createCanvas();
		},
		createCanvas: function(width, height, parent)
		{
			width = (typeof width !== "undefined" && width > 0) ? width : 100;
			height = (typeof height !== "undefined" && height > 0) ? height : 100;
			parent = (typeof parent !== "undefined") ? parent : document.getElementsByTagName("body")[0];

			var canvas = document.createElement("canvas");
			parent.appendChild(canvas);

			return canvas;
		},
		getCanvas: function()
		{
			return $(this.canvasSelector);
		},
		compileFontString: function(font, fontSize, fontStyle)
		{
			font = (typeof font === "string") ? font : "Calibri";
			fontSize = (typeof fontSize !== "undefined") ? fontSize : 12;
			fontStyle = (typeof fontStyle === "string") ? fontStyle : "";

			return fontSize.toString() + "pt" + " " + font + " " + fontStyle;
		},
		decompileFontString: function(fontString)
		{
			var split = fontString.split(" ");
			var components = null;

			if(split.length >= 1)
			{
				var realSize = split[0].split("pt")[0];

				if(split.length == 2)
				{
					components =
					{
						size: realSize,
						font: split[1]
					};
				}

				else if(split.length == 3)
				{
					components =
					{
						size: realSize,
						font: split[1],
						style: split[2]
					};
				}
			}

			return components;
		},
		clear: function()
		{
			var context = this.canvas.getContext("2d");
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		drawImage: function(src, x, y, width, height)
		{
			var context = this.canvas.getContext("2d");

			x = (typeof x !== "undefined") ? x : 0;
			y = (typeof y !== "undefined") ? y : 0;
			width = (typeof width !== "undefined") ? width : 0;
			height = (typeof height !== "undefined") ? height : 0;

			var template = new Image();

			template.src = src;
			template.onload = function()
			{
				var realWidth = (width > 0) ? width : template.width;
				var realHeight = (height > 0) ? height : template.height;

				context.drawImage(template, x, y, realWidth, realHeight);
			};
		},
		drawRect: function(fillColor, x, y, width, height, borderWidth, borderColor)
		{
			var context = this.canvas.getContext("2d");

			fillColor = (typeof fillColor !== "undefined") ? fillColor : "#000000";
			x = (typeof x !== "undefined") ? x : 0;
			y = (typeof y !== "undefined") ? y : 0;
			width = (typeof width !== "undefined") ? width : 0;
			height = (typeof height !== "undefined") ? height : 0;
			borderWidth = (typeof borderWidth !== "undefined") ? borderWidth : 0;
			borderColor = (typeof borderColor !== "undefined") ? borderColor : "#000000";

			context.beginPath();
			context.rect(x, y, width, height);
			context.fillStyle = fillColor;
			context.fill();

			if(borderWidth > 0)
			{
				context.lineWidth = borderWidth;
				context.strokeStyle = borderColor;
				context.stroke();
			}
		},
		drawText: function(fontString, fontColor, text, x, y, textAlign, yCentered)
		{
			var context = this.canvas.getContext("2d");

			fontString = (typeof fontString === "string") ? fontString : "12pt Calibri";
			fontColor = (typeof fontColor !== "undefined") ? fontColor : "#000000";
			text = (typeof text === "string") ? text : "Default Text";
			x = (typeof x !== "undefined") ? x : 0;
			y = (typeof y !== "undefined") ? y : 0;
			textAlign = (typeof textAlign === "string") ? textAlign : "left";
			yCentered = (typeof yCentered !== "undefined") ? yCentered : false;

			if(yCentered)
			{
				var fontComponents = this.decompileFontString(fontString);
				if(fontComponents != null)
					y += (context.measureText('M').width) / 2;
			}

			context.font = fontString;
			context.textAlign = textAlign;
			context.fillStyle = fontColor;
			context.fillText(text, x, y);
		},
		pointWithinBounds: function(x1, y1, x2, y2, w2, h2)
		{
			return(
				x1 >= x2 &&
				x1 <= x2 + w2 &&
				y1 >= y2 &&
				y1 <= y2 + h2);
		},
		getMouseCoords: function(e)
		{
			var rect = this.canvas.getBoundingClientRect();
			var coords =
			{
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};

			return coords;
		},
		getTextWidth: function(text)
		{
			var context = this.canvas.getContext("2d");
			return context.measureText(text).width;
		},
		getTextHeight: function(fontSize, lineHeight)
		{
			lineHeight = (typeof lineHeight === "integer") ? lineHeight : 1.5;
			var context = this.canvas.getContext("2d");
			return fontSize * lineHeight;
		}
	});

	return CanvasHelper;
});