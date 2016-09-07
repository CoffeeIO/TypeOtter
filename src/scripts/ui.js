/**
 * Add UI controls to the dom.
 */
function uiControls(dom) {
    var curHtml = '<div class="tex-ui-controls">';
    // Print button
    curHtml += '<button class="tex-print">Print</button>';

    curHtml += '</div>';
    dom.append(curHtml);

    handlePrint(dom);
}

/**
 * Handle click event for print button.
 */
function handlePrint(dom) {
    dom.find('.tex-print').on('click', function (){
        window.print();
    });
}
