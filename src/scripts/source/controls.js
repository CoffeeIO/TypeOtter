var mlTex = (function(obj, $) {

    /**
     *
     */
    function setZoom(dom, scale) {
        var elem = dom.closest('.tex-controls').parent().find('.tex-document');

        var newZoom = elem.attr('zoom') * scale,
            newZoomScale = 'scale(' + newZoom + ')';

        elem.attr('zoom', newZoom);

        if (elem.css('zoom') !== undefined) { // Check if browser supports zoom
            elem.css('zoom', newZoom);
        } else {
            elem.css('-moz-transform', newZoomScale)
                .css('-o-transform', newZoomScale)
                .css('-webkit-transform', newZoomScale)
                .css('transform', newZoomScale);
        }
    }

    /**
    *
    */
    obj.addControls = function (dom) {
        dom.prepend(
            '<div class="tex-controls">' +
                '<div>' +
                    '<div class="tex-control-zoomin"><i class="fa fa-minus"></i></div>' +
                    '<div class="tex-control-zoomout"><i class="fa fa-plus"></i></div>' +
                    '<div class="tex-control-print"><i class="fa fa-print"></i></div>' +
                '</div>' +
            '</div>' +
            '<div class="tex-hover"></div>'
        );

        $(".tex-hover").mouseenter(function() {
            $('.tex-controls').addClass('show');
        });

        $(".tex-document").mouseenter(function() {
            $('.tex-controls').removeClass('show');
        });

        $('.tex-control-print').click(function () {
            window.print();
        });
        $('.tex-control-zoomin').click(function () {
            setZoom($(this), 0.9); // 10% decrease
        });
        $('.tex-control-zoomout').click(function () {
            setZoom($(this), 1.1); // 10% increase
        });
    };

    return obj;
}(mlTex || {}, jQuery));
