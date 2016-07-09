$(document).ready(function () {
  console.log('------------------------------------');
  //console.log($('body').html());
  //var finalhtml = wrap($('body'));
  //console.log(wrap($('body')).wrap('<div>').parent().html());
  //console.log($('body').children(':nth-child(1)').html());
  console.log(wrapper($('body')).wrap('<div>').parent().html());
});
