var mlTex = (function(obj, $) {
    obj.mathDone = false;
    obj.DEBUG = true;
    var innerDone = false;

    /**
     * Validate settings otherwise return default values.
     */
    function getSettings(settings) {
        if (settings == null || !(settings instanceof Object)) {
            return {
                selector: 'body',
                options: {},
                biblography: {}
            };
        }
        if (!(typeof settings.selector === "string") || settings.selector.trim() === '') {
            settings.selector = 'body';
        }
        // Check selector can find an element.
        var count = $(settings.selector).length;
        if (count !== 1) {
            if (count === 0) {
                console.error('Selector "%s" not found', settings.selector);
            } else if (count > 1) {
                console.error('Selector "%s" found mutiple elements, selector needs to be unique', settings.selector);
            }
            return null;
        }
        if (settings.options == null || !(settings.options instanceof Object)) {
            settings.options = {};
        }
        if (settings.biblography == null || !(settings.biblography instanceof Object)) {
            settings.biblography = {};
        }

        return settings;
    }

    /**
     * Main function to start typesetting a dom element with all preprocess functions.
     */
    obj.run = function (settings, callback) {

        $(document).ready(function () {
            if (obj.DEBUG) {
                console.time("document prepare"); // Performance timers
                console.time("document render");  // Performance timers
                console.time("document math done"); // Performance timers
                console.time("window loaded"); // Performance timers
                console.time("document math preprocess"); // Performance timer
            }

            settings = getSettings(settings);
            if (settings == null) {
                return;
            }

            dom = $(settings.selector);

            if (settings.options.spinner !== false) {
                obj.addSpinner(dom);
            }
            obj.includeFiles(dom);
            obj.handleMath(dom);

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Queue 'typeset' action
            MathJax.Hub.Queue(function () { // Queue is finished
                if (mlTex.DEBUG) {
                    console.timeEnd("document math preprocess"); // Performance timers
                }
                mlTex.mathDone = true;
            });
        });

        $(window).load(function () {
            if (obj.DEBUG) {
                console.timeEnd("window loaded"); // Performance timers
            }

            var timer = setInterval(function () { // Block until math is loaded
                if (obj.mathDone) {
                    var mp = dom.find('.MathJax_Preview').length,     // MathJax equations detected
                        m = dom.find('.MathJax').length,              // MathJax equations prepared
                        mpr = dom.find('.MathJax_Processing').length; // MathJax equations being processed
                    if (mp === m && mpr === 0) {
                        innerDone = true;
                    }

                    if (innerDone) {
                        if (obj.DEBUG) {
                            console.timeEnd("document math done"); // Performance timers
                        }
                        clearInterval(timer);
                        setTimeout(function(){
                            obj.attrify(dom);
                            obj.wrapper(dom);
                            obj.indexToc(dom);
                            obj.makeToc(dom);
                            obj.makeRef(dom);
                            obj.makeRefPage(dom, settings.biblography);
                            obj.fillMath(dom);
                            if (obj.DEBUG) {
                                console.timeEnd("document prepare"); // Performance timers
                            }
                            obj.texify(settings.options, dom);
                            obj.fillToc(dom);
                            obj.fillRef(dom);
                            if (obj.DEBUG) {
                                console.timeEnd("document render");  // Performance timers
                            }
                            if (settings.options.spinner !== false) {
                                obj.removeSpinner();
                            }
                            if (callback != null) {
                                callback();
                            }
                        }, 100);
                    }
                }
            }, 100);
        });
    };

    return obj;
}(mlTex || {}, jQuery));
