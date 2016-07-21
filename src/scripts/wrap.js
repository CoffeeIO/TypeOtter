var regMarkup = /^[\s\b]*<[\w]+/;
function wrapper(elem) {
  if (elem.html() === undefined) {
    return elem; // ignore special elements without markup: style, script..
  }

  var html = '', // returning markup
      clone = elem.clone();

  // Elements to skip
  var skipElem = ["P", "SCRIPT", "TH", "TD", "LI", "STYLE", "FIGCAPTION"];
  if (skipElem.indexOf(clone.prop('tagName')) !== -1) {
    return elem;
  }

  //Check empty elements
  if (clone.html().trim() === '') {
    return elem;
  }

  // Iterate over all children
  while (clone.children().length > 0) {
    if (regMarkup.test(clone.html()) === false) {
      clone.html('<p>' + clone.html());
      html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
      clone.children(':nth-child(1)').remove();
    }
    var temp = wrapper(clone.children(':nth-child(1)'));
    if (temp.html() !== undefined) {
      html += temp.wrap('<div>').parent().html();
    }
    clone.children(':nth-child(1)').remove();
  }
  // Check for text after last child
  if (clone.html().trim() !== '' && regMarkup.test(clone.html()) === false) {
    clone.html('<p>' + clone.html());
    html += clone.children(':nth-child(1)').clone().wrap('<div>').parent().html();
    clone.children(':nth-child(1)').remove();
  }

  // Overwrite dom html
  elem.html(html);
  return elem;
}
