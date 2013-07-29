function unbindHoverIntent(selector)
{
	$(selector).unbind("mouseenter").unbind("mouseleave");
	$(selector).removeProp('hoverIntent_t');
	$(selector).removeProp('hoverIntent_s');
}