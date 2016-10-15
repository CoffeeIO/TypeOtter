'use strict';

describe('Main simple test', function () {

    it('should be equal to 3', function () {
        expect(3).toEqual(3);
    });

    $('body').append('<div id="wrapper"><p title="First sec">Test</p></div>');
    // Multiple tests
    it('jQuery dom test', function () {
        expect($('#wrapper > p').length).toEqual(1);
    });

    // Multiple tests
    it('jQuery dom test 2', function () {
        expect($('.unknown').length).toEqual(0);
    });

    it('jQuery dom height test', function () {
        expect($('#wrapper > p').height()).toEqual(16);
    });

    it('jQuery dom height test', function () {
        expect($('#wrapper > p').outerHeight( true )).toEqual(36);
    });

    describe("when retrieved by name", function() {
        beforeEach(function(done) {
            mlTex.run({ selector: '#wrapper'}, function () {
                console.dir('server says: ');
                done();
            });
        });

        it('jQuery dom html', function () {

            var a = { bar: $('html').html() };
            expect(a.bar).not.toBeDefined();

        });
    });


});
