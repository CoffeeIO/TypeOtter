function handleCite(dom, bib) {
    var map = [];
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
            console.error('Could not find reference %s', href);
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
        console.log(fullCite);
    });
}

function makeRefPage(dom, cite) {
    
}