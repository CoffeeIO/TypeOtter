var mathDone = false,
    dom = null;

$(document).ready(function () {
    console.time("document prepare"); // Performance timers
    console.time("document render");  // Performance timers
    dom = $('body');
    includeFiles(dom);
    handleMath(dom);

    MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // Queue 'typeset' action
});

$(window).load(function () {
    // User specified options, example
    var options = {
        headerRight: 'MGApcDev',
        headerCenter: '<i>by</i>',
        pager : 'Page [cur] of [total]',
        padding: "7mm 10mm"
    };

    var innerDone = false;
    var timer = setInterval(function () { // Block until math is loaded
        if (mathDone) {
            setTimeout(function(){
                innerDone = true;
            }, 100);
            if (innerDone) {
                attrify(dom);
                wrapper(dom);
                indexToc(dom);
                makeToc(dom);
                makeRef(dom);
                makeRefPage(dom, null);
                fillMath(dom);
                console.timeEnd("document prepare"); // Performance timers
                texify(options, dom);
                fillToc(dom);
                fillRef(dom);
                console.timeEnd("document render");  // Performance timers

                clearInterval(timer);
            }
        }
    }, 100);
});
