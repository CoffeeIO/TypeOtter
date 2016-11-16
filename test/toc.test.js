'use strict';

describe('TOC test:', function () {
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
        it('Sub-sub-sub-section', function () {
            var selector = ['section[name="Beyond nesting"]', 'a[name="mltex-2.1.1.1"]'];
            var index = '2.1.1.1';
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

    describe('TOC section title:', function () {
        it('Normal title', function () {
            expect($('a[href="#mltex-1"] .left span:nth-of-type(2)').html()).toEqual('Section 1');
        });
        it('Empty title', function () {
            expect($('a[href="#mltex-1.1"] .left span:nth-of-type(2)').html()).toEqual('');
        });
    });

    describe('TOC section index:', function () {
        it('Section', function () {
            expect($('a[href="#mltex-2"] .left span:nth-of-type(1)').html()).toEqual('2');
        });
        it('Sub-Section', function () {
            expect($('a[href="#mltex-1.1"] .left span:nth-of-type(1)').html()).toEqual('1.1');
        });
        it('Sub-sub-Section', function () {
            expect($('a[href="#mltex-2.1.1"] .left span:nth-of-type(1)').html()).toEqual('2.1.1');
        });
        it('Sub-sub-sub-Section', function () {
            expect($('a[href="#mltex-2.1.1.1"] .left span:nth-of-type(1)').html()).toEqual('2.1.1.1');
        });
    });

    describe('TOC page number fill:', function () {
        it('Section', function () {
            expect($('a[href="#mltex-1"] .right span').html()).toEqual($('a[name="mltex-1"]')
                .closest('.tex-page').attr('data-page'));
        });
        it('Sub-Section', function () {
            expect($('a[href="#mltex-2.1"] .right span').html()).toEqual($('a[name="mltex-2.1"]')
                .closest('.tex-page').attr('data-page'));
        });
        it('Sub-sub-Section', function () {
            expect($('a[href="#mltex-2.1.2"] .right span').html()).toEqual($('a[name="mltex-2.1.2"]')
                .closest('.tex-page').attr('data-page'));
        });
        it('Sub-sub-sub-Section', function () {
            expect($('a[href="#mltex-2.1.1.1"] .right span').html()).toEqual($('a[name="mltex-2.1.1.1"]')
                .closest('.tex-page').attr('data-page'));
        });
    });
});
