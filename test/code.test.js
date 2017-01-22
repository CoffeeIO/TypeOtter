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
            expect(1).toEqual(0);
        });
        it('Not found', function () {
            expect(1).toEqual(0);
        });
        it('Multiple of same gist', function () {
            expect(1).toEqual(0);
        });
    });

    describe('Loading gist file:', function () {
        it('Normal', function () {
            expect(1).toEqual(0);
        });
        it('File not found', function () {
            expect(1).toEqual(0);
        });
        it('Gist and file not found', function () {
            expect(1).toEqual(0);
        });
        it('Empty file name', function () {
            expect(1).toEqual(0);
        });
        it('Multiple of same file', function () {
            expect(1).toEqual(0);
        });
    });
    describe('Correct callback', function () {
        it('Normal all loaded', function () {
            expect(1).toEqual(0);
        });
        it('File not found, console error', function () {
            expect(1).toEqual(0);
        });
        it('Gist not found, console error', function () {
            expect(1).toEqual(0);
        });
    });
});
