'use strict';

describe('Attribute preprocess:', function () {
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

    describe('Handle url:', function () {
        it('Without content', function () {
            expect($('#url1').html()).toEqual("http://layer0.authentise.com/images/coding.gif");
            expect($('#url1').attr('target')).toEqual('_blank');
        });
        it('With content', function () {
            expect($('#url2').html()).toEqual("Github link");
            expect($('#url2').attr('target')).toEqual('_blank');
        });
    });

    describe('Handle section title:', function () {
        it('Normal title', function () {
            expect($('section[name="sec1"]').attr('data-title')).toEqual('Section 1');
            expect($('section[name="sec1"] .tex-section-title > span:nth-of-type(2)').html()).toEqual('Section 1');

            expect($('section[name="nestedSec"]').attr('data-title')).toEqual('Deep nesting');
            expect($('section[name="nestedSec"] .tex-section-title > span:nth-of-type(2)').html())
                .toEqual('Deep nesting');
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

    describe('Handle paragraph title:', function () {
        it('Normal title', function () {
            expect($('#paragraph1 > .tex-para-title').html()).toEqual('Para title');
            expect($('#paragraph1').css('text-indent')).toEqual('0px');
        });
        it('Ignore empty title', function () {
            expect($('#paragraph2 > .tex-para-title').length).toEqual(0);
            expect($('#paragraph2').css('text-indent')).not.toEqual('0px');
        });
        it('Don\'t indent first paragraph in section title, regardless of nesting', function () {
            expect($('#paraFIS').css('text-indent')).toEqual('0px');
        });
    });

    describe('Handle newpage attribute:', function () {
        it('Normal newpage', function () {
            // Check that the first section or paragraph on page is itself.
            expect($('section[name="sec1"]').closest('.tex-content').find('section, p').attr('name')).toEqual('sec1');
        });
        it('Nested newpage', function () {
            // Check that the first nestedSec is in the first row of sections on the page is itself.
            expect($('section[name="nestedSec"]').closest('.tex-content').find('section section section').attr('name'))
                .toEqual('nestedSec');
        });
    });

    describe('Handle image numbering:', function () {
        it('Normal image', function () {
            expect($('img[name="figure2"]').closest('figure').attr('data-fig')).toEqual('1');
            expect($('img[name="figure1"]').closest('figure').attr('data-fig')).toEqual('2');
        });
    });

    describe('Handle image size:', function () {
        it('Width Procentage', function () {
            expect($('img[name="figure1"]').attr('style').split(';')[0].trim()).toEqual('width: 50%');
        });
        it('Width fixed length', function () {
            expect($('img[name="figure2"]').attr('style').split(';')[0].trim()).toEqual('width: 8cm');
        });
        it('Height', function () {
            expect($('img[name="figure2"]').attr('style').split(';')[1].trim()).toEqual('height: 150px');
        });
    });

    describe('Handle image captions:', function () {
        it('Normal caption', function () {
            var figure = $('img[name="figure1"]').closest('figure');
            expect(figure.find('figcaption > span:nth-of-type(1)').html().trim())
                .toEqual('Figure ' + figure.attr('data-fig') + ':');
            expect(figure.find('figcaption > span:nth-of-type(2)').html().trim()).toEqual('Sad pug');
        });
        it('Empty caption', function () {
            var figure = $('img[name="figure2"]').closest('figure');
            expect(figure.find('figcaption').length).toEqual(0);
        });
    });

    describe('Handle name attribute:', function () {
        it('Section name', function () {
            expect($('section[name="sec2"] > a:nth-of-type(2)').attr('name')).toEqual('sec2');
        });
        it('Image name', function () {
            expect($('img[name="figure1"]').closest('figure').find('> a').attr('name')).toEqual('figure1');
        });
        it('Paragraph name', function () {
            expect($('p[name="para1"] > a:nth-of-type(1)').attr('name')).toEqual('para1');
        });
    });

    // using html2js fixtures we can't trust this test
    // it('Remove scripts', function () {
    //     expect($('.tex-document script').length).toEqual(0);
    // });
});
