$(document).ready(function()
{
    var bNavSearchFormOver = false;

    generalNavSearch(bNavSearchFormOver);
    generalSocialMedia();
});

function generalNavSearch(bNavSearchFormOver)
{
    $("#search-show").hoverIntent(
    {
        interval: 0,
        timeout: 500,
        over: function()
        {
            if(bNavSearchFormOver == true)
                bNavSearchFormOver = false;
            else
            {
                $("#nav-search-form").css("visibility", "visible");
                $("#nav-search-form").effect("slide", {direction: "right"}, 200);
            }
        },
        out: function()
        {
            if(bNavSearchFormOver == false)
            {
                $("#nav-search-form").hide("slide", {direction: "right"}, 200, function()
                {
                    $("#nav-search-form").css("visibility", "hidden");
                    $("#nav-search-form").show();
                });
            }
        }
    });

    $("#nav-search-form").hoverIntent(
    {
        interval: 0,
        timeout: 500,
        over: function()
        {
            bNavSearchFormOver = true;
        },
        out: function()
        {
            if(bNavSearchFormOver == true)
            {
                $("#nav-search-form").hide("slide", {direction: "right"}, 200, function()
                {
                    $("#nav-search-form").css("visibility", "hidden");
                    $("#nav-search-form").show();
                });

                bNavSearchFormOver = false;
            }
        }
    });
}

function generalSocialMedia()
{
    if(!Modernizr.csstransitions) // jQuery fallback using Modernizr and background-color as flag
    {
        $("#footer-social-media").removeClass("css3-social-media");
        $("#footer-social-media").css("background-color", "transparent");
        $("<script>", {src: "../js/vendor/plugins/jquery/socialMedia/js/socialMedia.js"}).appendTo("head");
        $("#footer-social-media").socialMedia();
        console.log("socialMedia plugin: jQuery fallback enabled.");
    }
}