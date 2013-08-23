define(
	[
		"shared/enums/position.enum",
		"shared/classes/helpers/canvas.helper",
		"shared/classes/class.class"
	],
function(
	Position,
	CanvasHelper)
{
	var ScaleBox = Class.extend(
	{
		x: 0,
		y: 0,
		width: 5,
		height: 5,
		color: "white",
		position: Position.TOP_LEFT,

		init: function(width, height, color, position)
		{
			this.width = width;
			this.height = height;
			this.color = color;
			this.position = position;
		},
		render: function(canvas, parentX, parentY, parentWidth, parentHeight)
		{
			switch(this.position)
			{
				case Position.TOP_LEFT:

					this.x = parentX - (this.width / 2);
					this.y = parentY - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.TOP_MID:

					this.x = (parentX + (parentWidth / 2)) - (this.width / 2);
					this.y = parentY - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.TOP_RIGHT:

					this.x = (parentX + parentWidth) - (this.width / 2);
					this.y = parentY - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.MID_LEFT:

					this.x = parentX - (this.width / 2);
					this.y = (parentY + (parentHeight / 2)) - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.MID_RIGHT:

					this.x = (parentX + parentWidth) - (this.width / 2);
					this.y = (parentY + (parentHeight / 2)) - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.BOTTOM_LEFT:

					this.x = parentX - (this.width / 2);
					this.y = (parentY + parentHeight) - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.BOTTOM_MID:

					this.x = (parentX + (parentWidth / 2)) - (this.width / 2);
					this.y = (parentY + parentHeight) - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;

				case Position.BOTTOM_RIGHT:

					this.x = (parentX + parentWidth) - (this.width / 2);
					this.y = (parentY + parentHeight) - (this.height / 2);

					$(canvas).drawRect(
					{
						x: this.x,
						y: this.y,
						width: this.width,
						height: this.height,
						fillStyle: this.color,
						fromCenter: false
					});

					break;
			}
		}
	});

	return ScaleBox;
});