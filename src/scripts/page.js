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

    /**
     * Add element to testdom and compare with maxheight, return new testdom if less, otherwise
     * revert to previous state.
     */
    function addToPage(element, testdom, totalHeight, pointer) {
        var temp = pointer.html();
        pointer.append(element.clone().wrap('<div>').parent().html());
        if (testdom.outerHeight(true) <= totalHeight) {
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
     * Recursive check the specified element's children and add elements until the
     * maxheight is achieved or there's no more elements.
     *
     * @param  {jQuery object} elem        DOM element with remaining elements
     * @param  {jQuery object} testdom     DOM element for contructing a page
     * @param  {int}           totalHeight Max height of the content area of a page
     * @param  {jQuery object} pointer     Insertion point of new elements in 'testdom'
     * @return {object}        content     The testdom,
     *                         remain      The remaining DOM of elem,
     *                         done        State of whether more elements can be added to testdom
     */
    function recCheckDom(elem, testdom, totalHeight, pointer) {
        // Check if entire element can be added to the page.
        var obj = addToPage(elem, testdom, totalHeight, pointer);
        if (obj !== null) { // Element fit
            if (testdom.height() !== 0) { // Only count added element if element has a height
                elemsOnPage++;
            }
            elem.remove();
            return obj;
        }

        // Remove newpage element and return null to end page.
        if (elem.hasClass('tex-newpage')) {
            elem.remove();
            return null;
        }

        if (elem.children().length === 0) {
            if (elemsOnPage === 0) { // Force add element if no other element on page
                pointer.append(elem.clone().wrap('<div>').parent().html());
                if (testdom.height() !== 0) { // Only count added element if element has a height
                    elemsOnPage++;
                }
                elem.remove();
                return {
                    content: testdom,
                    remain: null,
                    done: false
                };
            }
            return null;
        }

        // Elements that should not be recusively checked for children
        var skipElem = ["P", "SCRIPT", "TABLE", "STYLE", "FIGURE"];
        if (skipElem.indexOf(elem.prop('tagName')) !== -1) {
            if (elemsOnPage === 0) { // Force add element if no other element on page
                pointer.append(elem.clone().wrap('<div>').parent().html());
                if (testdom.height() !== 0) { // Only count added element if element has a height
                    elemsOnPage++;
                }
                elem.remove();
                return {
                    content: testdom,
                    remain: null,
                    done: false
                };
            }
            return null;
        }

        var wrapper = elem.clone().empty(),
            inWrap = wrapper.wrap('<div>').parent().html();

        pointer.append(inWrap);
        pointer = pointer.children(':last-child'); // Move pointer to wrap element

        while (elem.children().length > 0) {
            var childElem = elem.children(':nth-child(1)');
            obj = recCheckDom(childElem, testdom, totalHeight, pointer);
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

        if (pointer.children().length === 0) { // Remove wrapper if no elements were added to it
            pointer.remove();
        }
        if (elem.children().length === 0) { // Remove element if no longer has any children
            elem.remove();
        }

        return {
            content: testdom,
            remain: elem,
            done: true
        };
    }

    /**
     * Construct the content of one page.
     */
    function makePage(basePage, clone, testdom) {
        elemsOnPage = 0; // Reset element counter
        var totalHeight = basePage.page.height,
            obj = recCheckDom(clone, testdom, totalHeight, testdom);
        basePage.content = obj.content.html();

        return {
            "page": basePage,
            "remain": obj.remain
        };
    }
    var elemsOnPage = 0;
    /**
     * Convert a dom element to a series of printable pages.
     */
    obj.texify = function(options, dom) {
        dom.find('.tex-testdom').remove(); // Remove testing element we used to force font load
        var basePage = new Page();

        dom.wrapInner('<div>');

        // Add styling to get rendering dimensions
        loadStyleSettings(options);

        var pages = [],
            fullHtml = '',
            clone = dom.find('> div').first().clone(),
            obj = null,
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

        // Detect rendered size.
        basePage.page.height = testdom.height();

        testdom.css('height', 'auto'); // Set height auto, so content area adjust in size depending on content

        // Check there is still remaining html in the body.
        while (clone.html().trim() !== '') {
            testdom.html(''); // Clear the testdom object

            // Use extend to clone pageSetting obj and remove its reference.
            pages.push(makePage($.extend(true, [], basePage), clone, testdom));

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

        // Wrap document in div, to apply relative styling.
        fullHtml = '<div class="tex-document" zoom="1">' + fullHtml + '</div>';

        // Overwite the body
        dom.html(fullHtml);
    };

    return obj;
}(TypeOtter || {}, jQuery));
