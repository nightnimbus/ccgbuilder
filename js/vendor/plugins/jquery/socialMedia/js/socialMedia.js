/*
* Author:      		 Marco Kuiper (http://www.marcofolio.net/)
* User Revisions:    Derek Walker
*/

(function($)
{
	$.fn.socialMedia = function()
	{
		return this.each(function()
		{
			$("li", this).each(function() {
				$("a strong", this).css("opacity", "0");
			});

			$("li", this).hover(function() { // Mouse over
				$(this)
					.stop().fadeTo(500, 1)
					.siblings().stop().fadeTo(500, 0.2);
					
				$("a strong", this)
					.stop()
					.animate({
						opacity: 1,
						top: "-10px"
					}, 300);
				
			}, function() { // Mouse out
				$(this)
					.stop().fadeTo(500, 1)
					.siblings().stop().fadeTo(500, 1);
					
				$("a strong", this)
					.stop()
					.animate({
						opacity: 0,
						top: "-1px"
					}, 300);
			});
		});
	};
})(jQuery);