var refOrderArticle = ["author", "title", "journal", "volume", "number", "month", "year", "editor", "note"];
var refBook = {
        author: "[val].",
        title: "<i>[val]</i>.",
        editor: "Ed. by [val].",
        edition: "[val].",
        volume: "Vol. [val].",
        series: "[val]",
        number: "[val]", // '.' after series or number
        note: "[val].",
        address: "[val]",
        publisher: ": [val]",
        month: "[val]",
        year: "[val]"
    };


/**
 * Find and replace cite tags in dom with values from biblography.
 */
function handleCite(dom, bib) {
    var map = [], // Map for how many times the same generated cite name is used
        refMap = [], // Map for used cite and their generated name
        counter = 1;
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
        elem.attr('name', fullCite + '-' + counter++); // Link back to cite
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

function genBookRef(ref) {
    var curHtml = '<span class="tex-ref-book">';
    var refOrderBook = ["author", "title", "editor", "edition", "volume", "series", "number", "note", "address", "publisher", "month", "year"];

    refOrderBook.forEach(function (item) {
        if (ref[item] !== undefined) {
            curHtml += '<span class="tex-book-' + item + '">' + ref[item] + '</span>';
        }
    });
    curHtml += '<span class="tex-book-cite"></span>';
        
    return curHtml + '</span>';
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
        curHtml += '<span class="tex-ref-name">' + item + '</span>';
        curHtml += genBookRef(bib[ref[item]]);
        curHtml += '</div>';
    });
    
    curHtml += '</div>';
    dom.append(curHtml);
}