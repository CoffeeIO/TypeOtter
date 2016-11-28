'use strict';

describe('Text wrap testing:', function () {
    var run = false;
    var elem;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test3']);

            mlTex.wrapper($('.unit-texting'));
            run = true;
            elem = $('.sec1-2');
            done();
        }
    });

    describe('Div wrap:', function () {
        it('Before', function () {
            expect(elem.find('> p:nth-of-type(1)').html().trim()).toEqual('paragraph1');
        });

        it('Middle', function () {
            expect(elem.find('> p:nth-of-type(2)').html().trim()).toEqual('paragraph4');
        });

        it('After', function () {
            expect(elem.find('> p:nth-of-type(3)').html().trim()).toEqual('paragraph6');
        });

        it('Nested', function () {
            expect(elem.find('> div > p:nth-of-type(1)').html().trim()).toEqual('paragraph2');
        });
        it('Simple div with text', function () {
            expect(elem.find('> div:nth-of-type(2) > p').html().trim()).toEqual('paragraph5');
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
