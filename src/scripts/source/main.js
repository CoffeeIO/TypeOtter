var mlTex = (function(obj, $) {
    obj.mltexIndex = 1;

    /**
     * Main function to start typesetting dom element with all preprocess functions.
     */
    obj.run = function (settings, callback) {
        var dom = null;

        // Validate settings.
        var step1 = function(callback) {
            settings = obj.getSettings(settings);
            if (settings == null) {
                callback();
                return;
            }

            dom = $(settings.selector);
            callback();
        };

        // Preprocess dom.
        var step2 = function(callback) {
            if (settings.options.spinner !== false) {
                obj.addSpinner(dom);
            }
            obj.includeFiles(dom, function () {
                obj.handleMath(dom);
                callback();
            });
        };

        // Render mathjax.
        var step3 = function(callback) {
            // Wait with callback till math is rendered.
            var checkMathRendered = function() {
                var timer = setInterval(function () {
                    if (window.load) {
                        var mp = dom.find('.MathJax_Preview').length,     // MathJax equations detected
                            m = dom.find('.MathJax').length,              // MathJax equations prepared
                            mpr = dom.find('.MathJax_Processing').length; // MathJax equations being processed
                        if (mp === m && mpr === 0) { // All equations prepared and finished processing
                            clearInterval(timer);
                            callback();

                        }
                    }
                }, 100);
            };

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Queue 'typeset' action
            MathJax.Hub.Queue(function () { // Queue finished
                checkMathRendered();
            });
        };

        // Process dom.
        var step4 = function(callback) {
            obj.attrify(dom);
            obj.wrapper(dom);
            obj.indexToc(dom);
            obj.makeToc(dom);
            obj.makeRef(dom);
            obj.makeRefPage(dom, settings.biblography);
            callback();

        };

        // Texify document.
        var step5 = function(callback) {
            obj.texify(settings.options, dom);
            callback();
        };

        // Postprocess dom.
        var step6 = function(callback) {
            obj.fillMath(dom);
            obj.fillToc(dom);
            obj.fillRef(dom);
            obj.addControls(dom);
            callback();
        };

        // Cleanup dom.
        var step7 = function(callback) {
            if (settings.options.spinner !== false) {
                obj.removeSpinner();
            }
            dom.wrapInner(
                '<div class="mltex" id="mltex-' + obj.mltexIndex + '"></div>'
            );
            obj.mltexIndex++;

            addResizeEvent();
            obj.updateControlsWidth();
            callback();
        };

        // Wait till fonts are rendered.
        $(window).load(function () {
            window.load = true;
        });

        var callArr = [step1, step2, step3, step4, step5, step6, step7];

        // Wait till all content is retrieved.
        $(document).ready(function () {
            // Execute functions in series, so they don't interfere with each other.
            execFunc(callArr, function() {
                if (callback != null) {
                    callback();
                }
            });
        });

        /**
         * Execute array of functions, and end with callback.
         */
        function execFunc(funArr, callback) {
            if (settings === null) { // If settings is null something went wrong
                console.error("Exiting... fix errors to complete execution");
                callback();
                return;
            }
            if (funArr.length === 0) { // If there are no more functions callback and return
                callback();
                return;
            }

            // Take first function in array.
            var fun = funArr.shift();
            // Call function and wait for callback to continue with next.
            fun(function() {
                execFunc(funArr, callback);
            });
        }
    };

    /**
     * Add eventlistener to window resize.
     */
    function addResizeEvent() {
        var id;
        $(window).resize(function() {
            clearTimeout(id);
            id = setTimeout(resizeDone, 200);
        });
    }

    /**
     * Actions to perform when resize is done.
     */
    function resizeDone() {
        obj.updateControlsWidth();
    }

    return obj;
}(mlTex || {}, jQuery));
