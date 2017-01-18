'use strict';

describe('Controls test:', function () {
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

    describe('Controls added:', function () {
        it('Exists', function () {
            expect($('.tex-controls').length).toEqual(1);
        });
        it('Icon font loaded', function () {
            expect($('.tex-controls .tex-control-zoomin i').css('font-family')).toEqual('FontAwesome');
            expect($('.tex-controls .tex-control-zoomout i').css('font-family')).toEqual('FontAwesome');
            expect($('.tex-controls .tex-control-print i').css('font-family')).toEqual('FontAwesome');
        });
    });

    describe('Controls width:', function () {
        it('Matching width', function () {
            var elem = $('.typeotter');
            expect(elem.find('.tex-controls, .tex-hover').width()).toEqual(elem.parent().width());
        });
    });

    describe('Document zoom:', function () {
        it('Zoom out', function () {
            var zoom = $('.typeotter .tex-document').attr('zoom');
            $('.tex-control-zoomout').trigger('click');
            expect($('.typeotter .tex-document').attr('zoom')).not.toBeLessThan(zoom);
        });
        it('Zoom in', function () {
            var zoom = $('.typeotter .tex-document').attr('zoom');
            $('.tex-control-zoomin').trigger('click');
            expect($('.typeotter .tex-document').attr('zoom')).toBeLessThan(zoom);
        });
    });

    describe('Controls hover:', function () {
        it('Show', function () {
            expect($('.tex-controls').hasClass('show')).toEqual(false);
            $('.tex-hover').trigger('mouseenter');
            expect($('.tex-controls').hasClass('show')).toEqual(true);
        });
        it('Hide', function () {
            expect($('.tex-controls').hasClass('show')).toEqual(true);
            $('.tex-controls').trigger('mouseleave');
            expect($('.tex-controls').hasClass('show')).toEqual(false);
        });
    });
});
