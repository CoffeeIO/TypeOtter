// Global MathJax variables
var inlineMath = 'a579438542e77567a744e7abaeaac7ae', // MD5 of '$$ inline'
    blockMath  = '1a73f16f7ac6dc3674c729ed2524bcc6'; // MD5 of '$$ block'
/**
 * Preprocess 'e' tags so mathjax registers them
 * Note: MathJax doesn't allow tags to be used for finding equations.
 */
function handleMath(dom) {
    dom.find('e').each(function () {
        var elem = $(this);
        if (elem.closest('p').length === 0) { // Check if equation is inside paragraph
            elem.html(blockMath + elem.html() + blockMath);
        } else {
            elem.html(inlineMath + elem.html() + inlineMath);
        }
    });
}
