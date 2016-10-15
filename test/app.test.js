'use strict';

describe('Main simple test', function () {

    it('should be equal to 3', function () {
        expect(3).toEqual(3);
    });

    $('body').append('<div id="wrapper"><section title="First sec">Test</section></div>');
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


        runs(function() {
            mlTex.run({ selector: '#wrapper'}, function () {
                console.dir('server says: ');
                flag = true;

            });
        }, 500);

        waitsFor(function() {
            return flag;
        }, "Flag should be set", 750);

        runs(function() {
            var a = { bar: $('html').html() };
            expect(a.bar).not.toBeDefined();
        });

    });


});
