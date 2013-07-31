define(
	[
		"underscore",
		"backbone",
		"helpers/array.helper"
	],
function(
	_,
	Backbone,
	ArrayHelper)
{
	var ModelViewManager = function()
	{
		
	};

	_.extend(ModelViewManager.prototype, {},
	{
		modelViews: {},
		modelViewsArray: [],
		count: 0,

		add: function(view)
		{
			this.modelViewsArray.push(view);
			this.modelViews[view.model.cid] = view;

			this.count++;
		},
		remove: function(cid)
		{
			this.modelViewsArray.splice(this.modelViewsArray.indexOf(this.modelViews[cid]), 1);
			delete this.modelViews[cid];
			this.count--;
		},
		renderAll: function(parent, orderBy, orderLowToHigh)
		{
			parent = (typeof parent !== "undefined") ? parent : null;
			orderBy = (typeof orderBy !== "undefined") ? orderBy : null;
			orderLowToHigh = (typeof orderLowToHigh !== "undefined") ? orderLowToHigh : true;


			var orderedModelViews = ArrayHelper.sortByKey(this.modelViewsArray, "zIndex");


			for(var i = 0; i < this.orderedModelViews.length; i++)
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