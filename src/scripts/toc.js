/**
 * Index the sections in dom element.
 */
function indexToc(dom) {
    var section = [];
    var secs = $('section');
    secs.each(function() {
        var sec = $(this),
            parents = sec.parentsUntil(dom, 'section'),
            len = parents.length;
        if (section[len] === undefined) {
            section[len] = 0;
        }
        section[len]++;
        // Reset subsections to zero (relative)
        for (i = len + 1; i < section.length; i++) {
            section[i] = 0;
        }
        var join = section.join('.');
        sec.attr('data-ref', join);
        // Make reference link
        sec.prepend('<a name="' + join + '"></a>');
    });
}

/**
 * Create the html of a single row in table of contents.
 */
function makeTocRow(ref, section, title, className) {
    return '<a href="#' + ref + '"><div class="' + className + '" data-ref="' + ref 
         + '"><div class="left"><span>' + section + '</span>' + title 
         + '</div><div class="right" data-pageref="">' + '</div></div></a>';
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
        if (secArr[1] === undefined || secArr[1] === '0') {
            curHtml += makeTocRow(secStr, secArr[0], elem.attr('data-title'), 'sec');
            return true;
        }
        // Sub-section
        if (secArr[2] === undefined || secArr[2] === '0') {
            curHtml += makeTocRow(secStr, secArr[0] + '.' + secArr[1], elem.attr('data-title'), 'subsec');
            return true;
        }
        // Sub-sub-section
        if (secArr[3] === undefined || secArr[3] === '0') {
            curHtml += makeTocRow(secStr, secArr[0] + '.' + secArr[1] + '.' + secArr[2], elem.attr('data-title'), 'subsubsec');
            return true;
        }
        // Sub-sub-sub-section
        if (secArr[4] === undefined || secArr[4] === '0') {
            curHtml += makeTocRow(secStr, secArr[0] + '.' + secArr[1] + '.' + secArr[2] + '.' + secArr[3], elem.attr('data-title'), 'subsubsubsec');
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

function fixMaxHeight(dom) {
    dom.append('<style>.toc > a > div { max-height: ' + dom.find('.toc > a > div').first().css('font-size') + ' }</style>');
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
    fixMaxHeight(dom);
}

/**
 * Find rendered locations of sections and put them in their table of contents.
 */
function fillToc(dom) {
    dom.find('.toc').each(function () {
        var elem = $(this);
        elem.find('> a > div').each(function () {
            var sec = dom.find('section[data-ref="' + $(this).attr('data-ref') + '"]').first(),
                page = sec.closest('.page');
            $(this).find('.right').html(page.attr('data-page'));
        });
    });
}
