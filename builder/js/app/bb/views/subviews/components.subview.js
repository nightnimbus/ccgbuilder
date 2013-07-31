define(
	[
		"jquery",
		"backbone",
		"managers/view.manager",
		"managers/modelview.manager",
		"bb/views/modelviews/component.modelview",
		"bb/models/component.model"
	],
function(
	$,
	Backbone,
	ViewManager,
	ModelViewManager,
	ComponentModelView,
	ComponentModel)
{
	var ComponentsSubView = Backbone.View.extend(
	{
		tagName: "#componentsCanvas",
		componentViewManager: null,
		canvasHelper: null,
		maxComponents: 10,
		events:
		{

		},

		initialize: function(options)
		{
			if(typeof options !== "undefined")
				this.canvasHelper = (typeof options.canvasHelper === "undefined") ? this.canvasHelper : options.canvasHelper;

			this.componentViewManager = new ModelViewManager();
		},
		addNewComponent: function()
		{
			if(this.componentViewManager.count < this.maxComponents)
			{
				var self = this;
				var name = "Component" + (self.componentViewManager.count + 1).toString();

				this.componentViewManager.add(
					new ComponentModelView(
					{
						canvasHelper: self.canvasHelper,
						model: new ComponentModel(
						{
							name: name,
							x: 0, y: 0,
							width: self.canvasHelper.canvas.width,
							height: 30,
							fillColor: "#FF0000"
						})
					})
				);

				this.componentViewManager.modelViewsArray[this.componentViewManager.count-1].render();
			}
		},
		render: function()
		{
			this.canvasHelper.clear();

			this.componentViewManager.renderAll(null, "zIndex");
		}
	});

	return ComponentsSubView;
});