var mathDone = false,
    dom = null,
    start = null,
    end = null;

$(document).ready(function () {
    start = new Date().getTime(); // Debug time
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
                texify(options, dom);
                fillToc(dom);
                fillRef(dom);
                end = new Date().getTime(); // Debug time
                console.log(end - start); // Debug time

                clearInterval(timer);
            }
        }
    }, 100);
});
