/**
 * Find footnotes and replace their content with a number count.
 */
function handleFootnote(dom) {
    var counter = 1;
    dom.find('footnote').each(function () {
        var elem = $(this);
        elem.after('<span class="tex-footnote" data-html="' + elem.html() + '"><sup>' + counter++ + '</sup></span>');
        elem.remove();
    });
}
