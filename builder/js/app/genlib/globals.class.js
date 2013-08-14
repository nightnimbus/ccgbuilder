define([], function()
{
	var Globals =
	{
		//ROOT: "localhost/ccgbuilder/",
		ROOT: "192.168.1.4/ccgbuilder/",
		USERAGENT: "",
		IS_MOBILE_DEVICE: false,

		initialize: function()
		{
			this.USERAGENT = navigator.userAgent.toLowerCase();
			this.IS_MOBILE_DEVICE = (/android|webos|iphone|ipad|ipod|blackberry/i.test(this.USERAGENT));
		},
		isIEVersion: function(version)
		{
			var classStrAboveVersion = ".lt-ie" + (version+1).toString();
			var classStrBelowVersion = ".lt-ie" + version.toString();

			if($("html").is(classStrAboveVersion) && !$("html").is(classStrBelowVersion))
				return true;
			else
				return false;
		},
		isLtIEVersion: function(version)
		{
			var classStr = ".lt-ie" + version.toString();
			return $("html").is(classStr);
		}
	};

	return Globals;
});