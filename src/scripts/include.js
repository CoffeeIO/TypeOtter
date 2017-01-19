var TypeOtter = (function(obj, $) {

    /**
     * Javascript implementation of Java’s String.hashCode() method.
     * **Modified**
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     */
    function hashCode(str) {
        var hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Find include tags in dom and include their sources.
     */
    obj.includeFiles = function(dom, callback) {
        var calls = 1;

        var recursive = function (dom, map) {
            dom.find('a[include=""]').each(function () {
                var elem = $(this),
                    href = elem.attr('href');
                if (href !== undefined && href !== '') {
                    calls++;
                    elem.load(href, function(responseText, statusText, xhr) {
                        if (statusText === 'error') { // File not found
                            console.error('File: "%s" was not found', href);
                            calls--; // Recursive call didn't happen
                        } else {
                            var hash = hashCode(elem.html());
                            if (map[hash] === true) {
                                console.error('File: "%s" recursive include detected, abort abort!', href);
                                elem.html(''); // Remove content of element
                                calls--; // Recursive call didn't happen
                                return;
                            }
                            var copy = $.extend(true, {}, map);
                            copy[hash] = true;
                            recursive(elem, copy); // Check included file for other includes.
                            elem.contents().unwrap(); // Unwrap <a> from content
                        }
                    });
                }
            });

            calls--;
        };

        recursive(dom, {});
        var timer = setInterval(function () {
            if (calls === 0) {
                clearTimeout(timer);
                callback();
            }
        }, 100);
    };

    return obj;
}(TypeOtter || {}, jQuery));
