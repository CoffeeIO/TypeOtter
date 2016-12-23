var mlTex = (function(obj, $) {

    /**
     * Javascript implementation of Java’s String.hashCode() method.
     * **Modified**
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     */
    function hashCode(str) {
    	var hash = 0;
    	if (str.length == 0) return hash;
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
    obj.includeFiles = function(dom, map) {
        dom.find('a[include=""]').each(function () {
            var elem = $(this),
                href = elem.attr('href');
            if (href !== undefined && href !== '') {
                elem.load(href, function(data) {
                    if (data === undefined) { // File not found
                        console.error('File: "%s" was not found', href);
                    } else {
                        var hash = hashCode(elem.html());
                        if (map[hash] === true) {
                            console.error('File: "%s" recursive include detected, abort abort!', href);
                            elem.html(''); // Empty element
                            return;
                        }
                        var copy = $.extend(true, {}, map);
                        copy[hash] = true;
                        obj.includeFiles(elem, copy); // Check included file for other includes.
                        elem.contents().unwrap(); // Unwrap <a> from content
                    }
                });
            }
        });
    };

    return obj;
}(mlTex || {}, jQuery));
