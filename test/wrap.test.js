'use strict';

describe('Text wrap testing:', function () {
    var run = false;
    var sec1o2,
        sec1o3,
        sec1o4;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test3']);

            mlTex.wrapper($('.unit-texting'));
            run = true;
            sec1o2 = $('.sec1-2');
            sec1o3 = $('.sec1-3');
            sec1o4 = $('.sec1-4');
            done();
        }
    });

    describe('Div wrap:', function () {
        it('Before', function () {
            expect(sec1o2.find('> p:nth-of-type(1)').html().trim()).toEqual('paragraph1');
        });

        it('Middle', function () {
            expect(sec1o2.find('> p:nth-of-type(2)').html().trim()).toEqual('paragraph4');
        });

        it('After', function () {
            expect(sec1o2.find('> p:nth-of-type(3)').html().trim()).toEqual('paragraph6');
        });

        it('Nested', function () {
            expect(sec1o2.find('> div > p:nth-of-type(1)').html().trim()).toEqual('paragraph2');
        });
        it('Simple div with text', function () {
            expect(sec1o2.find('> div:nth-of-type(2) > p').html().trim()).toEqual('paragraph5');
        });
    });

    describe("Don't wrap comment:", function () {
        it('No wraps: before, middle, after', function () {
            expect(sec1o3.find('> p').length).toEqual(0);
        });

        it('Nested', function () {
            expect(sec1o3.find('> div > p').length).toEqual(1); // One hard coded paragraph
        });
        it('Comment removed', function () {
            expect(sec1o3.find('> div > p').html().trim()).toEqual(''); // paragraph only had comment
        });
    });

    describe("Remove comment and wrap text:", function () {
        it('Before', function () {
            expect(sec1o4.find('> p:nth-of-type(1)').html().trim()).toEqual('Before comment');
        });

        it('Middle, multiple comments in line', function () {
            expect(sec1o4.find('> p:nth-of-type(2)').html().trim()).toEqual('Middle comment');
        });

        it('After', function () {
            expect(sec1o4.find('> p:nth-of-type(3)').html().trim()).toEqual('After comment');
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
