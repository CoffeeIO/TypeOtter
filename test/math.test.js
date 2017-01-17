// 'use strict';

describe('MathJax processing:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test1']);

            TextOtter.run({selector: '.unit-texting'}, function () {
                run = true;
                done();
            });
        }
    });

    describe('Preprocess equation tag:', function () {
        it('Block equation', function () {
            expect($('.eq1').attr('tex-math-style')).toEqual('block');
            expect($('.eq1').attr('data-math')).toEqual('1');

            expect($('*[name="eq2"]').attr('tex-math-style')).toEqual('block');
            expect($('*[name="eq2"]').attr('data-math')).toEqual('2');
        });
        it('Inline equation', function () {
            expect($('.eq3').attr('tex-math-style')).toEqual('inline');
        });
    });

    describe('Numbering block equations:', function () {
        it('Block equation', function () {
            expect($('.eq1 .tex-math-count').html()).toEqual('1');

            expect($('*[name="eq2"] .tex-math-count').html()).toEqual('2');
        });
        it('Inline equation', function () {
            expect($('.eq3 .tex-math-count').length).toEqual(0);
        });
    });

    describe('MathJax done:', function () {
        it('Equation count', function () {
            expect($('e').length).toEqual($('.MathJax_Preview').length);
        });

        it('Processing finished', function () {
            expect($('.MathJax_Preview').length).toEqual($('.MathJax').length);
            expect($('.MathJax_Processing').length).toEqual(0);
        });
    });
});
