function makeRef(dom) {
    dom.find('a[ref=""]').each(function (){
        var elem = $(this),
            href = elem.attr('href');
        if (href === undefined) {
            console.error('Reference needs "href" attribute: %s', elem.clone().wrap('<span>').parent().html());
            return true;
        }
        var ref = dom.find('a[name="' + href.substr(1) + '"]').first();
        if (ref.closest('figure').length !== 0) {
            elem.html(ref.closest('figure').attr('data-fig'));
        } else if (ref.closest('section').length !== 0) {
            elem.html(ref.closest('section').attr('data-ref'));
        } else {
            console.error('Unknown reference: %s', elem.attr('href'));
        }
    });
}