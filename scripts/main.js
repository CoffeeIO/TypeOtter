$(document).ready(function() {
  $('.box').html('testing print');  
  $('<style media="print">.box {color: green;}</style>').appendTo('head');
});
