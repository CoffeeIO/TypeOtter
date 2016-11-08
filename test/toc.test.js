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

    describe('Section indexing:', function () {
        it('Section', function () {
            expect($('section[name="sec1"]').attr('data-ref')).toEqual('1');
        });
        it('Sub-section', function () {
            expect($('section[name="sec1.1"]').attr('data-ref')).toEqual('1.1');
        });
        it('Sub-sub-section', function () {
            expect($('section[name="nestedSec"]').attr('data-ref')).toEqual('2.1.1');
        });
        it('sub-section counter reset', function () {
            expect($('section[name="sec2"]').attr('data-ref')).toEqual('2');
        });
    });
});
