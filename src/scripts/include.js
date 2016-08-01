function includeFiles(dom) {
    var loading = 0;
    dom.find('include').each(function (index) {
        var elem = $(this);
        if (elem.attr('src') != '') {
            loading++;
            elem.load(elem.attr('src'), function(data) {
                if (data === undefined) {
                    console.error('File: "' + elem.attr('src') + '" was not found');
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
