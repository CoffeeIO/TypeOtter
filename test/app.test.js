'use strict';

describe('Main simple test', function () {
    $('body').append('<div id="wrapper"><section title="First sec">Test</section></div>');
    var run = false;
    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            mlTex.run({ selector: '#wrapper' }, function () {
                run = true;
                done();
            });
        }
    });

    it('jQuery dom html', function () {
        expect($('.page section').attr('data-ref')).toEqual('1');
    });

    it('should be equal to 3', function () {
        expect(3).toEqual(3);
    });

    // Multiple tests
    it('jQuery dom test', function () {
        expect($('#wrapper section').length).toEqual(1);
    });

    it('jQuery dom test 2', function () {
        expect($('.unknown').length).toEqual(0);
    });

    it('jQuery dom height test', function () {
        expect($('#wrapper p').height()).toEqual(17);
    });
    it('jQuery dom height test', function () {
        expect($('#wrapper p').outerHeight( true )).toEqual(37);
    });

});
