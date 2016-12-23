'use strict';

describe('Include preprocess:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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

    describe('Includes:', function () {
        it('Normal', function () {
            expect(1).toEqual(0);
        });
        it('Nested', function () {
            expect(1).toEqual(0);
        });
    });
});
