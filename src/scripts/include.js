var mlTex = (function(obj, $) {
    /**
     * Find include tags in dom and include their sources.
     */
    obj.includeFiles = function(dom) {
        var loading = 0; // Count number of active load requests

        dom.find('a[include=""]').each(function (index) {
            var elem = $(this),
                href = elem.attr('href');
            if (href !== undefined && href !== '') {
                loading++;
                elem.load(href, function(data) {
                    if (data === undefined) { // File not found
                        console.error('File: "%s" was not found', href);
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
                if (dom.find('a[include=""]').length > 0) {
                    includeFiles(dom);
                }
                clearInterval(timer);
            }
        }, 50);
    }

    return obj;
}(mlTex || {}, jQuery));
