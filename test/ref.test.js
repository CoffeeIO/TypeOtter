'use strict';

describe('Reference testing:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test2']);

            TextOtter.run({selector: '.unit-texting'}, function () {
                run = true;
                done();
            });
        }
    });

    describe('Closest tag:', function () {
        it('A inside P', function () {
            expect($('a[href="#invis-ref"]').text()).toEqual('1'); // Section is closest
            expect($('a[href="#invis-ref"]').closest('e').length).toEqual(0);
            expect($('a[href="#invis-ref"]').closest('figure').length).toEqual(0);
            expect($('a[href="#invis-ref"]').closest('section').length).toEqual(1);
        });
    });

    describe('Equations:', function () {
        it('Normal', function () {
            expect($('a[href="#eq2"]').text()).toEqual('2');
        });
    });

    describe('Figures:', function () {
        it('Normal', function () {
            expect($('a[href="#figure1"]').text()).toEqual('1');
        });

    });
    describe('Sections:', function () {
        it('Normal', function () {
            expect($('a[href="#sec2"]').text()).toEqual('2');
        });
        it('Deep section', function () {
            expect($('a[href="#coffeeGoodness"]').text()).toEqual('2.1.2');
        });
    });

    describe('Bad request:', function () {
        it('Unknown reference', function () {
            // Unknown reference, keep inside html.
            expect($('a[href="#Unknown"]').text()).toEqual('Could not find reference');
        });
    });

});
