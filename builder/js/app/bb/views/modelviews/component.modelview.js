define(
	[
		"backbone",
		"managers/hbs.manager",
		"transform"
	],
function(
	Backbone,
	HbsManager)
{
	var ComponentModelView = Backbone.View.extend(
	{
		el: '<div class="container-component"></div>',
		events:
		{
			"mousedown": "onMouseDownComponent",
			"mouseup": "onMouseUpComponent"
		},

		initialize: function()
		{
			var self = this;

			this.listenTo(this.model, "change:name", function(model, name)
			{
				self.$el.find(".component-name").text(name);
			});

			this.listenTo(this.model, "change:selected", function(model, selected)
			{
				if(!selected)
				{
					self.$el.removeClass("component-selected");
					self.$el.addClass("component-default");
				}

				else
				{
					self.$el.removeClass("component-default");
					self.$el.addClass("component-selected");
				}
			});

			this.listenTo(this.model, "change:pos", function(model, pos)
			{
				console.log("change:pos");
			});
		},
		onMouseDownComponent: function(e)
		{
			this.model.set({selected: true});
			return false;
		},
		onMouseUpComponent: function(e)
		{
			this.model.set({selected: false});
			console.log(this.model.get("name"));

			return false;
		},
		render: function()
		{
			var self = this;

			HbsManager.loadTemplate("js/app/hbs/component.hbs", function(template)
			{
				self.$el.html(template(
				{
					name: self.model.get("name")
				}));
			});

			return this;
		}
	});

	return ComponentModelView;
});