'use strict';

describe('Main simple test', function () {

    it('should be equal to 3', function () {
        expect(3).toEqual(3);
    });
    $('body').append('<div class="box">test</div>');
    // Multiple tests
    it('jQuery dom test', function () {
        expect($('.box').length).toEqual(1);
    });

    // Multiple tests
    it('jQuery dom test 2', function () {
        expect($('.unknown').length).toEqual(0);
    });

    it('jQuery dom height test', function () {
        expect($('.box').height()).toEqual(17);
    });

    it('jQuery dom height test', function () {
        expect($('.box').outerHeight( true )).toEqual(17);
    });
});
