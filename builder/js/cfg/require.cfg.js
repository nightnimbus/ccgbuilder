requirejs.config(
{
    baseUrl: "js/app",
    paths:
    {
        // Vendor Paths
        "jquery":
        [
            "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
            "../../../js/vendor/jquery.min"
        ],

        "jqueryui":
        [
            "../../../js/vendor/jquery-ui/ui/minified/jquery-ui.custom.min"
        ],

        "json2":
        [
            "//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2",
            "../../../js/vendor/json2"
        ],

        "underscore":
        [
            "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min",
            "../../../js/vendor/underscore.min"
        ],

        "backbone":
        [
            "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min",
            "../../../js/vendor/backbone.min"
        ],

        "handlebars":
        [
            "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min",
            "../../../js/vendor/handlebars.min"
        ],

        "modernizr":
        [
            "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min",
            "../../../js/vendor/modernizr.min"
        ],

        // Plugin Paths
        "bootstrap":
        [
            "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min",
            "../../../js/vendor/bootstrap.min"
        ],

        "localstorage":
        [
            "//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.0/backbone.localStorage-min",
            "../../../js/vendor/plugins/backbone/localStorage.min"
        ],

        "jcanvas":
        [
            "../../../js/vendor/plugins/jquery/jcanvas/js/jcanvas.min"
        ],

        "uploadify":
        [
            "../../../js/vendor/plugins/jquery/uploadify/js/jquery.uploadify.min"
        ]
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
        },

        "uploadify":
        {
            deps: ["jquery"]
        }
    }
});