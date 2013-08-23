requirejs.config(
{
    baseUrl: "js/app",
    paths:
    {
        // Vendor Paths
        "jquery": "../../../js/vendor/jquery.min",
        "jqueryui": "../../../js/vendor/jquery-ui/js/jquery-ui.custom.min",
        "json2": "../../../js/vendor/json2",
        "underscore": "../../../js/vendor/underscore.min",
        "backbone": "../../../js/vendor/backbone.min",
        "handlebars": "../../../js/vendor/handlebars.min",
        "modernizr": "../../../js/vendor/modernizr.custom.min",
        "bootstrap": "../../../js/vendor/bootstrap.min",

        // Plugin Paths
        "localstorage": "../../../js/vendor/plugins/backbone/localStorage.min",
        "jcanvas": "../../../js/vendor/plugins/jquery/jcanvas/js/jcanvas.min",
        "fileupload": "../../../js/vendor/plugins/jquery/fileUpload/js/jquery.fileupload.min",

        // Required for fileUpload plugin to work
        "jquery.ui.widget": "../../../js/vendor/plugins/jquery/fileUpload/js/vendor/jquery.ui.widget.min",
        "iframe.transport": "../../../js/vendor/plugins/jquery/fileUpload/js/jquery.iframe-transport.min",
        // End

        "jqte": "../../../js/vendor/plugins/jquery/jqte/jquery-te.min",

        // Base Paths
        "shared": "../../../js/shared"
    },
    shim:
    {
        "jquery":
        {
            exports: "$"
        },
        "jqueryui":
        {
            deps: ["jquery"]
        },
        "underscore":
        {
            deps: ["jquery"],
            exports: "_"
        },
        "backbone":
        {
            deps: ["jquery", "json2", "underscore"],
            exports: "Backbone"
        },
        "handlebars":
        {
            exports: "Handlebars"
        },
        "modernizr":
        {
            exports: "Modernizr"
        },
        "bootstrap":
        {
            deps: ["jquery"]
        },
        "localstorage":
        {
            deps: ["backbone"]
        },
        "jcanvas":
        {
            deps: ["jquery"]
        }
    }
});