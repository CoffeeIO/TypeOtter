$(window).load(function () {
  console.log('------------------------------------');

  // User specified options, example
  var options = {
    headerRight: 'MGApcDev',
    headerCenter: '<i>by</i>',
    pager : 'Page [cur] of [total]'
  }

  texify(options, $('body'));
});

