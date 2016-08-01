function includeFiles(dom) {
    var loading = 0;
    dom.find('include').each(function (index) {
        var elem = $(this),
            src = elem.attr('src');
        if (src !== undefined && src !== '') {
            loading++;
            elem.load(src, function(data) {
                if (data === undefined) { // File not found
                    console.error('File: "' + src + '" was not found');
                } else {
                    elem.after(elem.html());
                }
                elem.remove();
                loading--;
            });
        }
    });
    
    var timer = setInterval(function () {
        if (loading <= 0) {
            if (dom.find('include').length > 0) {
                includeFiles(dom);
            }
            clearInterval(timer);
        }
    }, 50);
}
