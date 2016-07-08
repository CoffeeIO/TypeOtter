var regMarkup = /^[\s\b]*<[\w]+/;
function wrapper(elem) {
  //elem.children(':nth-child(1)').remove();
  if (elem.html() === undefined) return elem;
  //console.log('--> ' + elem.html());
  var html = ''; // returning markup
  var clone = elem.clone();
  if (clone.prop('tagName') == 'P') {
    return elem;
  }
  if (clone.prop('tagName') == 'SCRIPT') {
    return elem;
  }
  // Iterate over all children
  while (clone.children().length > 0) {
    if (regMarkup.test(clone.html()) == false) {
      clone.html('<p>' + clone.html());
      html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
      clone.children(':nth-child(1)').remove();
    }
    var temp = wrapper(clone.children(':nth-child(1)'));
    if (temp.html() !== undefined) html += temp.wrap('<div>').parent().html();
    clone.children(':nth-child(1)').remove();
  }
  if (regMarkup.test(clone.html()) == false) {
    clone.html('<p>' + clone.html());
    html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
    clone.children(':nth-child(1)').remove();
  }
  elem.html(html);
  return elem;
}
$(document).ready(function () {
  console.log('------------------------------------');
  //console.log($('body').html());
  //var finalhtml = wrap($('body'));
  //console.log(wrap($('body')).wrap('<div>').parent().html());
  //console.log($('body').children(':nth-child(1)').html());
  console.log(wrapper($('body')).wrap('<div>').parent().html());
});
