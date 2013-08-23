define(
	[
		"underscore",
		"backbone",
		"shared/classes/helpers/array.helper",
		"shared/classes/class.class"
	],
function(
	_,
	Backbone,
	ArrayHelper)
{
	var ModelViewManager = Class.extend(
	{
		modelViews: {},
		modelViewsArray: [],
		count: 0,

		add: function(view)
		{
			this.modelViewsArray.push(view);
			this.modelViews[view.model.cid] = view;

			this.count += 1;
		},
		remove: function(cid)
		{
			this.modelViewsArray.splice(this.modelViewsArray.indexOf(this.modelViews[cid]), 1);
			delete this.modelViews[cid];
			this.count--;
		},
		removeByIndex: function(index)
		{
			if(index >= 0 && index < this.modelViewsArray.length)
			{
				this.modelViewsArray.splice(index, 1);
				delete this.modelViews[this.modelViewsArray[index].model.cid];
				this.count--;
			}
		},
		renderAll: function(parent)
		{
			parent = (typeof parent !== "undefined") ? parent : null;

			for(var i = 0; i < this.modelViewsArray.length; i++)
			{
				if(parent != null)
					parent.appendChild(this.modelViewsArray[i].render().el);
				else
					this.modelViewsArray[i].render();
			}
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