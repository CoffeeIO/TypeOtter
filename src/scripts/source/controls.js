var mlTex = (function(obj, $) {

    /**
     *
     */
    obj.addControls = function (dom) {
        dom.prepend(
            '<div class="tex-controls">' +
                '<div>' +
                    '<div class="zoom-in"><i class="fa fa-minus" aria-hidden="true"></i></div>' +
                    '<div class="zoom-out"><i class="fa fa-plus" aria-hidden="true"></i></div>' +
                    '<div class="print"><i class="fa fa-print" aria-hidden="true"></i></div>' +
                '</div>' +
            '</div>' +
            '<div class="tex-hover"></div>'
        );

        $(".tex-hover")
          .mouseenter(function() {
            $('.tex-controls').addClass('show');
            console.log('enter controls');
          });

        $(".tex-document")
          .mouseenter(function() {
            $('.tex-controls').removeClass('show');
            console.log('enter dom');
          });

        $('.print').click(function () {
            window.print();
        });
    };

    return obj;
}(mlTex || {}, jQuery));
