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

        });
        $('.tex-control-zoomout').click(function () {
            
        });
    };

    return obj;
}(mlTex || {}, jQuery));
