var TypeOtter = (function(obj, $) {

    /**
     * Load GitHub gists, modified.
     * Compiled to JS and added callback.
     * Based on Evan Sosenko: https://gist.github.com/razor-x/8288761
     * Originally based on Mark Selby's async-gists.js: https://gist.github.com/markselby/7209751
     */
    obj.loadGist = function (callback) {
        var GIST_HOST, code, elements, gists, loader, stylesheets, gistCount, gistRendered;
        GIST_HOST = 'https://gist.github.com';
        elements = $('div[data-gist]');
        if (elements.length === 0) {
            callback();
            return;
        }
        gists = {};
        gistCount = 0;
        gistRendered = 0;
        code = [];
        stylesheets = [];
        loader = function(url) {
            var link;
            link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            document.getElementsByTagName('head')[0].appendChild(link);
        };
        elements.addClass('loading');
        elements.each(function(index, element) {
            var gist;
            gistCount++;
            element = $(element);
            gist = element.data('gist');
            if (gists[gist] == null) {
                gists[gist] = {
                    targets: []
                };
            }
            return gists[gist].targets.push(element);
        });
        return $.each(gists, function(id, data) {
            return $.getJSON(GIST_HOST + "/" + id + ".json?callback=?", function(data) {
                var div, gist, stylesheet;
                gist = gists[id];
                gist.data = data;
                stylesheet = gist.data.stylesheet;
                if (stylesheets.indexOf(stylesheet) < 0) {
                    stylesheets.push(stylesheet);
                    loader(stylesheet);
                }
                div = gist.data.div;
                gist.files = $(div).find('.gist-file');
                gist.outer = $(div).first().html('');
                return $(gist.targets).each(function(index, target) {
                    var file, inner, outer;
                    file = target.data('gist-file');
                    if (file) {
                        outer = gist.outer.clone();
                        inner = '';
                        var index = gist.data.files.indexOf(file);
                        if (index !== -1) {
                            inner =
                                "<div class=\"gist-file\">" +
                                    $(gist.files.get(gist.data.files.indexOf(file))).html() +
                                "</div>";
                        }
                        outer.html(inner);
                    } else {
                        outer = $(div);
                    }
                    outer.hide();
                    return target.hide(function() {
                        $(this).replaceWith(outer);
                        return outer.show(function () {
                            gistRendered++;
                            if (gistCount === gistRendered) {
                                if (callback != null) {
                                    callback();
                                }
                            }
                        });
                    });
                });
            })
            .fail(function() {
                console.error('Gist id: "%s" was not found', id);
                gistCount -= data.targets.length;
                if (gistCount === gistRendered) {
                    if (callback != null) {
                        callback();
                    }
                }
            });
        });
    };

    return obj;
}(TypeOtter || {}, jQuery));
