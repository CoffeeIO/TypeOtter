var mlTex = (function(obj, $) {
    obj.mathDone = false;
    obj.DEBUG = true;
    obj.mltexIndex = 1;
    var innerDone = false;

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

    function preMathjax(dom, settings) {
        if (settings.options.spinner !== false) {
            obj.addSpinner(dom);
        }
        obj.includeFiles(dom);
        obj.handleMath(dom);
    }
    function preprocess(dom, settings) {
        obj.attrify(dom);
        obj.wrapper(dom);
        obj.indexToc(dom);
        obj.makeToc(dom);
        obj.makeRef(dom);
        obj.makeRefPage(dom, settings.biblography);
    }
    function process(dom, settings) {
        obj.texify(settings.options, dom);
    }
    function postprocess(dom, settings) {
        obj.fillMath(dom);
        obj.fillToc(dom);
        obj.fillRef(dom);
        obj.addControls(dom);
    }
    function cleanup(dom, settings) {
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
        obj.mathDone = false;
        innerDone = false;

        $(document).ready(function () {
            settings = obj.getSettings(settings);
            if (settings == null) {
                return;
            }

            dom = $(settings.selector);

            preMathjax(dom, settings);

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Queue 'typeset' action
            MathJax.Hub.Queue(function () { // Queue is finished
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
            var timer = setInterval(function () { // Block until math is loaded
                if (obj.mathDone) {
                    var mp = dom.find('.MathJax_Preview').length,     // MathJax equations detected
                        m = dom.find('.MathJax').length,              // MathJax equations prepared
                        mpr = dom.find('.MathJax_Processing').length; // MathJax equations being processed
                    if (mp === m && mpr === 0) {
                        innerDone = true;
                    }

                    if (innerDone) {
                        clearInterval(timer);
                        setTimeout(function(){
                            preprocess(dom, settings);

                            process(dom, settings);

                            postprocess(dom, settings);

                            cleanup(dom, settings);

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
