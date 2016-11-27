'use strict';

describe('Text wrap testing:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test3']);

            mlTex.wrapper($('.unit-texting'));
            run = true;
            done();
        }
    });

    describe('Div wrap:', function () {
        it('Before', function () {
            expect($('.sec1-2 > p:nth-of-type(1)').html().trim()).toEqual('paragraph1');
        });

        it('Middle', function () {
            expect($('.sec1-2 > p:nth-of-type(2)').html().trim()).toEqual('paragraph4');
        });

        it('After', function () {
            expect($('.sec1-2 > p:nth-of-type(3)').html().trim()).toEqual('paragraph6');
        });

        it('Nested', function () {
            expect($('.sec1-2 > div > p:nth-of-type(1)').html().trim()).toEqual('paragraph2');
        });
    });

    describe('Wrap elements:', function () {
        it("Don't wrap table header", function () {
            expect($('.table th').length).not.toEqual(0);
            expect($('.table th p').length).toEqual(0);
        });

        it("Don't wrap table data", function () {
            expect($('.table td').length).not.toEqual(0);
            expect($('.table td p').length).toEqual(0);
        });
    });
});
