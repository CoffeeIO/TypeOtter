var mlTex = (function(obj, $) {

    /**
     * Look for specific attributes in dom and generate elements.
     */
    obj.attrify = function (dom) {
        handleUrl(dom);
        handleNewpage(dom);
        handleImages(dom);
        handleTitle(dom);
        handleName(dom);
        handleCaption(dom);
        handleImgSize(dom);
        removeScript(dom);
    };

    /**
     * Allow title attribute on <p> and <section> tags to generate titles.
     * Note: title are changed to data-title to avoid browser interaction, but without hiding the attribute from
     * developer tools.
     */
    function handleTitle(dom) {
        dom.find("p").each(function () {
            var elem = $(this),
                title = '';
            if (elem.attr('title') !== undefined && elem.attr('title').trim() !== '') {
                title = elem.attr('title');
                elem.prepend('<span class="tex-para-title">' + title + '</span>');

                // Remove title attr to avoid browser hover effect
                elem.attr('data-title', title).removeAttr('title');
            }
        });
        dom.find("section").each(function () {
            var elem = $(this),
                title = '';
            if (elem.attr('title') !== undefined) {
                title = elem.attr('title');
            }
            elem.prepend(
                '<a href="#mltex-toc">' +
                    '<h1 class="tex-section-title"><span>' + title + '</span></h1>' +
                '</a>'
            );

            // Remove title attr to avoid browser hover effect
            elem.attr('data-title', title).removeAttr('title');
        });
    }

    /**
     * Handle name attribute on any tag for quick reference to any element.
     */
    function handleName(dom) {
        dom.find("*[name!=''][name]").each(function (index) {
            var elem = $(this);
            if (elem.prop('tagName') === 'IMG') { //Images can't have nested <a> tag
                elem.before('<a name="' + $(this).attr('name') + '"></a>');
            } else if (elem.prop('tagName') === 'A') {
                // 'A' is a valid tag, ignore modification.
            } else {
                elem.prepend('<a name="' + $(this).attr('name') + '"></a>');
            }
        });
    }

    /**
     * Wrap all images in <figure> tag to allow for name and captions.
     */
    function handleImages(dom) {
        var counter = 1;
        dom.find("img").each(function (index) {
            var elem = $(this);
            if (elem.parent().prop('tagName') !== 'FIGURE') {
                elem.wrap('<figure>');
            }
            elem.closest('figure').attr('data-fig', counter++);
        });
    }

    /**
     * Create <figcaption> under images if caption attribute is specified.
     */
    function handleCaption(dom) {
        dom.find("img[caption!=''][caption]").each(function (index) {
            var elem = $(this),
                count = elem.closest('figure').attr('data-fig');
            elem.after(
                '<figcaption>' +
                    '<span>Figure ' + count + ': </span>' +
                    '<span>' + elem.attr('caption') + '</span>' +
                '</figcaption>'
            );
        });
    }

    /**
     * Handle all unit types for width and hight attributes on images.
     * Note: width and height only support px and % without.
     */
    function handleImgSize(dom) {
        dom.find("img[width!=''][width]").each(function (index) {
            $(this).css('width', $(this).attr('width'));
        });
        dom.find("img[height!=''][height]").each(function (index) {
            $(this).css('height', $(this).attr('height'));
        });
    }

    /**
     * Handle url attribute on 'a' tags, copy href to html and set target to blank.
     */
    function handleUrl(dom) {
        dom.find('a[url=""]').each(function (index) {
            var elem = $(this),
                href = elem.attr('href');
            if (elem.html().trim() === '') {
                elem.html(href);
            }
            elem.attr('target', '_blank');
        });
    }

    /**
     * Handle newpage attribute on any element.
     */
    function handleNewpage(dom) {
        dom.find('*[newpage=""]').each(function () {
            var elem = $(this);
            elem.before('<div class="tex-newpage"></div>');
        });
    }

    /**
     * Remove scripts from dom.
     * Scripts to be running continuesly should be placed in the head.
     * Scripts to output text should write to dom before window has finished loading.
     */
    function removeScript(dom) {
        dom.find('script').remove();
    }

    return obj;
}(mlTex || {}, jQuery));
