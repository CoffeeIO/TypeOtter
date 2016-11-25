'use strict';

describe('Ref testing:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test2']);

            mlTex.run({selector: '.unit-texting'}, function () {
                run = true;
                done();
            });
        }
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
            expect($('a[href="#Unknown"]').text()).toEqual('');
        });
    });

});
