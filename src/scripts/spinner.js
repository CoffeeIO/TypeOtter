/**
 * Add spinner after dom element.
 */
function addSpinner(dom) {
  var curHtml = '<div class="overlay tex-spinner"></div>'
              + '<div class="bookshelf_wrapper tex-spinner" style="display:block;">'
                + '<ul class="books_list">'
                  + '<li class="book_item first"></li>'
                  + '<li class="book_item second"></li>'
                  + '<li class="book_item third"></li>'
                  + '<li class="book_item fourth"></li>'
                  + '<li class="book_item fifth"></li>'
                  + '<li class="book_item sixth"></li>'
                + '</ul>'
                + '<div class="shelf"></div>'
              + '</div>';
  dom.after(curHtml);
}

/**
 * Remove spinner from the dom.
 */
function removeSpinner() {
  $('.tex-spinner.bookshelf_wrapper').animate({
    opacity: 0
  }, 500, function () {
    $('.tex-spinner').remove();
  });
}
