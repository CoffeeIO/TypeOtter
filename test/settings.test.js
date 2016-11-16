'use strict';

describe('Settings test:', function () {
    // Copy from /src/scripts/source/settings.js
    var defaultOptions = {
        // Dimensions
        height : '296mm', // Issue: printing makes blank page at the end **reduced height from 297mm**
        width : '210mm',
        padding: "10mm 25mm",
        headerHeight : '6mm',
        footerHeight : '6mm',

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
    }

    it('Overwrite default options', function () {
        var custom = {
            selector: '',
            options: {
                height: '190mm',
                headerCenter: 'Your name',
                footerCenter: '',
                headerRight: '[pager]',
                pager: '[cur]/[total]'
            }
        };
        var newSettings = mlTex.getSettings(custom);

        expect(newSettings.selector).toEqual('body');
        expect(newSettings.biblography).toEqual({});
        expect(newSettings.options.headerCenter).toEqual('Your name');
        expect(newSettings.options.width).toEqual('210mm');
        expect(newSettings.options.footerCenter).toEqual('');
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
        expect(newSettings).toEqual(wrapOptions)
    });

});
