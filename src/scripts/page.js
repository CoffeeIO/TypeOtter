var Page = function () {
    this.height = '221mm',
    this.width = '297mm',
    this.number = 1,
    this.html = ''
};

var curPage = 1;
var totalPage = 1;

var headerTemp = '<div class="header"></div>';
var footerTemp = '<div class="footer"></div>';


function makePage (pageSettings, html) {
    console.log(html.children(':nth-child(1)').outerHeight(true));
    console.log($('p:first-child').height());
    
}
function texify (pageSettings, html) {
    var clone = html;
    //while (clone.text().trim() != '') {
        var obj = makePage(pageSettings, clone);
        pageSettings.number = ++curPage;
        //console.log(JSON.stringify(obj));
    //}
    return "hello";
}
