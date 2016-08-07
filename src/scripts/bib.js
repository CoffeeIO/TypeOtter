/**
 * Find and replace cite tags in dom with values from biblography.
 */
function handleCite(dom, bib) {
    var map = [], // Map for how many times the same generated cite name is used
        refMap = []; // Map for used cite and their generated name
    dom.find('a[cite=""]').each(function () {
        var elem = $(this),
            href = elem.attr('href');
        if (href === undefined) {
            console.error('Cite needs "href" attribute: %s', elem.clone().wrap('<span>').parent().html());
            return true;
        } else {
            href = href.substr(1); // Ignore '#'
        }
        var ref = bib[href];
        if (ref === undefined) {
            console.error('Could not find reference: %s', href);
            return true;
        }
        var citeStr = ref.title.substr(0, 3),
            citeSpace = '';
        
        if (map[citeStr] === undefined) {
            map[citeStr] = 1;
        } else {
            map[citeStr]++;
        }
        if (map[citeStr] < 10) {
            citeSpace = '0';
        }
        var fullCite = citeStr + citeSpace + map[citeStr];
        
        elem.html(fullCite);
        refMap[fullCite] = href;
    });
    return refMap;
}

/**
 * Return keys from an associative array.
 */
function getMapKeys(dictionary) {
    var keys = [];
    for (var key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

/**
 * Create references page and append to dom.
 */
function makeRefPage(dom, bib, ref) {
    var keys = getMapKeys(ref),
        curHtml = '<div class="tex-ref"><h1 class="tex-ref-title">References</h1>';
    
    // Iterate citations used.
    keys.forEach(function (item) {
        curHtml += '<div class="tex-ref-row">';
        curHtml += '<a name="' + ref[item] + '"></a>'; // Link for citations
        curHtml += '<span class="tex-ref-name">[' + item + ']</span>';
        curHtml += '<span class="tex-ref-cite">' + bib[ref[item]].title + '</span>';
        curHtml += '</div>';
    });
    
    curHtml += '</div>';
    dom.append(curHtml);
}