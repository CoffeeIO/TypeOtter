function uiControls(dom) {
  dom.append('<div class="tex-ui-controls"><button class="tex-print">Print</button></div>');

  dom.find('.tex-print').on('click', function (){
    window.print();
  });
}
