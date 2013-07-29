define(["underscore", "backbone"], function(_, Backbone)
{
	var ModelViewManager = function()
	{
		
	};

	_.extend(ModelViewManager.prototype, {},
	{
		modelViews: {},

		add: function(view)
		{
			this.modelViews[view.model.cid] = view;
		},
		remove: function(cid)
		{
			delete this.modelViews[cid];
		},
		createDocumentFragment: function()
		{
			var frag = document.createDocumentFragment();

			_.each(this.modelViews, function(modelView)
			{
				frag.appendChild(modelView.render().el);
			});

			return frag;
		},
		generateHtml: function()
		{
			var html = "";

			_.each(this.modelViews, function(modelView)
			{
				html += modelView.render().$el.html();
			});
			
			return html;
		},
		clear: function()
		{
			this.modelViews = {};
		}
	});

	return ModelViewManager;
});