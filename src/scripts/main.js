$(window).load(function () {
  console.log('------------------------------------');

  // User specified options, example
  var options = {
    headerRight: 'MGApcDev',
    headerCenter: '<i>by</i>',
    pager : 'Page [cur] of [total]'
  }
  texify(options, $('body'));
  /*var page1 = recCheckDom($('.content'), 1000);
  console.log('done, content --> ' + page1.content);
  console.log('done, remain --> ' + page1.remain.clone().wrap('<div>').parent().html());*/
  //texify(options, $('body'));
});

