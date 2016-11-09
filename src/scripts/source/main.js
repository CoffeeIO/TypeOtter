var mlTex = (function(obj, $) {
    obj.mathDone = false;
    obj.DEBUG = true;
    var innerDone = false;

    /**
     * Main function to start typesetting a dom element with all preprocess functions.
     */
    obj.run = function (settings, callback) {
        obj.mathDone = false;
        innerDone = false;
        $(document).ready(function () {
            if (obj.DEBUG) {
                console.time("document prepare"); // Performance timers
                console.time("document render");  // Performance timers
                console.time("document math done"); // Performance timers
                console.time("window loaded"); // Performance timers
                console.time("document math preprocess"); // Performance timer
            }

            settings = obj.getSettings(settings);
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
            var timer = setInterval(function () { // Block until window is loaded
                if (window.load) {
                    clearInterval(timer);
                    innerRun();
                }
            }, 100);

        });

        $(window).load(function () {
            window.load = true;
        });

        function innerRun() {
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
        }
    };

    return obj;
}(mlTex || {}, jQuery));
