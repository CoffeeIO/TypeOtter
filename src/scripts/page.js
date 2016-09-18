// normal dpi --> height: 1123px, width: 794px
//                1cm = 37.795275591px

// Default options the program will use.
var defaultOptions = {
    // Dimensions
    height : '296mm', // Issue: printing makes blank page at the end **reduced height from 297mm**
    width : '210mm',
    padding : '10mm',
    headerHeight : '6mm',
    footerHeight : '6mm',

    // Header
    headerRight : '',
    headerCenter : '',
    headerLeft : '',

    // Footer
    footerRight : '',
    footerCenter : '[pager]',
    footerLeft : '',

    // Pager
    pager : '[cur]',
    pagerStyle : '1'
};

/**
 * Merge two json objects
 *
 * @param o1 The default json, base
 * @param o2 The custom json, overwrite existing elements
 */
function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}

// Base empty Page Object
var Page = function () {
    this.number = 1,
    this.total = 1,
    this.content = "",
    this.page = {
        wrapper : '<div class="page">',
        height: ''
    },
    this.header = {
        wrapper : '<div class="header">',
        right : "",
        center : "",
        left : ""
    },
    this.footer = {
        wrapper : '<div class="footer">',
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
 * Strip simple '<div></div>' wrap of a string.
 */
function stripWrapper(html) {
    return html.substring(0, html.length - 6).substring(5);
}

/**
 * Load page style based on default / user specified options.
 * Styles are loaded in the head.
 */
function loadStyleSettings(options) {
    var padding = getMargin(options.padding);
    var css =
        "body {  width: " + options.width + "; }"
      + ".page { height: calc(" + options.height + " - " + padding.top + " - " + padding.bottom + "); "
      + "width: calc(" + options.width + " - " + padding.left + " - " + padding.right + "); "
      + "padding: " + options.padding + "; "
      + "}"
      + ".content { height: calc(" + options.height + " - " + padding.top + " - " + padding.bottom + " - "
      + options.headerHeight + " - " + options.footerHeight + "); }"
      + ".header { height: " + options.headerHeight + "; line-height: " + options.headerHeight + "; }"
      + ".footer { height: " + options.footerHeight + "; line-height: " + options.footerHeight + "; }";

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
    if (options.headerLeft === '[pager]' || options.headerCenter === '[pager]' || options.headerRight === '[pager]') {
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
    if (options.footerLeft === '[pager]' || options.footerCenter === '[pager]' || options.footerRight === '[pager]') {
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
    var curHtml = '<a name="tex-page-' + page.number + '"></a>';
    curHtml += '<div class="page" data-page="' + page.number + '">';
    curHtml += header;
    curHtml += '<div class="content">' + page.content + '</div>';
    curHtml += footer;
    curHtml += '</div>';

    return curHtml;
}

/**
 * Check if element fits within the height specified, returning the html as
 * string and the difference in height.
 */
function addToPage(element, testdom, totalHeight, pointer) {
    var temp = pointer.html();
    pointer.append(element.clone().wrap('<div>').parent().html());
    if (testdom.outerHeight(true) <= totalHeight) {
        return {
            content: testdom,
            remain: null
        };
    }

    pointer.html(temp); // Revert to before the element was added

    return null;
}

/**
 * Recursive check the specified element's children and add elements until the
 * maxheight is achieved or there's no more elements.
 *
 * @param  {jQuery object} clone       DOM element with remaining elements
 * @param  {jQuery object} testdom     DOM element for contructing a page
 * @param  {int}           totalHeight Max height of the content area of a page
 * @param  {jQuery object} pointer     Insertion point of new elements in 'testdom'
 * @return {object}                    content: the testdom,
 *                                     remain: the remaining DOM of clone,
 *                                     done: state of whether more elements can be added to testdom
 */
function recCheckDom(clone, testdom, totalHeight, pointer) {
    // Check if entire element can be added to the page.
    var obj = addToPage(clone, testdom, totalHeight, pointer);
    if (obj !== null) {
        clone.remove();
        return obj;
    }

    // Remove newpage element and return null to end page.
    if (clone.hasClass('tex-newpage')) {
        clone.remove();
        return null;
    }

    if (clone.children().length === 0) {
        return null;
    }

    // Elements that should not be recusively checked for children
    var skipElem = ["P", "SCRIPT", "TABLE", "STYLE", "FIGURE"];
    if (skipElem.indexOf(clone.prop('tagName')) !== -1) {
        return null;
    }

    var wrapper = clone.clone().empty(),
        inWrap = wrapper.wrap('<div>').parent().html();

    pointer.append(inWrap);
    pointer = pointer.children(':last-child'); // Move pointer to wrap element

    while (clone.children().length > 0) {
        var elem = clone.children(':nth-child(1)');
        obj = recCheckDom(elem, testdom, totalHeight, pointer);
        if (obj === null) {
            break; // Exit foreach loop
        } else {
            // If done is true, then not all children were added so we can't remove the parent element
            if (obj.done === true) {
                break;
            }

            elem.remove();
        }
    }

    if (pointer.children().length === 0) { // Remove wrapper if no elements were added to it
        pointer.remove();
    }

    return {
        content: testdom,
        remain: clone,
        done: true
    };
}

/**
 * Construct the content of a page.
 */
function makePage(basePage, clone, testdom) {
    var totalHeight = basePage.page.height,
        obj = recCheckDom(clone, testdom, totalHeight, testdom);
    basePage.content = obj.content.html();

    return {
        "page": basePage,
        "remain": obj.remain
    };
}

/**
 * Convert a dom element to a series of printable pages.
 */
function texify(customOptions, dom) {
    var options = jsonConcat(defaultOptions, customOptions),
        basePage = new Page();

    dom.wrapInner('<div>');

    // Add styling to get rendering dimensions
    loadStyleSettings(options);

    var pages = [],
        fullHtml = '',
        clone = dom.find('> div').first().clone(),
        obj = null,
        curPage = 1;

    // Create empty page for testing rendering dimensions.
    dom.append('<div class="page" style="height: auto"><div class="content tex-testdom"></div></div>');
    var testdom = dom.find('.tex-testdom');

    // Detect rendered size
    basePage.page.height = testdom.height();
    testdom.css('height', 'auto');
    // Check there is still remaining html in the body
    while (clone.html().trim() !== '') {
        testdom.html(''); // Clear the testdom object

        // use extend to clone pageSetting obj and remove it's reference
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

    // Overwite the body
    dom.html(fullHtml);
}
