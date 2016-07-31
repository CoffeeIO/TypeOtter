function includeFiles(dom) {
  dom.find('include').each(function (index) {
    var elem = $(this);
    if (elem.attr('src') != '') {
      elem.load(elem.attr('src'));
    }
  }); 
}