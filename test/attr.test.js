'use strict';
var dom = '';

describe('Attribute preprocess test: ', function () {
    var run = false;
    $('.unit-texting').remove();

    beforeEach(function(done) {
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

    it('Handle url attribute', function () {
        expect($('.tex-document a[url=""]').html()).toEqual("http://layer0.authentise.com/images/coding.gif");
    });

});
