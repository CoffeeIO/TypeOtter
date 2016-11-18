'use strict';

describe('MathJax processing:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test1']);

            mlTex.run({selector: '.unit-texting'}, function () {
                run = true;
                done();
            });
        }
    });

    describe('Preprocess equation tag:', function () {
        it('Without content', function () {
            expect(1).toEqual(0);
        });
    });

//     describe('Numbering block equations:', function () {
//         it('Without content', function () {
//             expect(1).toEqual('');
//         });
//     });
});
