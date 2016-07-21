/**
 * Look for specific attributes in dom and generate elements.
 */
function attrify(dom) {
    handleTitle(dom);
    handleName(dom);
}


function handleTitle(dom) {
    dom.find("*[title!=''][title]").each(function (index) {
        if ($(this).prop('tagName') == 'P') {
            
        } else if ($(this).prop('tagName') == 'SECTION') {
            
        }
        console.log($(this).prop('tagName') + ' --> ' + $(this).attr('title'));
    });
}

function handleName(dom) {
    
}

function handleCaption(dom) {
    
}

function handleImgSize(dom) {
    
}