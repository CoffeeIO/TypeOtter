var mathDone = false,
    dom = null,
    DEBUG = true,
    innerDone = false,
    biblography = {};

$(document).ready(function () {
    if (DEBUG) console.time("document prepare"); // Performance timers
    if (DEBUG) console.time("document render");  // Performance timers
    if (DEBUG) console.time("document math done"); // Performance timers
    if (DEBUG) console.time("window loaded"); // Performance timers
    if (DEBUG) console.time("document math preprocess"); // Performance timers

    dom = $('body');
    mlTex.addSpinner(dom);
    mlTex.includeFiles(dom);
    mlTex.handleMath(dom);

    MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // Queue 'typeset' action
});

$(window).load(function () {
    if (DEBUG) console.timeEnd("window loaded"); // Performance timers
    // User specified options, example
    var options = {
        headerRight: 'MGApcDev',
        headerCenter: '<i>by</i>',
        pager : 'Page [cur] of [total]',
        padding: "7mm 10mm"
    };

    var timer = setInterval(function () { // Block until math is loaded
        if (mathDone) {
            var mp = dom.find('.MathJax_Preview').length,     // MathJax equations detected
                m = dom.find('.MathJax').length,              // MathJax equations prepared
                mpr = dom.find('.MathJax_Processing').length; // MathJax equations being processed
            if (mp === m && mpr === 0) {
                innerDone = true;
            }

            if (innerDone) {
                if (DEBUG) console.timeEnd("document math done"); // Performance timers
                clearInterval(timer);
                setTimeout(function(){
                    mlTex.attrify(dom);
                    mlTex.wrapper(dom);
                    mlTex.indexToc(dom);
                    mlTex.makeToc(dom);
                    mlTex.makeRef(dom);
                    mlTex.makeRefPage(dom, biblography);
                    mlTex.fillMath(dom);
                    if (DEBUG) console.timeEnd("document prepare"); // Performance timers
                    mlTex.texify(options, dom);
                    mlTex.fillToc(dom);
                    mlTex.fillRef(dom);
                    if (DEBUG) console.timeEnd("document render");  // Performance timers
                    mlTex.removeSpinner();
                }, 100);
            }
        }
    }, 100);
});
