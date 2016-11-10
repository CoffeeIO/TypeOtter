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

            mlTex.run({selector: '.unit-texting'}, function () {
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
            var selector = ['section[name="sec1"]', 'a[name="mltex-1"]'];
            var index = '1';
            expect($(selector[0]).attr('data-ref')).toEqual(index);
            expect($(selector[1]).closest('section').attr('data-ref')).toEqual(index);
            expect($(selector[0]).find('.tex-section-title > span:nth-of-type(1)').html()).toEqual(index);
        });
        it('Sub-section', function () {
            var selector = ['section[name="sec1.1"]', 'a[name="mltex-1.1"]'];
            var index = '1.1';
            expect($(selector[0]).attr('data-ref')).toEqual(index);
            expect($(selector[1]).closest('section').attr('data-ref')).toEqual(index);
            expect($(selector[0]).find('.tex-section-title > span:nth-of-type(1)').html()).toEqual(index);
        });
        it('Sub-sub-section', function () {
            var selector = ['section[name="nestedSec"]', 'a[name="mltex-2.1.1"]'];
            var index = '2.1.1';
            expect($(selector[0]).attr('data-ref')).toEqual(index);
            expect($(selector[1]).closest('section').attr('data-ref')).toEqual(index);
            expect($(selector[0]).find('.tex-section-title > span:nth-of-type(1)').html()).toEqual(index);
        });
        it('sub-section counter reset', function () {
            var selector = ['section[name="sec2"]', 'a[name="mltex-2"]'];
            var index = '2';
            expect($(selector[0]).attr('data-ref')).toEqual(index);
            expect($(selector[1]).closest('section').attr('data-ref')).toEqual(index);
            expect($(selector[0]).find('.tex-section-title > span:nth-of-type(1)').html()).toEqual(index);
        });
    });
});
