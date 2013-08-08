define(["jquery"], function($)
{
	var BootstrapAlertHelper =
	{
		onShow: function() {},

		initAlert: function(alertSelector, onClose)
		{
			alertSelector = (typeof alertSelector !== "undefined" && alertSelector.length > 0) ? alertSelector : "body";
			onClose = (typeof onClose === "function") ? onClose : function(alertSelector){};

			$(alertSelector).hide();
			$(alertSelector + " .close").click(function(e)
			{
				onClose($(this).parent());
				return false;
			});
		},
		initAllAlerts: function(containerSelector, onClose)
		{
			containerSelector = (typeof containerSelector !== "undefined" && containerSelector.length > 0) ? containerSelector : "body";
			onClose = (typeof onClose === "function") ? onClose : function(alertSelector){};

			$(containerSelector + " .alert").hide();
			$(containerSelector + " .alert .close").click(function(e)
			{
				onClose($(this).parent());
				return false;
			});
		},
		showAlert: function(alertSelector, fadeIn, onFadeInComplete)
		{
			alertSelector = (typeof alertSelector !== "undefined" && alertSelector.length > 0) ? alertSelector : "";
			fadeIn = (typeof fadeIn === "integer") ? fadeIn : false;
			onFadeInComplete = (typeof onFadeInComplete === "function") ? onFadeInComplete : function(e){};

			if(fadeIn != false)
				$(alertSelector).fadeIn(fadeIn, onFadeInComplete);
			else
				$(alertSelector).show();

			this.onShow();
		},
		hideAlert: function(alertSelector, fadeOut, onFadeOutComplete)
		{
			alertSelector = (typeof alertSelector !== "undefined" && alertSelector.length > 0) ? alertSelector : "";
			fadeOut = (typeof fadeOut !== "integer") ? fadeOut : false;
			onFadeOutComplete = (typeof onFadeOutComplete === "function") ? onFadeOutComplete : function(e){};

			if(fadeOut != false)
				$(alertSelector).fadeOut(fadeOut, onFadeOutComplete);
			else
				$(alertSelector).hide();
		},
		hideAllAlerts: function(containerSelector, fadeOut, onFadeOutComplete)
		{
			containerSelector = (typeof containerSelector !== "undefined" && containerSelector.length > 0) ? containerSelector : "";
			fadeOut = (typeof fadeOut !== "integer") ? fadeOut : false;
			onFadeOutComplete = (typeof onFadeOutComplete === "function") ? onFadeOutComplete : function(e){};

			if(fadeOut != false)
				$(containerSelector + " .alert").fadeOut(fadeOut, onFadeOutComplete);
			else
				$(containerSelector + " .alert").hide();
		}
	};

	return BootstrapAlertHelper;
});