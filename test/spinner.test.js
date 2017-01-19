'use strict';

describe('Spinner testing:', function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    describe('Done processing:', function () {
        var run = false;
        beforeEach(function(done) {
            if (run) {
                done();
            } else {
                $('.unit-texting').remove(); // Remove existing tex documents
                $('body').append(__html__['fixtures/test2']);

                TextOtter.run({selector: '.unit-texting'}, function () {
                    run = true;
                    setTimeout(function(){
                        done();
                    }, 500); // Wait for spinner fadeout to end
                });
            }
        });
        it('Spinner removed', function () {
            expect($('.tex-spinner').length).toEqual(0);
        });
    });

    describe('Test while processing:', function () {
        var run = false,
            continueExecution = false;
        beforeEach(function(done) {
            if (run) {
                var timer = setInterval(function () { // Block until window is loaded
                    if (continueExecution === true) {
                        done();
                        clearInterval(timer);
                    }
                }, 200);
            } else {
                $('.unit-texting').remove(); // Remove existing tex documents
                $('body').append(__html__['fixtures/test2']);

                TextOtter.run({selector: '.unit-texting', options: {spinner: false}}, function () {
                    continueExecution = true;
                }); // Hide spinner option
                run = true;
                setTimeout(function(){
                    done();
                }, 500); // Wait to some time so we're in the middle of processing
            }
        });
        it('No spinner while processing', function () {
            expect($('.tex-spinner').length).toEqual(0);
        });
        it('Block execution until last call is finished', function () {
            expect(0).toEqual(0);
        });
    });

    describe('Test while processing:', function () {
        var run = false,
            continueExecution = false;
        beforeEach(function(done) {
            if (run) {
                var timer = setInterval(function () { // Block until window is loaded
                    if (continueExecution === true) {
                        done();
                        clearInterval(timer);
                    }
                }, 200);
            } else {
                $('.unit-texting').remove(); // Remove existing tex documents
                $('body').append(__html__['fixtures/test2']);

                TextOtter.run({selector: '.unit-texting'}, function () {
                    continueExecution = true;
                });
                run = true;
                setTimeout(function(){
                    done();
                }, 500); // Wait to some time so we're in the middle of processing
            }
        });
        it('Spinner while processing', function () {
            expect($('.tex-spinner').length).toEqual(2); // tex-spinner is two elements
        });
        it('Block execution until last call is finished', function () {
            expect(0).toEqual(0);
        });
    });
});
