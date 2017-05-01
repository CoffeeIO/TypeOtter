var TypeOtter = (function(obj, $) {
    // Base empty Page Object.
    obj.Page = function () {
        this.number = 1,
        this.total = 1,
        this.content = "",
        this.page = {
            wrapper : '<div class="tex-page">',
            height: ''
        },
        this.header = {
            wrapper : '<div class="tex-header">',
            right : "",
            center : "",
            left : ""
        },
        this.footer = {
            wrapper : '<div class="tex-footer">',
            right : "",
            center : "",
            left : ""
        };
    };

    /**
     * Analyse the content of a margin / padding string.
     */
    obj.getMargin = function (input) {
        var reg4value = /^[\s]*([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]*$/,
            reg2value = /^[\s]*([0-9]+[\w%]*)[\s]+([0-9]+[\w%]*)[\s]*$/,
            reg1value = /^[\s]*([0-9]+[\w%]*)[\s]*$/;
        // 4 values
        var match = reg4value.exec(input);
        if (match !== null) {
            return {top: match[1], right: match[2], bottom: match[3], left: match[4]};
        }
        // 2 values
        match = reg2value.exec(input);
        if (match !== null) {
            return {top: match[1], right: match[2], bottom: match[1], left: match[2]};
        }
        // 1 value
        match = reg1value.exec(input);
        if (match !== null) {
            return {top: match[1], right: match[1], bottom: match[1], left: match[1]};
        }

        return null;
    }

    /**
     * Load page style based on settings.
     * Styles are loaded in the head.
     */
    obj.loadStyleSettings = function (options) {
        var padding = obj.getMargin(options.padding);
        var css =
            ".tex-document {  width: " + options.width + "; }" +
            ".tex-page { " +
                "height: calc(" + options.height + " - " + padding.top + " - " + padding.bottom + "); " +
                "width: calc(" + options.width + " - " + padding.left + " - " + padding.right + "); " +
                "padding: " + options.padding + "; " +
            "}" +
            ".tex-content { " +
                "height: calc(" + options.height + " - " + padding.top + " - " + padding.bottom + " - " +
                    options.headerHeight + " - " + options.footerHeight + "); " +
            "}" +
            ".tex-header { " +
                "height: " + options.headerHeight + "; " +
                "line-height: " + options.headerHeight + "; " +
            "}" +
            ".tex-footer { " +
                "height: " + options.footerHeight + "; " +
                "line-height: " + options.footerHeight + "; " +
            "}";

        $('<style type="text/css">' + css + '</style>').appendTo('head');
    }

    /**
     * Construct the html of the pager of a specific page.
     */
    obj.genPager = function (options, page) {
        return options.pager.replace('[cur]', page.number).replace('[total]', page.total);
    }

    /**
     * Construct the html of the header of a specific page.
     */
    obj.genHeader = function (options, page) {
        var curHtml = page.header.wrapper,
            pager = '';
        if (options.headerLeft === '[pager]' || options.headerCenter === '[pager]' ||
            options.headerRight === '[pager]') {
            pager = obj.genPager(options, page);
        }

        if (options.headerLeft !== '') {
            if (options.headerLeft === '[pager]') {
                curHtml += '<div class="left">' + pager + '</div>';
            } else {
                curHtml += '<div class="left">' + options.headerLeft + '</div>';
            }
        }
        if (options.headerCenter !== '') {
            if (options.headerCenter === '[pager]') {
                curHtml += '<div class="center">' + pager + '</div>';
            } else {
                curHtml += '<div class="center">' + options.headerCenter + '</div>';
            }
        }
        if (options.headerRight !== '') {
            if (options.headerRight === '[pager]') {
                curHtml += '<div class="right">' + pager + '</div>';
            } else {
                curHtml += '<div class="right">' + options.headerRight + '</div>';
            }
        }
        curHtml += '</div>';

        return curHtml;
    }

    /**
     * Construct the html of the footer of a specific page.
     */
    obj.genFooter = function (options, page) {
        var curHtml = page.footer.wrapper,
            pager = '';
        if (options.footerLeft === '[pager]' || options.footerCenter === '[pager]' ||
            options.footerRight === '[pager]') {
            pager = obj.genPager(options, page);
        }

        if (options.footerLeft !== '') {
            if (options.footerLeft === '[pager]') {
                curHtml += '<div class="left">' + pager + '</div>';
            } else {
                curHtml += '<div class="left">' + options.footerLeft + '</div>';
            }
        }
        if (options.footerCenter !== '') {
            if (options.footerCenter === '[pager]') {
                curHtml += '<div class="center">' + pager + '</div>';
            } else {
                curHtml += '<div class="center">' + options.footerCenter + '</div>';
            }
        }
        if (options.footerRight !== '') {
            if (options.footerRight === '[pager]') {
                curHtml += '<div class="right">' + pager + '</div>';
            } else {
                curHtml += '<div class="right">' + options.footerRight + '</div>';
            }
        }
        curHtml += '</div>';

        return curHtml;
    }

    /**
     * Construct the html of the page.
     */
    obj.genPage = function (header, footer, page) {
        var curHtml =
            '<a name="tex-page-' + page.number + '"></a>' +
            '<div class="tex-page" data-page="' + page.number + '">' +
                header +
                '<div class="tex-content">' + page.content + '</div>' +
                footer +
            '</div>';

        return curHtml;
    }

    /**
     * Count number of spans inside paragraph or return one if the element is a typeset line.
     */
    obj.getSpanCount = function (elem) {
        if (elem.prop('tagName') == "SPAN" && elem.hasClass('typeset-line')) {
            return 1;
        }
        if (elem.prop('tagName') == "P") {
            return elem.find('> span').length;
        }

        return elem.find('p > span').length;
    }


    return obj;
}(TypeOtter || {}, jQuery));
