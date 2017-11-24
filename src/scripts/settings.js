var TypeOtter = (function(obj, $) {

    // Default options the program will use.
    var defaultOptions = {
        // Dimensions
        height : '296mm', // Issue: printing makes blank page at the end **reduced height from 297mm**
        width : '210mm',
        padding: "10mm 25mm",
        headerHeight : '8mm',
        footerHeight : '8mm',

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
        pagerStyle : '1',

        // Pagination
        minSpanAfterTitle : 2,
        paginationDemerit (remainHeight, imgQueue, offset, options) {
            // Calculate image demerit.
            var imageDemerit = 0;
            for (var i = 0; i < offset; i++) {
                var item = imgQueue[i];
                imageDemerit += Math.pow(3 + ((item.origin - 1) * 2), 2);
            }

            var heightDemerit = remainHeight * 1;

            return imageDemerit + heightDemerit;
        }
    };

    /**
     * Merge two json objects.
     *
     * @param o1 The default json, base
     * @param o2 The custom json, overwrite existing elements
     */
    function jsonConcat(o1, o2) {
        for (var key in o2) {
            if ({}.hasOwnProperty.call(o2, key)) {
                o1[key] = o2[key];
            }
        }
        return o1;
    }

    /**
     * Validate settings otherwise return default values.
     */
    function validateSettings(settings) {
        if (settings == null || !(settings instanceof Object)) {
            return {
                selector: 'body',
                options: {},
                biblography: {}
            };
        }
        if (!(typeof settings.selector === "string") || settings.selector.trim() === '') {
            settings.selector = 'body';
        }
        // Check selector can find an element.
        var count = $(settings.selector).length;
        if (count !== 1) {
            if (count === 0) {
                console.error('Selector "%s" not found', settings.selector);
            } else if (count > 1) {
                console.error('Selector "%s" found mutiple elements, selector needs to be unique', settings.selector);
            }
            return null;
        }
        if (settings.options == null || !(settings.options instanceof Object)) {
            settings.options = {};
        }
        if (settings.biblography == null || !(settings.biblography instanceof Object)) {
            settings.biblography = {};
        }

        return settings;
    }

    /**
     * Validate settings and merge with default settings.
     */
    obj.getSettings = function (settings) {
        settings = validateSettings(settings);
        if (settings === null) {
            return null;
        }

        settings.options = jsonConcat($.extend(true, {}, defaultOptions), settings.options);

        return settings;
    };

    return obj;
}(TypeOtter || {}, jQuery));
