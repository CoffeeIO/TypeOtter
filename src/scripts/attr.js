/**
 * Look for specific attributes in dom and generate elements.
 */
function attrify(dom) {
    handleTitle(dom);
    handleName(dom);
    handleCaption(dom);
    handleImgSize(dom);
}

function handleTitle(dom) {
    dom.find("*[title!=''][title]").each(function (index) {
        if ($(this).prop('tagName') == 'P') {
            $(this).prepend('<span class="para-title">' + $(this).attr('title') + '</span>');
        } else if ($(this).prop('tagName') == 'SECTION') {
            $(this).prepend('<h1 class="section-title">' + $(this).attr('title') + '</h1>');
        }
        console.log($(this).prop('tagName') + ' --> ' + $(this).attr('title'));
    });
}

function handleName(dom) {
    dom.find("*[name!=''][name]").each(function (index) {
    
    });
}

function handleCaption(dom) {
    dom.find("img[caption!=''][caption]").each(function (index) {
    
    });
}

function handleImgSize(dom) {
    dom.find("img[width!=''][width]").each(function (index) {
    
    });
    dom.find("img[height!=''][height]").each(function (index) {
    
    });
}