//var todo = document.registerElement('to-do', {
//  prototype: Object.create(HTMLButtonElement.prototype),
//  extends: 'div'
//});
//




$(document).ready(function() {
  //$('.box').html('testing print');  
  //$('<style media="print">.box {color: green;}</style>').appendTo('head');
  $('todo').css('margin-left', '10px');
  var c = $('todo').html();
  $('todo').html('<p>' + c + '</p>')
  
  
  $('img').each(function() {
    var cap = $(this).attr('caption');
    if (cap != undefined)
      $(this).after('<p class="caption">' + cap + '</p>')
  });
});
