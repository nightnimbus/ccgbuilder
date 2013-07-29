define(["jquery", "handlebars", "helpers/string.helper"], function($, Handlebars, StringHelper)
{
	var HbsManager = 
	{
		templates: {},
		templatesArray: [],

		// arguments = paths to templates; use only '/' to separate directories
		loadTemplate: function(path, onSuccess, onFail)
		{
			if(path.length > 0)
			{
				// Defaults
				onSuccess = (typeof onSuccess === "function") ? onSuccess : function(){}
				onFail = (typeof onFail === "function") ? onFail : function(){}

				var self = this;
				var fileName = StringHelper.getFileName(path, false);

				if(typeof this.templates.fileName === "undefined")
				{
					$.get(path)
					.done(function(data)
					{
						var template = Handlebars.compile(data);

						self.templates[fileName] = template;
						self.templatesArray.push(template);

						onSuccess(template);
					})
					.fail(function()
					{
						onFail("Failed to get '" + path + "'.");
					});
				}

				else
					onFail('The template "' + fileName + '" has already been loaded.');
			}
		},
		loadMultipleTemplates: function(paths, onComplete, onFail)
		{
			if(paths.length > 0)
			{
				// Defaults
				onComplete = (typeof onComplete === "function") ? onComplete : function(){}
				onFail = (typeof onFail === "function") ? onFail : function(){}

				var counter = 1;
				var self = this;

				$.each(paths, function(index, path)
				{
					var fileName = StringHelper.getFileName(path, false);

					if(typeof self.templates.fileName === "undefined")
					{
						$.get(path)
						.done(function(data)
						{
							var template = Handlebars.compile(data);

							self.templates[fileName] = template;
							self.templatesArray.push(template);

							if(counter == paths.length)
								onComplete();

							counter++;
						})
						.fail(function()
						{
							onFail("Failed to get '" + path + "'.");

							if(counter == paths.length)
								onComplete();

							counter++;
						});
					}

					else
						onFail('The template "' + fileName + '" has already been loaded.');
				});
			}

			else
				onComplete();
		}
	};

	return HbsManager;
});