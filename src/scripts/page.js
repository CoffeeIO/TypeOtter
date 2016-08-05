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
    
    $('<style>' + css + '</style>').appendTo('body');
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
    var curHtml = '<div class="page" data-page="' + page.number + '">';
    
    curHtml += header;
    curHtml += '<div class="content">' + stripWrapper(page.content) + '</div>';
    curHtml += footer;
    curHtml += '</div>';
    
    return curHtml;
}

/**
 * Check if element fits within the height specified, returning the html as 
 * string and the difference in height.
 */
function addToPage(dom, height) {
    if (dom.outerHeight(true) <= height) {
        return {
            height: height - dom.outerHeight(true),
            content: dom.clone().wrap('<div>').parent().html(),
            remain: null
        };
    } 
    
    return null;
}

/**
 * Recursive check the specified element's children and add elements until the 
 * height is achieved or there's no more elements.
 */
function recCheckDom(remDom, remainHeight) {
    var obj = addToPage(remDom, remainHeight);
    if (obj !== null) {
        remDom.remove();
        return obj;
    }
    if (remDom.children().length === 0) {
        return null;
    }
    
    // Elements that should not be recusively checked for children
    var skipElem = ["P", "SCRIPT", "TABLE", "STYLE", "FIGURE"];
    if (skipElem.indexOf(remDom.prop('tagName')) !== -1) {
        return null;
    }

    var curHtml = '';
    while (remDom.children().length > 0) {
        var elem = remDom.children(':nth-child(1)');
        obj = recCheckDom(elem, remainHeight);
        if (obj == null) {
            break; // exit foreach loop   
        } else {
            remainHeight = obj.height;
            curHtml += obj.content;
            
            // If done is true, then not all children were added so we can't remove the parent element
            if (obj.done === true) {
                break;
            }
            
            elem.remove();
        }
    }
    var cur = remDom.clone().html(curHtml);
    
    return {
        height: remainHeight,
        content: cur.wrap("<div>").parent().html(),
        remain: remDom,
        done: true
    };
}

/**
 * Construct the content of a page.
 */
function makePage(basePage, dom) {
    var remainingHeight = basePage.page.height,
        curHtml = '',
        obj = recCheckDom(dom, remainingHeight);
    basePage.content = obj.content;

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
    
    // Wrap the body in a page to get accurate height on elements
    dom.wrapInner('<div>').wrapInner('<div class="content">').wrapInner('<div class="page">');
    
    // Add styling to get rendering dimensions
    loadStyleSettings(options);
    
    // Detect rendered size
    basePage.page.height = $('body').find('.content').height();
    
    var pages = [],
        fullHtml = '',
        clone = dom.find('.content > div'),
        obj = null,
        curPage = 1;
    
    // Check there is still remaining html in the body
    while (clone.html().trim() !== '') {
        // use extend to clone pageSetting obj and remove it's reference
        pages.push(makePage($.extend(true, [], basePage), clone));
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
    
    // Overwite the body
    $('body').html(fullHtml);
    
    // Add styling again because they were just overwritten
    loadStyleSettings(options);
}
