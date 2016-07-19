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
    for (var key in o2) { o1[key] = o2[key]; }
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
    }
};

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
    if (options.headerLeft == '[pager]' || options.headerCenter == '[pager]' || options.headerRight == '[pager]') {
        pager = genPager(options, page);
    }
    
    if (options.headerLeft != '') {
        if (options.headerLeft == '[pager]') curHtml += '<div class="left">' + pager + '</div>';
        else curHtml += '<div class="left">' + options.headerLeft + '</div>'
    }
    if (options.headerCenter != '') { 
        if (options.headerCenter == '[pager]') curHtml += '<div class="center">' + pager + '</div>';
        else curHtml += '<div class="center">' + options.headerCenter + '</div>';
    }
    if (options.headerRight != '') {
        if (options.headerRight == '[pager]') curHtml += '<div class="right">' + pager + '</div>';
        else curHtml += '<div class="right">' + options.headerRight + '</div>';
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
    if (options.footerLeft == '[pager]' || options.footerCenter == '[pager]' || options.footerRight == '[pager]') {
        pager = genPager(options, page);
    }
    
    if (options.footerLeft != '') {
        if (options.footerLeft == '[pager]') curHtml += '<div class="left">' + pager + '</div>';
        else curHtml += '<div class="left">' + options.footerLeft + '</div>'
    }
    if (options.footerCenter != '') { 
        if (options.footerCenter == '[pager]') curHtml += '<div class="center">' + pager + '</div>';
        else curHtml += '<div class="center">' + options.footerCenter + '</div>';
    }
    if (options.footerRight != '') {
        if (options.footerRight == '[pager]') curHtml += '<div class="right">' + pager + '</div>';
        else curHtml += '<div class="right">' + options.footerRight + '</div>';
    }
    curHtml += '</div>';
    
    return curHtml;
}

/**
 * Construct the html of the page.
 */
function genPage(header, footer, page) {
    var curHtml = page.page.wrapper;
    curHtml += header;
    curHtml += '<div class="content">' + page.content + '</div>';
    curHtml += footer;
    curHtml += '</div>';
    
    return curHtml;
}

function addToPage(dom, height) {
    if (dom.outerHeight(true) <= height) {
        console.log('returning --> ' + (height - dom.outerHeight(true)) + ' --- ' + dom.html());
        return {
            height: height - dom.outerHeight(true),
            content: dom.clone().wrap('<div>').parent().html(),
            remain: null
        };
    } else {
        return null;
    }
}

function recCheckDom(remDom, remainHeight) {
    //remDom.css('height', 'auto');
    console.log('rec that dom --> ' + remainHeight);
    console.log('content --> ' + remDom.attr('class'));

    
    var obj = addToPage(remDom, remainHeight);
    if (obj !== null) {
        remDom.remove();
        return obj;
    }
    if (remDom.children().length == 0) {
        return null;
    }

    var curHtml = '';
    console.log('Checkpoint 1');
    while (remDom.children().length > 0) {
        console.log('Loop!');
        var elem = remDom.children(':nth-child(1)');
        obj = recCheckDom(elem, remainHeight);
        if (obj == null) break; // exit foreach loop
        else {
            remainHeight = obj.height;
            curHtml += obj.content;
            if (obj.done == true) break;
            
            elem.remove(); // If done is true, then not all children were added so we can't remove the parent element
        }
    }
    
    console.log('Checkpoint 2');

    var cur = remDom.clone().html(curHtml);
    return {
        height: remainHeight,
        content: cur.wrap("<div>").parent().html(),
        remain: remDom,
        done: true // Check for children
    }
    
    
    return null;
}

/**
 * Construct the content of a page.
 */
function makePage (basePage, dom) {
    console.log('--> new page <--');
    var remainingHeight = basePage.page.height,
        curHtml = '';
    
    var obj = recCheckDom(dom, remainingHeight);
    
    /*
    while (dom.children().length > 0 && dom.children(':nth-child(1)').outerHeight(true) <= remainingHeight) {
        remainingHeight -= dom.children(':nth-child(1)').outerHeight(true);
        curHtml += dom.children(':nth-child(1)').clone().wrap('<div>').parent().html();
        dom.children(':nth-child(1)').remove();
    }
    */
    
    basePage.content = obj.content;
    
    //console.log('remainHeight --> ' + remainingHeight);
    //console.log('cur html --> ' + page);
    //console.log('remain html --> ' + dom.html());

    return {
        "page": basePage,
        "remain": obj.remain
    };
}

/**
 * Load page style based on default / user specified options.
 */
function loadStyleSettings(options) {
    var css = 
        "body {  width: " + options.width + "; }"
      + ".page { height: calc(" + options.height + " - (2 * " + options.padding + ")); "
      + "width: calc(" + options.width + " - (2 * " + options.padding + ")); "
      + "padding: " + options.padding + "; "
      + "}"
      + ".content { height: calc(" + options.height + " - (2 * " + options.padding + ")" + " - " + options.headerHeight + " - " + options.footerHeight + "); }"
      + ".header { height: " + options.headerHeight + "; line-height: " + options.headerHeight + "; }"
      + ".footer { height: " + options.footerHeight + "; line-height: " + options.footerHeight + "; }";
    
    $('<style>' + css + '</style>').appendTo('body');
}

/**
 * Convert a dom element to a series of printable pages.
 */
function texify (customOptions, dom) {
    var options = jsonConcat(defaultOptions, customOptions);
    var basePage = new Page();    
    
    // Wrap the body in a page to get accurate height on elements
    dom.wrapInner('<div>').wrapInner('<div class="content">').wrapInner('<div class="page">');
    
    // Add styling to get rendering dimensions
    loadStyleSettings(options);
    
    // Detect rendered size
    basePage.page.height = $('body').find('.content').height();
    
    // Debug variables ------------------------------------
    var DEBUG_MAX = 10,
        debugCount = 0;
    // ----------------------------------------------------
    
    var pages = [],
        fullHtml = '';
    
    var clone = dom.find('.content > div'),
        obj = null,
        curPage = 1;
    
    // Check there is still remaining html in the body
    while (clone.html().trim() != '') {
        // use extend to clone pageSetting obj and remove it's reference
        pages.push(makePage($.extend(true, [], basePage), clone));
        obj = pages[pages.length - 1];
    
        
        
        basePage.number = ++curPage;
        
        console.log('how much remain ?');
        
        if (obj.remain != null) {
            clone.html(obj.remain.html());
            console.log(obj.remain.html());
        }
        else clone.html('');
        
        if (debugCount++ >= DEBUG_MAX) { console.error('TOO MANY PAGES!!!'); break; }
    }
    
    // Assemble the pages
    pages.forEach(function (item, index) {
        item.page.total = pages.length;
        var header = genHeader(options, item.page),
            footer = genFooter(options, item.page),
            page   = genPage(header, footer, item.page);
        
        fullHtml += page;
        console.log('render --> page ' + index);
    });
    
    $('body').html(fullHtml);
    
    // Add styling again because they were just overwritten
    loadStyleSettings(options);
}
