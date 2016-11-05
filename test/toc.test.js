'use strict';

describe('TOC testing:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test2']);

            mlTex.run({ selector: '.unit-texting' }, function () {
                run = true;
                done();
            });
        }
    });
    describe('Handle title:', function () {
        it('Normal title', function () {
            expect($('.toc1 .toc-title').text()).toEqual('Table of contents');
        });

        it('Empty title', function () {
            expect($('.toc2 .toc-title').text()).toEqual('Contents');
        });
    });
});
