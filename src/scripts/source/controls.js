var mlTex = (function(obj, $) {

    /**
     * Set zoom level on dom element relative to scale.
     * Instead of checking all posible css properties for a defined value, we store it as an attribute.
     */
    function setZoom(dom, scale) {
        var elem = dom.closest('.mltex').find('.tex-document');

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
     * Update width of UI controls.
     */
    obj.updateControlsWidth = function () {
        $('.mltex').each(function () {
            var elem = $(this),
                width = elem.parent().width();
            elem.find('.tex-controls, .tex-hover').css('width', width);
        });
    };

    /**
     * Add UI controls to the dom.
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

        // Show controls when entering small invisible top element.
        $(".tex-hover").mouseenter(function() {
            $('.tex-controls').addClass('show');
        });

        // Hide controls when leaving the controls.
        $(".tex-controls").mouseleave(function() {
            $('.tex-controls').removeClass('show');
        });

        // Handle print button.
        $('.tex-control-print').click(function () {
            window.print();
        });

        // Handle zoom-in button.
        $('.tex-control-zoomin').click(function () {
            setZoom($(this), 0.9); // 10% decrease
        });

        // Handle zoom-out button.
        $('.tex-control-zoomout').click(function () {
            setZoom($(this), 1.1); // 10% increase
        });
    };

    return obj;
}(mlTex || {}, jQuery));
