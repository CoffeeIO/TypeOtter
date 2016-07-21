$(document).ready(function () {
  console.log('------------------------------------');
  var body = wrapper($('body'));
  console.log(body.wrap('<div>').parent().html());

});
