var mlTex = (function(obj, $) {
    obj.mltexIndex = 1;

    /**
     * Actions to perform before mathjax equations are rendered.
     */
    function preMathjax(dom, settings) {
        if (settings.options.spinner !== false) {
            obj.addSpinner(dom);
        }
        obj.includeFiles(dom);
        obj.handleMath(dom);
    }

    /**
     * Actions to perform before pagination.
     */
    function preprocessDom(dom, settings) {
        obj.attrify(dom);
        obj.wrapper(dom);
        obj.indexToc(dom);
        obj.makeToc(dom);
        obj.makeRef(dom);
        obj.makeRefPage(dom, settings.biblography);
    }

    /**
     * Actions to construct document dom.
     */
    function processDom(dom, settings) {
        obj.texify(settings.options, dom);
    }

    /**
     * Document relevant actions to perform after pagination.
     */
    function postprocessDom(dom, settings) {
        obj.fillMath(dom);
        obj.fillToc(dom);
        obj.fillRef(dom);
        obj.addControls(dom);
    }

    /**
     * Cleanup actions to make document viewable/interactable.
     */
    function cleanupDom(dom, settings) {
        if (settings.options.spinner !== false) {
            obj.removeSpinner();
        }
        dom.wrapInner(
            '<div class="mltex" id="mltex-' + obj.mltexIndex + '"></div>'
        );
        obj.mltexIndex++;

        addResizeEvent();
        obj.updateControlsWidth();
    }

    /**
     * Main function to start typesetting dom element with all preprocess functions.
     */
    obj.run = function (settings, callback) {
        var mathjaxProcessed = false,
            mathjaxRendered = false,
            dom = null;

        // Wait till fonts are rendered.
        $(window).load(function () {
            window.load = true;
        });

        // Wait till all content is retrieved.
        $(document).ready(function () {
            settings = obj.getSettings(settings);
            if (settings == null) {
                return;
            }

            dom = $(settings.selector);

            preMathjax(dom, settings);

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Queue 'typeset' action
            MathJax.Hub.Queue(function () { // Queue is finished
                mathjaxProcessed = true;
            });

            var timer = setInterval(function () { // Block until window is loaded
                if (window.load) {
                    clearInterval(timer);
                    innerRun();
                }
            }, 100);

        });

        function innerRun() {
            var timer = setInterval(function () { // Block until math is loaded
                if (mathjaxProcessed) {
                    var mp = dom.find('.MathJax_Preview').length,     // MathJax equations detected
                        m = dom.find('.MathJax').length,              // MathJax equations prepared
                        mpr = dom.find('.MathJax_Processing').length; // MathJax equations being processed
                    if (mp === m && mpr === 0) {
                        mathjaxRendered = true;
                    }

                    if (mathjaxRendered) {
                        clearInterval(timer);
                        setTimeout(function(){
                            preprocessDom(dom, settings);

                            processDom(dom, settings);

                            postprocessDom(dom, settings);

                            cleanupDom(dom, settings);

                            if (callback != null) {
                                callback();
                            }
                        }, 100);
                    }
                }
            }, 100);
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
