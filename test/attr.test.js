'use strict';
var dom = '';

describe('Attribute preprocess:', function () {
    var run = false;
    $('.unit-texting').remove(); // Remove existing tex documents

    beforeEach(function(done) {
        jasmine.DEFUALT_TIMEOUT_INTERVAL = 10000;
        if (run) {
            done();
        } else {
            $('body').append(__html__['fixtures/test1']);

            mlTex.run({ selector: '.unit-texting' }, function () {
                run = true;
                done();
            });
        }
    });
    describe('Handle url:', function () {
        it('Without content:', function () {
            expect($('#url1').html()).toEqual("http://layer0.authentise.com/images/coding.gif");
            expect($('#url1').attr('target')).toEqual('_blank');
        });
        it('With content:', function () {
            expect($('#url2').html()).toEqual("Github link");
            expect($('#url2').attr('target')).toEqual('_blank');
        });
    });

    describe('Handle section title:', function () {
        it('Normal title', function () {
            expect($('section[name="sec1"]').attr('data-title')).toEqual('Section 1');
            expect($('section[name="sec1"] .tex-section-title > span:nth-of-type(2)').html()).toEqual('Section 1');

            expect($('section[name="nestedSec"]').attr('data-title')).toEqual('Deep nesting');
            expect($('section[name="nestedSec"] .tex-section-title > span:nth-of-type(2)').html()).toEqual('Deep nesting');
        });

        it('Undefined title', function () {
            expect($('section[name="sec1.1"]').attr('data-title')).toEqual('');
            expect($('section[name="sec1.1"] .tex-section-title > span:nth-of-type(2)').html()).toEqual('');
        });

        it('Empty title', function () {
            expect($('section[name="sec2"]').attr('data-title')).toEqual('');
            expect($('section[name="sec2"] .tex-section-title > span:nth-of-type(2)').html()).toEqual('');
        });
    });
    
});
