// normal dpi --> height: 1123px, width: 794px
//                1cm = 37.795275591px
var pixelPerCm = 37.795275591;

var Page = function () {
    this.height = '297mm',
    this.width = '210mm',
    this.number = 1,
    this.html = '',
    this.headerHeight = '',
    this.footerHeight = ''
};

var curPage = 1;
var totalPage = 1;

var pageTemp   = '<div class="page">'
var headerTemp = '<div class="header">';
var footerTemp = '<div class="footer">';

function genHeader(left, center, right) {
    var curHtml = headerTemp;
    if (left != '') curHtml += '<div class="left">' + left + '</div>';
    if (center != '') curHtml += '<div class="center">' + center + '</div>';
    if (right != '') curHtml += '<div class="right">' + right + '</div>';
    curHtml += '</div>';
    
    return curHtml;
}
function genFooter(left, center, right) {
    var curHtml = footerTemp;
    if (left != '') curHtml += '<div class="left">' + left + '</div>';
    if (center != '') curHtml += '<div class="center">' + center + '</div>';
    if (right != '') curHtml += '<div class="right">' + right + '</div>';
    curHtml += '</div>';
    
    return curHtml;
}
function genPage(header, content, footer) {
    var curHtml = pageTemp;
    curHtml += header;
    curHtml += '<div class="content">' + content + '</div>';
    curHtml += footer;
    curHtml += '</div>';
    
    return curHtml;
}

function makePage (pageSettings, html) {
    console.log('--> new page');
    var remainingHeight = pageSettings.height,
        curHtml = '';
    while (html.children().length > 0 && html.children(':nth-child(1)').outerHeight(true) <= remainingHeight) {
        remainingHeight -= html.children(':nth-child(1)').outerHeight(true);
        curHtml += html.children(':nth-child(1)').clone().wrap('<div>').parent().html();
        html.children(':nth-child(1)').remove();
    }
    var header = genHeader('Testing page layout', '<i>by</i>', 'MGApcDev'),
        footer = genFooter('left', pageSettings.number, 'right'),
        page   = genPage(header, curHtml, footer);
    
    pageSettings.html = page;
    
    var obj = {
        "page": pageSettings,
        "remain": html.html()
    };
    
    console.log('remain --> ' + remainingHeight);
    console.log('cur html --> ' + page);
    console.log('remain html --> ' + obj.remain);

    
    return {
        "page": pageSettings,
        "remain": html.html()
    };
}
function texify (pageSettings, html) {
    html.wrapInner('<div class="content">').prepend('<div class="header">').append('<div class="footer">').wrapInner('<div class="page">');
    pageSettings.height = $('body').find('.content').height(),
    pageSettings.headerHeight = $('body').find('.header').height(),
    pageSettings.footerHeight = $('body').find('.footer').height();
    
    var pages = [],
        fullHtml = '';
    
    var clone = html.find('.content'),
        obj = null;
    while (clone.html().trim() != '') {
        // use extend to clone pageSetting obj and remove it's reference
        pages.push(makePage($.extend(true, [], pageSettings), clone));
        obj = pages[pages.length - 1];
    
        pageSettings.number = ++curPage;
        clone.html(obj.remain);
    }
    
    pages.forEach(function (item, index) {
        fullHtml += item.page.html;
        console.log('page' + index + ' --> ' + item.page.html);
    });
    
    $('body').html(fullHtml);
    return "hello";
}
