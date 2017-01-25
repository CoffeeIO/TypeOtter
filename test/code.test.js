'use strict';

describe('Gist loading:', function () {
    var run = false;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function(done) {
        if (run) {
            done();
        } else {
            $('.unit-texting').remove(); // Remove existing tex documents
            $('body').append(__html__['fixtures/test4']);

            TypeOtter.run({selector: '.unit-texting'}, function () {
                run = true;
                done();
            });
        }
    });

    describe('Loading gist:', function () {
        it('Normal', function () {
            expect($('#gist4 table tr').length).not.toBeLessThan(0);
        });
        it('Multiple of same gist', function () {
            expect($('#gist4 *[data-line-number="1"]').length).toEqual(2); // gist have multiple files / tables
            expect($('#gist5 *[data-line-number="1"]').length).toEqual(2);
        });
        it('Not found', function () {
            expect($('#gist8 table').length).toEqual(0);
        });
    });

    describe('Loading gist file:', function () {
        it('Normal', function () {
            expect($('#gist2 table tr').length).not.toBeLessThan(0);
        });
        it('File not found', function () {
            expect($('#gist7 table').length).toEqual(0);
        });
        it('Empty file name, load all gists', function () {
            expect($('#gist6 *[data-line-number="1"]').length).toEqual(2);
        });
        it('Multiple of same file', function () {
            expect($('#gist1 table tr').length).not.toBeLessThan(0);
            expect($('#gist3 table tr').length).not.toBeLessThan(0);
        });
    });
});
