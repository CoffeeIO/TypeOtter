// normal dpi --> height: 1123px, width: 794px
//                1cm = 37.795275591px
var pixelPerCm = 37.795275591;

// Default options the program will use.
var defaultOptions = {
    // Dimensions
    height : '297mm',
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
function jsonConcat(o1, o2) {
    for (var key in o2) { o1[key] = o2[key]; }
    return o1;
}

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

var curPage = 1;
var totalPage = 1;

var pageTemp   = '<div class="page">';
var headerTemp = '<div class="header">';
var footerTemp = '<div class="footer">';

function genPager(options, page) {
    return options.pager.replace('[cur]', page.number).replace('[total]', page.total);
}

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

function genPage(header, footer, page) {
    var curHtml = page.page.wrapper;
    curHtml += header;
    curHtml += '<div class="content">' + page.content + '</div>';
    curHtml += footer;
    curHtml += '</div>';
    
    return curHtml;
}

function makePage (basePage, dom, options) {
    console.log('--> new page <--');
    var remainingHeight = basePage.page.height,
        curHtml = '';
    while (dom.children().length > 0 && dom.children(':nth-child(1)').outerHeight(true) <= remainingHeight) {
        remainingHeight -= dom.children(':nth-child(1)').outerHeight(true);
        curHtml += dom.children(':nth-child(1)').clone().wrap('<div>').parent().html();
        dom.children(':nth-child(1)').remove();
    }
    basePage.content = curHtml;
    
    console.log('remainHeight --> ' + remainingHeight);
    //console.log('cur html --> ' + page);
    console.log('remain html --> ' + dom.html());

    return {
        "page": basePage,
        "remain": dom.html()
    };
}

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

function texify (customOptions, html) {
    var options = jsonConcat(defaultOptions, customOptions);
    var basePage = new Page();
    
    // **Needs to be loaded before wrapping body, because everything is overwritten afterwards.**
    loadStyleSettings(options);
    
    // Wrap the body in a page to get accurate height on elements
    html.wrapInner('<div class="content">').wrapInner('<div class="page">');
    
    // Detect rendered size
    basePage.page.height = $('body').find('.content').height();
    
    // Debug variables ------------------------------------
    var DEBUG_MAX = 10,
        debugCount = 0;
    // ----------------------------------------------------
    
    var pages = [],
        fullHtml = '';
    
    var clone = html.find('.content'),
        obj = null;
    // Check there is still remaining html in the body
    while (clone.html().trim() != '') {
        // use extend to clone pageSetting obj and remove it's reference
        pages.push(makePage($.extend(true, [], basePage), clone, options));
        obj = pages[pages.length - 1];
    
        basePage.number = ++curPage;
        clone.html(obj.remain);
        
        //if (debugCount++ >= DEBUG_MAX) { console.error('TOO MANY PAGES!!!'); break; }
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
}
