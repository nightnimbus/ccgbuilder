/*
parent = boolean/obj; the empty <span> or <div> to place the alert in; false if no parent
multiline = boolean; if true, adds the "alert-block" class
type = string(class); the class name of the type of alert; e.g. "alert-success"
message = string(html); the html body of the alert
*/
function showAlert(parent, multiline, type, message)
{
	var alertHtml = '<div class="alert';
	var xButton = '<a class="close" data-dismiss="alert" href="#">&times;</a>';

	if(multiline == true)
		alertHtml += " alert-block";

	alertHtml += (" " + type + '">' + xButton + message + "</div>");

	if(typeof parent === "undefined" || parent == false)
		$(alertHtml).alert();

	else
	{
		$(parent).html(alertHtml);
		$(parent).alert();
	}
}