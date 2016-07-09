var regMarkup = /^[\s\b]*<[\w]+/;
function wrapper(elem) {
  //elem.children(':nth-child(1)').remove();
  if (elem.html() === undefined) return elem;
  //console.log('--> ' + elem.html());
  var html = ''; // returning markup
  var clone = elem.clone();

  // Elements to skip
  var skipElem = ["P", "SCRIPT", "TH", "TD"]
  // Skip <p> and <script>
  if (skipElem.indexOf(clone.prop('tagName')) != '-1') {
    return elem;
  }
  // if (clone.prop('tagName') == 'SCRIPT') {
  //   return elem;
  // }

  //Check empty elements
  if (clone.html().trim() == '') return elem;

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
  // Check text after last child
  if (clone.html().trim() != '' && regMarkup.test(clone.html()) == false) {
    clone.html('<p>' + clone.html());
    html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
    clone.children(':nth-child(1)').remove();
  }
  elem.html(html);
  return elem;
}
