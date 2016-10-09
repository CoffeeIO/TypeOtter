var mlTex = (function(obj, $) {
    obj.mathDone = false;
    obj.DEBUG = true;
    var innerDone = false;

    obj.run = function (selector, options, biblography) {
        $(document).ready(function () {
            if (obj.DEBUG) console.time("document prepare"); // Performance timers
            if (obj.DEBUG) console.time("document render");  // Performance timers
            if (obj.DEBUG) console.time("document math done"); // Performance timers
            if (obj.DEBUG) console.time("window loaded"); // Performance timers
            if (obj.DEBUG) console.time("document math preprocess"); // Performance timers

            dom = $(selector);
            obj.addSpinner(dom);
            obj.includeFiles(dom);
            obj.handleMath(dom);

            MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Queue 'typeset' action
            MathJax.Hub.Queue(function () { // Queue is finished
                if (mlTex.DEBUG) console.timeEnd("document math preprocess"); // Performance timers
                mlTex.mathDone = true;
            });
        });

        $(window).load(function () {
            if (obj.DEBUG) console.timeEnd("window loaded"); // Performance timers

            var timer = setInterval(function () { // Block until math is loaded
                if (obj.mathDone) {
                    var mp = dom.find('.MathJax_Preview').length,     // MathJax equations detected
                        m = dom.find('.MathJax').length,              // MathJax equations prepared
                        mpr = dom.find('.MathJax_Processing').length; // MathJax equations being processed
                    if (mp === m && mpr === 0) {
                        innerDone = true;
                    }

                    if (innerDone) {
                        if (obj.DEBUG) console.timeEnd("document math done"); // Performance timers
                        clearInterval(timer);
                        setTimeout(function(){
                            obj.attrify(dom);
                            obj.wrapper(dom);
                            obj.indexToc(dom);
                            obj.makeToc(dom);
                            obj.makeRef(dom);
                            obj.makeRefPage(dom, biblography);
                            obj.fillMath(dom);
                            if (obj.DEBUG) console.timeEnd("document prepare"); // Performance timers
                            obj.texify(options, dom);
                            obj.fillToc(dom);
                            obj.fillRef(dom);
                            if (obj.DEBUG) console.timeEnd("document render");  // Performance timers
                            obj.removeSpinner();
                        }, 100);
                    }
                }
            }, 100);
        });
    }

    return obj;
}(mlTex || {}, jQuery));
