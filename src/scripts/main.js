$(window).load(function () {
    console.log('------------------------------------');

    // User specified options, example
    var options = {
        headerRight: 'MGApcDev',
        headerCenter: '<i>by</i>',
        pager : 'Page [cur] of [total]',
        padding: "7mm 10mm"
    }

    attrify($('body'));
    wrapper($('body'));
    texify(options, $('body'));
});

