'use strict';

describe('Main simple test', function () {

    it('should be equal to 3', function () {
        expect(3).toEqual(3);
    });

    $('body').append('<section title="First section">Test</section>');
    // Multiple tests
    it('jQuery dom test', function () {
        expect($('.box').length).toEqual(1);
    });

    // Multiple tests
    it('jQuery dom test 2', function () {
        expect($('.unknown').length).toEqual(0);
    });

    it('jQuery dom height test', function () {
        expect($('.box').height()).toEqual(16);
    });

    it('jQuery dom height test', function () {
        expect($('.box').outerHeight( true )).toEqual(36);
    });

    it('jQuery dom html', function () {
        mlTex.attrify($('.box'));
        var a = { bar: $('html').html() };

        expect(a.bar).not.toBeDefined();
    });


});
