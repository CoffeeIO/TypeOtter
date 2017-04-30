var TypeOtter = (function(obj, $) {
    // Base empty Page Object.
    var Page = function () {
        this.number = 1,
        this.total = 1,
        this.content = "",
        this.page = {
            wrapper : '<div class="tex-page">',
            height: ''
        },
        this.header = {
            wrapper : '<div class="tex-header">',
            right : "",
            center : "",
            left : ""
        },
        this.footer = {
            wrapper : '<div class="tex-footer">',
            right : "",
            center : "",
            left : ""
        };
    };

    /**
     * Analyse the content of a margin / padding string.
     */
    function getMargin(input) {
        var reg4value = /^[\s]*([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]*$/,
            reg2value = /^[\s]*([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]*$/,
            reg1value = /^[\s]*([0-9]+[\w%]*)[\s]*$/;
        // 4 values
        var match = reg4value.exec(input);
        if (match !== null) {
            return {top: match[1], right: match[2], bottom: match[3], left: match[4]};
        }
        // 2 values
        match = reg2value.exec(input);
        if (match !== null) {
            return {top: match[1], right: match[2], bottom: match[1], left: match[2]};
        }
        // 1 value
        match = reg1value.exec(input);
        if (match !== null) {
            return {top: match[1], right: match[1], bottom: match[1], left: match[1]};
        }

        return null;
    }

    /**
     * Load page style based on settings.
     * Styles are loaded in the head.
     */
    function loadStyleSettings(options) {
        var padding = getMargin(options.padding);
        var css =
            ".tex-document {  width: " + options.width + "; }" +
            ".tex-page { " +
                "height: calc(" + options.height + " - " + padding.top + " - " + padding.bottom + "); " +
                "width: calc(" + options.width + " - " + padding.left + " - " + padding.right + "); " +
                "padding: " + options.padding + "; " +
            "}" +
            ".tex-content { " +
                "height: calc(" + options.height + " - " + padding.top + " - " + padding.bottom + " - " +
                    options.headerHeight + " - " + options.footerHeight + "); " +
            "}" +
            ".tex-header { " +
                "height: " + options.headerHeight + "; " +
                "line-height: " + options.headerHeight + "; " +
            "}" +
            ".tex-footer { " +
                "height: " + options.footerHeight + "; " +
                "line-height: " + options.footerHeight + "; " +
            "}";

        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }

    /**
     * Construct the html of the pager of a specific page.
     */
    function genPager(options, page) {
        return options.pager.replace('[cur]', page.number).replace('[total]', page.total);
    }

    /**
     * Construct the html of the header of a specific page.
     */
    function genHeader(options, page) {
        var curHtml = page.header.wrapper,
            pager = '';
        if (options.headerLeft === '[pager]' || options.headerCenter === '[pager]' ||
            options.headerRight === '[pager]') {
            pager = genPager(options, page);
        }

        if (options.headerLeft !== '') {
            if (options.headerLeft === '[pager]') {
                curHtml += '<div class="left">' + pager + '</div>';
            } else {
                curHtml += '<div class="left">' + options.headerLeft + '</div>';
            }
        }
        if (options.headerCenter !== '') {
            if (options.headerCenter === '[pager]') {
                curHtml += '<div class="center">' + pager + '</div>';
            } else {
                curHtml += '<div class="center">' + options.headerCenter + '</div>';
            }
        }
        if (options.headerRight !== '') {
            if (options.headerRight === '[pager]') {
                curHtml += '<div class="right">' + pager + '</div>';
            } else {
                curHtml += '<div class="right">' + options.headerRight + '</div>';
            }
        }
        curHtml += '</div>';

        return curHtml;
    }

    /**
     * Construct the html of the footer of a specific page.
     */
    function genFooter(options, page) {
        var curHtml = page.footer.wrapper,
            pager = '';
        if (options.footerLeft === '[pager]' || options.footerCenter === '[pager]' ||
            options.footerRight === '[pager]') {
            pager = genPager(options, page);
        }

        if (options.footerLeft !== '') {
            if (options.footerLeft === '[pager]') {
                curHtml += '<div class="left">' + pager + '</div>';
            } else {
                curHtml += '<div class="left">' + options.footerLeft + '</div>';
            }
        }
        if (options.footerCenter !== '') {
            if (options.footerCenter === '[pager]') {
                curHtml += '<div class="center">' + pager + '</div>';
            } else {
                curHtml += '<div class="center">' + options.footerCenter + '</div>';
            }
        }
        if (options.footerRight !== '') {
            if (options.footerRight === '[pager]') {
                curHtml += '<div class="right">' + pager + '</div>';
            } else {
                curHtml += '<div class="right">' + options.footerRight + '</div>';
            }
        }
        curHtml += '</div>';

        return curHtml;
    }

    /**
     * Construct the html of the page.
     */
    function genPage(header, footer, page) {
        var curHtml =
            '<a name="tex-page-' + page.number + '"></a>' +
            '<div class="tex-page" data-page="' + page.number + '">' +
                header +
                '<div class="tex-content">' + page.content + '</div>' +
                footer +
            '</div>';

        return curHtml;
    }

    function getSpanCount(elem) {
        if (elem.prop('tagName') == "SPAN" && elem.hasClass('typeset-line')) {
            return 1;
        }
        if (elem.prop('tagName') == "P") {
            return elem.find('> span').length;
        }

        return elem.find('p > span').length;
    }

    /**
     * Add element to testdom and compare with maxheight, return new testdom if less, otherwise
     * revert to previous state.
     */
    function addToPage(element, testdom, totalHeight, pointer) {
        var temp = pointer.html();
        pointer.append(element.clone().wrap('<div>').parent().html());
        if (testdom.outerHeight(true) <= totalHeight) {
            spanCount += getSpanCount(element);
            return {
                content: testdom,
                remain: null,
                done: false
            };
        }

        pointer.html(temp); // Revert to before the element was added

        return null;
    }

    /**
     * Force an element to be added to the dom, even if doesn't fit.
     */
    function forceAddElem(elem, testdom, pointer, suppressWarning = false) {
        pointer.append(elem.clone().wrap('<div>').parent().html());
        if (testdom.height() !== 0) { // Only count added element if element has a height
            if (! suppressWarning) {
                console.warn('Careful elements on page %s might exceed the height of the page', curPage);
            }
            elemsOnPage++;
        }
        spanCount += getSpanCount(elem);
        elem.remove();

        return {
            content: testdom,
            remain: null,
            done: false
        };
    }

    var imageShiftCount = 0;


    /**
     * Add as many images to the dom while staying within dimentions of the page.
     */
    function addQueueElem(dom, testdom, totalHeight, imageDom) {
        imageShiftCount = 0;

        console.log('Logging imgQueue');
        console.log(imgQueue);
        testdom.append('<div class="tex-image-move"></div>');
        var pointer = testdom.find('.tex-image-move');
        var tempQueue = [].concat(imgQueue);
        for (var i = 0; i < tempQueue.length; i++) {
            var item = tempQueue[i];
            imageDom.html(item.html);
            var imageDomPointer = imageDom.find(':last-child');
            var obj = addToPage(imageDomPointer, testdom, totalHeight, pointer);
            if (obj === null) {
                return null;
            } else {
                // console.log(testdom.html());
                // imgQueue.shift(); // Successfully added, remove element from queue
                imageShiftCount++;
            }
        }
    }

    // object: { html, originPage, height }
    var imgQueue = [];

    // State of whether to add all images encountered in dom to the imageQueue.
    var forceImage = false;

    // Count of span elements followed by section title.
    var spanCount = 0;
    var workingOnTitle = false;

    var titleSnapshot = {dom: '', testdom: ''};
    var allowSnapshot = true;

    /**
     * Recursive check the specified element's children and add elements until the
     * maxheight is achieved or there's no more elements.
     *
     * @param  {object}        dom         elem        The main element
     *                                     pointer     The element to remove from
     * @param  {object}        testDom     elem        The main element
     *                                     pointer     The element to append on
     * @param  {int}           totalHeight Max height of the content area of a page
     * @param  {object}        imageDom    elem        The main element
     *                                     pointer     The element to append on
     * @return {object}        content     The testdom,
     *                         remain      The remaining DOM of elem,
     *                         done        State of whether more elements can be added to testdom
     */
    function recCheckDom(dom, testDom, totalHeight, imageDom) {
        var skipConditions = false, // Skip special conditions, so we start iterating on the children
            defaultDone = true; // Default value to return when having added all children
        if (forceImage) {
            if (dom.pointer.prop('tagName') == "FIGURE") {
                forceAddElem(dom.pointer, imageDom.elem, imageDom.pointer, true);
                imgQueue.push({
                    html: imageDom.elem.html(),
                    origin: 0,
                    height: imageDom.elem.height(),
                });
                // console.log(imageDom.elem.html());
                imageDom.pointer.html(''); // Remove element from pointer
                return {
                    done: false
                };
            } else if (dom.pointer.find('figure').length > 0) {
                // Check all children
                skipConditions = true;
                defaultDone = false;
            }
        }
        // console.log('dom --> %s', imageDom.elem.html());
        // console.log('pointer --> %s', imageDom.pointer.html());
        if (dom.pointer.prop('tagName') == "A" && dom.pointer.attr('href') == "#tex-toc") {
            // console.log('Previous --> %s', spanCount);
            if (spanCount >= 2) {
                allowSnapshot = true;
            }
            if (allowSnapshot) {
                console.log('Found title %s', dom.pointer.html());
                titleSnapshot.testdom = testDom.elem.html();
                titleSnapshot.dom = dom.elem.html();
                allowSnapshot = false;
            }
            spanCount = 0;
        }

        if (! skipConditions) {
            // Check if entire element can be added to the page.
            var obj = addToPage(dom.pointer, testDom.elem, totalHeight, testDom.pointer);
            if (obj !== null) { // Element fit
                if (testDom.elem.height() !== 0) { // Only count added element if element has a height
                    elemsOnPage++;
                }
                dom.pointer.remove();
                return obj;
            }

            // Remove newpage element and return null to end page.
            if (dom.pointer.hasClass('tex-newpage')) {
                dom.pointer.remove();
                return null;
            }

            if (dom.pointer.children().length === 0) {
                if (elemsOnPage === 0) { // Force add element if no other element on page
                    forceAddElem(dom.pointer, testDom.elem, testDom.pointer);
                }
                return null;
            }

            // Elements that should not be recusively checked for children
            var skipElem = ["SPAN", "SCRIPT", "TR", "STYLE", "FIGURE", "IMG"];

            if (dom.pointer.prop('tagName') == "FIGURE") {
                forceImage = true;
                forceAddElem(dom.pointer, imageDom.elem, imageDom.pointer, true);
                imgQueue.push({
                    html: imageDom.elem.html(),
                    origin: 0,
                    height: imageDom.elem.height(),
                });
                imageDom.pointer.html(''); // Remove element from pointer
                return {
                    done: false
                };
            }

            // Check if we're working on an element that can't be split up.
            if (skipElem.indexOf(dom.pointer.prop('tagName')) !== -1) {
                if (elemsOnPage === 0) { // Force add element if no other element on page
                    forceAddElem(dom.pointer, testDom.elem, testDom.pointer);
                }
                return null;
            }
        }


        var wrapper = dom.pointer.clone().empty(),
            inWrap = wrapper.wrap('<div>').parent().html();

        // console.log('inwrap --> %s', inWrap);

        testDom.pointer.append(inWrap);
        testDom.pointer = testDom.pointer.children(':last-child'); // Move pointer to wrap element

        imageDom.pointer.append(inWrap);
        imageDom.pointer = imageDom.pointer.children(':last-child'); // Move pointer to wrap element

        while (dom.pointer.children().length > 0) {
            var childElem = dom.pointer.children(':nth-child(1)');
            obj = recCheckDom({elem: dom.elem, pointer: childElem}, {elem: testDom.elem, pointer: testDom.pointer}, totalHeight, imageDom);
            if (obj === null) {
                break; // Couldn't add element, exit loop
            } else {
                // If done is true, then not all children were added so we can't remove the parent element
                if (obj.done === true) {
                    break;
                }

                childElem.remove();
            }
        }

        if (testDom.pointer.children().length === 0) { // Remove wrapper if no elements were added to it
            testDom.pointer.remove();
            imageDom.pointer.remove();
        }
        if (dom.pointer.children().length === 0) { // Remove element if no longer has any children
            dom.pointer.remove();
        }

        return {
            content: testDom.elem,
            remain: dom.pointer,
            done: defaultDone
        };
    }

    var bestfit = Infinity;
    var bestdom = null;

    /**
     * Construct the content of one page.
     */
    function makePage(basePage, dom, testdom, imageDom) {
        bestfit = Infinity;
        bestdom = null;
        forceImage = false; // Reset image adding
        elemsOnPage = 0; // Reset element counter
        allowSnapshot = true;
        imageDom.html('');

        var totalHeight = basePage.page.height;

        addQueueElem(dom, testdom, totalHeight, imageDom);
        imageDom.html('');
        var objTestdom = {elem: testdom, pointer: testdom};
        var objDom = {elem: dom, pointer: dom};

        // 0, 1, 2
        for (var i = 0; i <= imageShiftCount; i++) {
            var obj = recCheckDom(objDom, objTestdom, totalHeight, {elem: imageDom, pointer: imageDom});
            if (spanCount < 2) {
                dom.html(titleSnapshot.dom);
                obj.content.html(titleSnapshot.testdom);
            }

            var remainHeight = totalHeight - testdom.height(),
                heightDemerit = remainHeight * 5,
                imageDemerit = i * 50;
            var demerit = heightDemerit;
            console.log('shift --> %s, remain --> %s', i, remainHeight);

            if (demerit < bestfit) {
                bestfit = demerit;
                bestdom = {testdom: testdom.html(), dom: dom.html(), shift: i};
            }
            objTestdom.elem.find('.tex-image-move > :last-child').remove();
        }

        // console.log('--> Math');
        // console.log(testdom.height());
        // console.log(totalHeight);

        // if (imageShiftCount > 0) {
        //     console.log('removing img --> ');
        //     obj = recCheckDom(objDom, objTestdom, totalHeight, {elem: imageDom, pointer: imageDom});
        //     console.log('---');
        //     console.log(testdom.height());
        //     console.log(totalHeight);
        //     // obj.content.html(objTestdom.elem.html());
        // }
        dom.html(bestdom.dom);
        // obj.remain = dom;
        obj.content.html(bestdom.testdom);


        imgQueue = imgQueue.slice(bestdom.shift);


        basePage.content = obj.content.html();
        console.log('Page --> %s', spanCount);
        spanCount = 100; // Set this high, so a page with a single line, but no title is allowed

        return {
            "page": basePage,
            "remain": obj.remain
        };
    }

    var elemsOnPage,
        curPage;

    /**
     * Convert a dom element to a series of printable pages.
     */
    obj.texify = function(settings, dom) {
        var options = settings.options;
        dom.find('.tex-testdom').remove(); // Remove testing element we used to force font load
        var basePage = new Page();

        dom.wrapInner('<div>');

        // Add styling to get rendering dimensions
        loadStyleSettings(options);

        var pages = [],
            fullHtml = '',
            clone = dom.find('> div').first().clone(),
            obj = null;
        curPage = 1;

        // Create empty tex-document for testing rendering dimensions.
        dom.append(
            '<div class="tex-document">' +
                '<div class="tex-page" style="height: auto">' +
                    '<div class="tex-content tex-testdom"></div>' +
                '</div>' +
            '</div>'
        );
        var testdom = dom.find('.tex-testdom');

        // Create empty tex-document for testing image contruction.
        dom.append(
            '<div class="tex-document">' +
                '<div class="tex-page" style="height: auto">' +
                    '<div class="tex-content tex-image-dom"></div>' +
                '</div>' +
            '</div>'
        );
        var imageDom = dom.find('.tex-image-dom');

        // Detect rendered size.
        basePage.page.height = testdom.height();

        testdom.css('height', 'auto'); // Set height auto, so content area adjust in size depending on content
        imageDom.css('height', 'auto');

        // Typeset text.
        testdom.html(clone.html());
        TypesetBot.run('.tex-testdom', { dynamicWidth: false }, function () {
            testdom.find('.typeset-hidden').remove();
            clone.html(testdom.html());

            // Check there is still remaining html in the body.
            while (clone.html().trim() !== '') {
                testdom.html(''); // Clear the testdom object
                imageDom.html(''); // Clear the imagedom object

                // Use extend to clone pageSetting obj and remove its reference.
                pages.push(makePage($.extend(true, [], basePage), clone, testdom, imageDom));

                obj = pages[pages.length - 1];

                basePage.number = ++curPage;

                if (obj.remain != null) {
                    clone.html(obj.remain.html());
                } else {
                    clone.html('');
                }
            }

            // Assemble the pages
            pages.forEach(function (item, index) {
                item.page.total = pages.length;
                var header = genHeader(options, item.page),
                    footer = genFooter(options, item.page),
                    page   = genPage(header, footer, item.page);

                fullHtml += page;
            });

            testdom.parent().remove(); // Remove the test element
            imageDom.parent().remove(); // Remove the image element

            // Wrap document in div, to apply relative styling.
            fullHtml = '<div class="tex-document" zoom="1">' + fullHtml + '</div>';

            // Overwite the body
            dom.html(fullHtml);
        });
    };

    return obj;
}(TypeOtter || {}, jQuery));
