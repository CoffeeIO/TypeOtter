var mlTex = (function(obj, $) {

    /**
    *
    */
    obj.addControls = function (dom) {
        dom.prepend(
            '<div class="tex-controls">' +
                '<div class="tex-icons">' +
                    '<div class="tex-control-zoomin"><i>&#xf068;</i></div>' +
                    '<div class="tex-control-zoomout"><i>&#xf067;</i></div>' +
                    '<div class="tex-control-print"><i>&#xf02f;</i></div>' +
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
            var elem = $(this);
            var doc = elem.closest('.tex-controls').parent().find('.tex-document');
            doc.css('zoom', doc.css('zoom') * 0.9); // 10% decrease
        });
        $('.tex-control-zoomout').click(function () {
            var elem = $(this);
            var doc = elem.closest('.tex-controls').parent().find('.tex-document');
            doc.css('zoom', doc.css('zoom') * 1.1); // 10% increase
        });
    };

    return obj;
}(mlTex || {}, jQuery));
