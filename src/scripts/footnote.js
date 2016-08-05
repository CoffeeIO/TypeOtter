function handleFootnote(dom) {
    dom.find('footnote').each(function () {
        var elem = $(this);
        console.log();
        elem.after('<span class="tex-footnote" data-html="' + elem.html() + '"></span>');
        elem.remove();
    });
}