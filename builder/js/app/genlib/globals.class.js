define([], function()
{
	var Globals =
	{
		ROOT: "http://localhost/ccgbuilder/",
		DEVICE: "",
		IS_MOBILE_DEVICE: false,

		initialize: function()
		{
			this.DEVICE = navigator.userAgent.toLowerCase();
			this.IS_MOBILE_DEVICE = (/android|webos|iphone|ipad|ipod|blackberry/i.test(this.DEVICE));
		}
	};

	return Globals;
});