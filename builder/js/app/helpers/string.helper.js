define(["underscore"], function(_)
{
	var StringHelper =
	{
		getFileName: function(path, incExt)
		{
			incExt = (typeof incExt !== "undefined") ? incExt : true;

			// Decide which type of directory divider is before the file name
			var lastPathStart = (path.lastIndexOf("\\") > path.lastIndexOf("/")) ? path.lastIndexOf("\\")+1 : path.lastIndexOf("/")+1;

			if(incExt == true)
				return path.substring(lastPathStart);
			else
				return path.substring(lastPathStart, path.lastIndexOf("."));
		},
		getResComponents: function(res)
		{
			var w = res.substr(0, res.lastIndexOf('x'));
			var h = res.substr(res.lastIndexOf('x')+1);

			return new Array(w, h);
		},
		replaceRange: function(str, vertex1, vertex2, replaceStr)
		{
			return str.substr(0, vertex1) + replaceStr + str.substr(vertex2);
		}
	};

	return StringHelper;
});