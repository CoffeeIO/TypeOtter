var mlTex = (function(obj, $) {

    /**
     * Index the sections in dom element.
     */
    obj.indexToc = function(dom) {
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
            var join = section.join('.'),
                index = join.indexOf('.0');
            if (index !== -1) {
                join = join.substr(0, index);
            }

            sec.attr('data-ref', join);
            // Make reference link
            sec.prepend('<a name="mltex-' + join + '"></a>');
            // Prepend section to section title
            sec.find('.tex-section-title').first().prepend('<span>' + join + '</span>');

        });
    };

    /**
     * Create the html of a single row in table of contents.
     */
    function makeTocRow(ref, section, title, className) {
        var curHtml =
            '<a href="#mltex-' + ref + '">' +
                '<div class="' + className + '" data-ref="' + ref + '">' +
                    '<div class="left"><span>' + section + '</span>' + title + '</div>' +
                    '<div class="right" data-pageref=""></div>' +
            '</div></a>';
        return curHtml;
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
                curHtml += makeTocRow(
                    secStr, secArr[0],
                    elem.attr('data-title'),
                    'sec'
                );
                return true;
            }
            // Sub-section
            if (secArr[2] === undefined || secArr[2] === '0') {
                curHtml += makeTocRow(
                    secStr, secArr[0] + '.' + secArr[1],
                    elem.attr('data-title'),
                    'subsec'
                );
                return true;
            }
            // Sub-sub-section
            if (secArr[3] === undefined || secArr[3] === '0') {
                curHtml += makeTocRow(
                    secStr, secArr[0] + '.' + secArr[1] + '.' + secArr[2],
                    elem.attr('data-title'),
                    'subsubsec'
                );
                return true;
            }
            // Sub-sub-sub-section
            if (secArr[4] === undefined || secArr[4] === '0') {
                curHtml += makeTocRow(
                    secStr, secArr[0] + '.' + secArr[1] + '.' + secArr[2] + '.' + secArr[3],
                    elem.attr('data-title'),
                    'subsubsubsec'
                );
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
        var curHtml =
            '<a name="mltex-toc"></a>' +
            '<h1 class="toc-title">' + title + '</h1>' +
            inner;
        return curHtml;
    }

    /**
     * Create a table of contents as an element to be inserted into the dom.
     */
    obj.makeToc = function(dom) {
        var inner = innerToc(dom);
        dom.find('div[toc=""]').each(function () {
            var elem = $(this),
                title = 'Contents';
            if (elem.text().trim() !== '') {
                title = elem.text().trim();
            }
            var toc = genToc(inner, title);

            elem.html(toc);
        });
    };

    /**
     * Find rendered locations of sections and put them in their table of contents.
     */
    obj.fillToc = function(dom) {
        dom.find('div[toc=""]').each(function () {
            var elem = $(this);
            elem.find('> a > div').each(function () {
                var sec = dom.find('section[data-ref="' + $(this).attr('data-ref') + '"]').first(),
                    page = sec.closest('.tex-page');
                $(this).find('.right').html(page.attr('data-page'));
            });
        });
    };

    return obj;
}(mlTex || {}, jQuery));
