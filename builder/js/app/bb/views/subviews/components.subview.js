define(
	[
		"jquery",
		"backbone",
		"managers/modelview.manager",
		"bb/views/modelviews/component.modelview",
		"bb/models/component.model"
	],
function(
	$,
	Backbone,
	ModelViewManager,
	ComponentModelView,
	ComponentModel)
{
	var ComponentsSubView = Backbone.View.extend(
	{
		tagName: "div",
		componentViewManager: null,
		maxComponents: 10,
		events:
		{

		},

		initialize: function(options)
		{
			if(typeof options !== "undefined")
			{
				this.maxComponents = (typeof options.maxComponents === "undefined") ? this.maxComponents : options.maxComponents;
			}
			
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
						model: new ComponentModel(
						{
							name: name
						})
					})
				);
			}
		},
		render: function()
		{
			var frag = this.componentViewManager.createDocumentFragment();
			this.$el.html(frag);

			return this;
		}
	});

	return ComponentsSubView;
});