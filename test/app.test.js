'use strict';

describe('Main simple test', function () {

    it('should be equal to 3', function () {
        expect(3).toEqual(3);
    });

    // Multiple tests
    it('jQuery dom test', function () {
        expect($('.box').length).toEqual(1);
    });

    // Multiple tests
    it('jQuery dom test 2', function () {
        expect($('.unknown').length).toEqual(0);
    });

});
