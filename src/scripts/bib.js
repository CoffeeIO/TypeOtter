var refOrderArticle = ["author", "title", "journal", "volume", "number", "month", "year", "editor", "note"];

/**
 * Find and replace cite tags in dom with values from biblography.
 */
function handleCite(dom, bib) {
    var map = []; // Map for how many times the same generated cite name is used
    
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
        
        if (ref['tex-ref-name'] === undefined) {
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
            
            ref['tex-ref-name'] = fullCite;
        }
        
        if (ref['tex-ref-count'] === undefined) {
            ref['tex-ref-count'] = 0;
        }
        ref['tex-ref-count']++;        
        
        elem.html(ref['tex-ref-name']);
    });
    return bib;
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
    if (ref['tex-ref-count'] !== undefined) {
        curHtml += '<span class="tex-book-cite" tex-count="' + ref['tex-ref-count'] + '"></span>';
    }
       
    return curHtml + '</span>';
}

/**
 * Create references page and append to dom.
 */
function makeRefPage(dom, bib) {
    var keys = getMapKeys(bib),
        curHtml = '<div class="tex-ref"><h1 class="tex-ref-title">References</h1><table>';
    
    // Iterate citations used.
    keys.forEach(function (item) {
        curHtml += '<tr class="tex-ref-row" tex-ref-name="' + item + '">';
        curHtml += '<a name="' + item + '"></a>'; // Link for citations
        curHtml += '<td><span class="tex-ref-name">' + bib[item]['tex-ref-name'] + '</span></td>';
        curHtml += '<td>' + genBookRef(bib[item]) + '</td>';
        curHtml += '</tr>';
    });
    
    curHtml += '</table></div>';
    dom.append(curHtml);
}

/**
 * Fill the reference with pages numbers from citations.
 */
function fillCite(dom) {
    // Iterate over rows in reference table.
    dom.find('.tex-ref-row').each(function () {
        var elem = $(this),
            refName = elem.attr('tex-ref-name'),
            pages = []; // Unique pages the reference is used
        
        // Find citations of a specific reference.
        dom.find('a[cite=""][href="#' + refName + '"]').each(function () {
            var inner = $(this),
                pageNum = inner.closest('.page').attr('data-page');
            pages[pageNum] = true;
        });

        var citePages = getMapKeys(pages),
            cite = elem.find('.tex-book-cite'),
            citeHtml = '';
        citePages.forEach(function (item) {
            citeHtml += '<a href="#tex-page-' + item + '">' + item + '</a>, ';
        });
        citeHtml = citeHtml.substr(0, citeHtml.length - 2);
        
        cite.html(citeHtml);
        cite.attr('tex-count', citePages.length);
    });
}
