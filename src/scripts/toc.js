/**
 * Index the sections in dom element.
 */
function indexToc(dom) {
    var section = [];
    var secs = $('section');
    secs.each(function() {
        var sec = $(this),
            parents = sec.parentsUntil(dom, 'section');
        var len = parents.length
        if (section[len] === undefined) {
            section[len] = 0;
        }
        section[len]++;

        for (i = len + 1; i < section.length; i++) {
            section[i] = 0;
        }
        var join = section.join('.')
        sec.attr('data-ref', join); // Change to .data()
        sec.prepend('<a name="' + join + '"></a>')
    });
}

/**
 * Create the inner content of table of contents from dom element
 */
function innerToc(dom) {
    var curHtml = '';
    dom.find('section').each(function () {
        var elem = $(this),
            secStr = elem.attr('data-ref'),
            secArr = secStr.split('.');
        
        // Section
        if (secArr[1] == undefined || secArr[1] == 0) {
            curHtml += '<a href="#' + secStr + '"><div class="sec" data-ref="' + secStr + '"><div class="left">' + secArr[0] + ' ' + elem.attr('data-title') + '</div><div class="right" data-pageref="">' + '</div></div></a>';
            return true;
        }
        // Sub-section
        if (secArr[2] == undefined || secArr[2] == 0) {
            curHtml += '<a href="#' + secStr + '"><div class="subsec" data-ref="' + secStr + '"><div class="left">' + secArr[0] + '.' + secArr[1] + ' ' + elem.attr('data-title') + '</div><div class="right" data-pageref="">' + '</div></div></a>';
            return true;
        }
        // Sub-sub-section
        if (secArr[3] == undefined || secArr[3] == 0) {
            curHtml += '<a href="#' + secStr + '"><div class="subsubsec" data-ref="' + secStr + '"><div class="left">' + secArr[0] + '.' + secArr[1] + '.' + secArr[2] + ' ' + elem.attr('data-title') + '</div><div class="right" data-pageref="">' + '</div></div></a>';
            return true;
        }
        // Sub-sub-sub-section
        if (secArr[4] == undefined || secArr[4] == 0) {
            curHtml += '<a href="#' + secStr + '"><div class="subsubsubsec" data-ref="' + secStr + '"><div class="left">' + secArr[0] + '.' + secArr[1] + '.' + secArr[2] + '.' + secArr[3] + ' ' + elem.attr('data-title') + '</div><div class="right" data-pageref="">' + '</div></div></a>';
            return true;
        }
        console.error('Only 3 subsection levels supported');
    });
    return curHtml;
}

/**
 * Create html of table of content from title and inner content.
 */
function genToc(inner, title) {
    var curHtml = '<div class="toc"><h1 class="toc-title">' + title + '</h1>';
    curHtml += inner + '</div>';
    return curHtml;
} 

/**
 * Create a table of contents as an element to be inserted into the dom.
 */
function makeToc(dom) {
    var inner = innerToc(dom);
    dom.find('toc').each(function () {
        var elem = $(this),
            title = '';
        if (elem.attr('data-title') === undefined) {
            title = 'Contents';
        } else {
            title = elem.attr('data-title');
        }
        var toc = genToc(inner, title);
        elem.after(toc);
        elem.remove();
    });
}

/**
 * Find rendered locations of sections and put them in their table of contents.
 */
function fillToc(dom) {
    dom.find('.toc').each(function () {
        var elem = $(this);
        elem.find('> div').each(function () {
            var sec = dom.find('section[data-ref="' + $(this).attr('data-ref') + '"]').first();
            var page = sec.closest('.page');
            $(this).find('.right').html(page.attr('data-page'));
        });
    });
}
