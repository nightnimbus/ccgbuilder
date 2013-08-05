define(["jquery"], function($)
{
	var Globals =
	{
		ROOT: "http://localhost/ccgbuilder/",
		USERAGENT: "",
		IS_MOBILE_DEVICE: false,

		initialize: function()
		{
			this.USERAGENT = navigator.userAgent.toLowerCase();
			this.IS_MOBILE_DEVICE = (/android|webos|iphone|ipad|ipod|blackberry/i.test(this.USERAGENT));
		},
		isLtIEVersion: function(version)
		{
			var classStr = ".lt-ie" + version.toString();
			return $("html").is(classStr);
		}
	};

	return Globals;
});