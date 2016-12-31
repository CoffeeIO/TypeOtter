'use strict';

describe('Settings test:', function () {
    beforeEach(function() {
        spyOn(console, 'error');
    });

    // Copy from /src/scripts/source/settings.js
    var defaultOptions = {
        // Dimensions
        height : '296mm', // Issue: printing makes blank page at the end **reduced height from 297mm**
        width : '210mm',
        padding: "10mm 25mm",
        headerHeight : '8mm',
        footerHeight : '8mm',

        // Header
        headerRight : '',
        headerCenter : '',
        headerLeft : '',

        // Footer
        footerRight : '',
        footerCenter : '[pager]',
        footerLeft : '',

        // Pager
        pager : '[cur]',
        pagerStyle : '1'
    };
    var wrapOptions = {
        selector: 'body',
        options: defaultOptions,
        biblography: {}
    };

    it('Overwrite default options', function () {
        var custom = {
            selector: '.unit-texting',
            options: {
                height: '190mm',
                headerCenter: 'Your name',
                footerCenter: '',
                headerRight: '[pager]',
                pager: '[cur]/[total]',
            },
            biblography: {
                'book1': {
                    author: "Michel Goossens and Frank Mittelbach and Alexander Samarin",
                    title: "The LaTeX Companion",
                    year: "1993",
                },
            },
        };
        var newSettings = mlTex.getSettings(custom);

        expect(newSettings.selector).toEqual('.unit-texting');
        expect(newSettings.biblography.book1.title).toEqual('The LaTeX Companion');
        expect(newSettings.options.headerCenter).toEqual('Your name'); // Overwrite
        expect(newSettings.options.width).toEqual('210mm'); // No overwrite use default
        expect(newSettings.options.footerCenter).toEqual(''); // Overwrite with empty
    });

    it('Missing selector', function () {
        var custom = {
            selector: '.unknown-selector',
        };

        var newSettings = mlTex.getSettings(custom);
        expect(console.error).toHaveBeenCalled(); // Selector doesn't exist, should throw error
        expect(newSettings).toEqual(null);
    });

    it('Empty settings', function () {
        var newSettings = mlTex.getSettings({});
        expect(newSettings).toEqual(wrapOptions);
    });

    it('Unknown settings', function () {
        var custom = {
            selector: 'body',
            options: {
                unknownOption: 'unknown',
                headerCenter: 'Your name'
            },
            newOption: 'Custom option'
        };
        var newSettings = mlTex.getSettings(custom);
        expect(newSettings.newOption).toEqual('Custom option');
        expect(newSettings.options.unknownOption).toEqual('unknown');
        expect(newSettings.options.headerCenter).toEqual('Your name');
    });

    it('Null settings', function () {
        var newSettings = mlTex.getSettings(null);
        expect(newSettings).toEqual(wrapOptions);
    });
});
