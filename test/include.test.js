'use strict';

describe('Include preprocess:', function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    describe('Normal:', function () {
        var run = false;
        beforeEach(function(done) {
            if (run) {
                done();
            } else {
                $('.unit-texting').remove(); // Remove existing tex documents
                $('body').append(__html__['fixtures/include/index']);

                mlTex.run({selector: '.unit-texting'}, function () {
                    run = true;
                    done();
                });
            }
        });

        it('Check chapters exist', function () {
            expect($('section[data-title="Introduction"]').length).not.toBeLessThan(1);
            expect($('section[data-title="Background"]').length).not.toBeLessThan(1);
            expect($('section[data-title="Analysis"]').length).not.toBeLessThan(1);
            expect($('section[data-title="Conclusion"]').length).not.toBeLessThan(1);
        });
        it('Check nested chapters', function () {
            expect($('section[data-title="Data gathering"]').length).not.toBeLessThan(1);
            expect($('section[data-title="Data analysis"]').length).not.toBeLessThan(1);
        });
    });

    describe('Recursive include:', function () {
        beforeEach(function(done) {
            spyOn(console, 'error');

            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/include/index2']);

            mlTex.run({selector: '.unit-texting'}, function () {
                done();
            });
        });

        it('Check only one instance of chapter', function () {
            expect($('section[data-title="Analysis"] > a > .tex-section-title').length).toEqual(1);
        });
        it('Error thrown', function () {
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringMatching(/recursive include/), jasmine.stringMatching(/.*/)
            );
        });
    });

    describe('File not found:', function () {
        beforeEach(function(done) {
            spyOn(console, 'error');

            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/include/index3']);

            mlTex.run({selector: '.unit-texting'}, function () {
                done();
            });
        });

        it('Error thrown', function () {
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringMatching(/not found/), jasmine.stringMatching(/.*/)
            );
        });
    });
});
