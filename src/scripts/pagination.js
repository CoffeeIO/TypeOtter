var TypeOtter = (function(obj, $) {

    /**
     * Add element to testdom and compare with maxheight, return new testdom if less, otherwise
     * revert to previous state.
     */
    function addToPage(element, testdom, totalHeight, pointer) {
        var temp = pointer.html();
        pointer.append(element.clone().wrap('<div>').parent().html());
        if (testdom.outerHeight(true) <= totalHeight) {
            spanCount += TypeOtter.getSpanCount(element);

            if (testdom.height() !== 0) { // Only count added element if element has a height
                elemsOnPage++;
            }
            return true;
        }

        pointer.html(temp); // Revert to before the element was added

        return false;
    }

    /**
     * Force an element to be added to the dom, even if doesn't fit.
     */
    function forceAddElem(elem, testdom, pointer, suppressWarning = false) {
        pointer.append(elem.clone().wrap('<div>').parent().html());
        if (testdom.height() !== 0) { // Only count added element if element has a height
            if (! suppressWarning) {
                console.warn('Careful elements on page %s might exceed the height of the page', curPage);
            }
            elemsOnPage++;
        }
        spanCount += TypeOtter.getSpanCount(elem);
        elem.remove();

        return {
            content: testdom,
            remain: null,
            done: false
        };
    }

    var imageShiftCount = 0;


    /**
     * Add as many images to the dom while staying within dimentions of the page.
     */
    function addQueueElem(dom, testdom, totalHeight, imageDom) {
        imageShiftCount = 0;

        console.log('Logging imgQueue');
        console.log(imgQueue);
        testdom.append('<div class="tex-image-move"></div>');
        var pointer = testdom.find('.tex-image-move');
        var tempQueue = [].concat(imgQueue);
        for (var i = 0; i < tempQueue.length; i++) {
            var item = tempQueue[i];
            imageDom.html(item.html);
            var imageDomPointer = imageDom.find(':last-child');
            var obj = addToPage(imageDomPointer, testdom, totalHeight, pointer);
            if (obj === null) {
                return null;
            } else {
                // console.log(testdom.html());
                // imgQueue.shift(); // Successfully added, remove element from queue
                imageShiftCount++;
            }
        }
    }

    // object: { html, originPage, height }
    var imgQueue = [];

    // State of whether to add all images encountered in dom to the imageQueue.
    var forceImage = false;

    // Count of span elements followed by section title.
    var spanCount = 0;
    var workingOnTitle = false;

    var titleSnapshot = {dom: '', testdom: ''};
    var allowSnapshot = true;


    function checkTitleSnapshot(dom, testDom) {
        if (dom.pointer.prop('tagName') == "A" && dom.pointer.attr('href') == "#tex-toc") {
            if (spanCount >= 2) {
                allowSnapshot = true;
            }
            if (allowSnapshot) {
                titleSnapshot.testdom = testDom.elem.html();
                titleSnapshot.dom = dom.elem.html();
                allowSnapshot = false;
            }
            spanCount = 0;
        }
    }

    var skipConditions = false, // Skip special conditions, so we start iterating on the children
        defaultDone = true; // Default value to return when having added all children

    function forceAddImage(dom, imageDom) {
        if (forceImage) {
            if (dom.pointer.prop('tagName') == "FIGURE") {
                forceAddElem(dom.pointer, imageDom.elem, imageDom.pointer, true);
                imgQueue.push({
                    html: imageDom.elem.html(),
                    origin: 0,
                    height: imageDom.elem.height(),
                });
                imageDom.pointer.html(''); // Remove element from pointer
                return true;
            } else if (dom.pointer.find('figure').length > 0) {
                // Check all children
                skipConditions = true;
                defaultDone = false;
            }
        }
        return false;
    }

    function isNewPage(dom) {
        if (dom.pointer.hasClass('tex-newpage')) {
            dom.pointer.remove();
            return true;
        }

        return false;
    }

    function forceElementOnEmptyPage(dom, testDom) {
        if (dom.pointer.children().length === 0) {
            if (elemsOnPage === 0) {
                forceAddElem(dom.pointer, testDom.elem, testDom.pointer);
            }
            return true;
        }

        return false;
    }

    function moveImageToQueue(dom, imageDom) {
        if (dom.pointer.prop('tagName') == "FIGURE") {
            forceImage = true;
            forceAddElem(dom.pointer, imageDom.elem, imageDom.pointer, true);
            imgQueue.push({
                html: imageDom.elem.html(),
                origin: 0,
                height: imageDom.elem.height()
            });
            imageDom.pointer.html(''); // Remove element from pointer
            return true;
        }

        return false;
    }

    function canSplitElem(dom, testDom) {
        // Elements that should not be recusively checked for children
        var skipElem = ["SPAN", "SCRIPT", "TR", "STYLE", "FIGURE", "IMG"];

        if (skipElem.indexOf(dom.pointer.prop('tagName')) !== -1) {
            if (elemsOnPage === 0) { // Force add element if no other element on page
                forceAddElem(dom.pointer, testDom.elem, testDom.pointer);
            }
            return true;
        }

        return false;
    }


    /**
     * Recursive check the specified element's children and add elements until the
     * maxheight is achieved or there's no more elements.
     *
     * @param  {object}        dom         elem        The main element
     *                                     pointer     The element to remove from
     * @param  {object}        testDom     elem        The main element
     *                                     pointer     The element to append on
     * @param  {int}           totalHeight Max height of the content area of a page
     * @param  {object}        imageDom    elem        The main element
     *                                     pointer     The element to append on
     * @return {object}        content     The testdom,
     *                         remain      The remaining DOM of elem,
     *                         done        State of whether more elements can be added to testdom
     */
    function recCheckDom(dom, testDom, totalHeight, imageDom) {
        skipConditions = false; // Skip special conditions, so we start iterating on the children
        defaultDone = true; // Default value to return when having added all children

        if (forceAddImage(dom, imageDom)) {
            return {done: false}; // We added the figure to the imageQueue, but we're not done
        }

        // Check if we encountered a title and snapshot doms if we are allowed.
        checkTitleSnapshot(dom, testDom);

        if (! skipConditions) {
            // Check if entire element can be added to the page.
            if (addToPage(dom.pointer, testDom.elem, totalHeight, testDom.pointer)) { // Element fit
                dom.pointer.remove();
                // dom.pointer.html('');
                return {
                    content: testDom.elem,
                    remain: null,
                    done: false
                };
            }

            // Remove newpage element and return null to end page.
            if (isNewPage(dom)) {
                return null;
            }

            // Force add element if no other element on page
            if (forceElementOnEmptyPage(dom, testDom)) {
                return null;
            }

            // We know the image couldn't fit, therefore we add image to queue and all following images will also be added.
            if (moveImageToQueue(dom, imageDom)) {
                return {done: false};
            }

            // Check if we're working on an element that can't be split up.
            if (canSplitElem(dom, testDom)) {
                return null;
            }

        }

        // Inner wrap elements and move their pointer.
        testDom.pointer = movePointer(dom, testDom.pointer);
        imageDom.pointer = movePointer(dom, imageDom.pointer);

        // Loop over dom children and add as many as possible.
        loopOverChildren(dom, testDom, totalHeight, imageDom);

        // Remove pointer elements if empty.
        removeWrapperIfEmpty(dom, testDom, imageDom);

        return {
            content: testDom.elem,
            remain: dom.pointer,
            done: defaultDone
        };
    }

    function removeWrapperIfEmpty(dom, testDom, imageDom) {
        if (testDom.pointer.children().length === 0) { // Remove wrapper if no elements were added to it
            testDom.pointer.remove();
            imageDom.pointer.remove();
        }
        if (dom.pointer.children().length === 0) { // Remove element if no longer has any children
            dom.pointer.remove();
        }

    }

    function loopOverChildren(dom, testDom, totalHeight, imageDom) {
        while (dom.pointer.children().length > 0) {
            var childElem = dom.pointer.children(':nth-child(1)');
            obj = recCheckDom({elem: dom.elem, pointer: childElem}, {elem: testDom.elem, pointer: testDom.pointer}, totalHeight, imageDom);
            if (obj === null) {
                break; // Couldn't add element, exit loop
            } else {
                // If done is true, then not all children were added so we can't remove the parent element
                if (obj.done === true) {
                    break;
                }

                childElem.remove();
            }
        }
    }

    function movePointer(dom, pointer) {
        var wrapper = dom.pointer.clone().empty(),
            innerWrap = wrapper.wrap('<div>').parent().html();
        pointer.append(innerWrap);
        return pointer.children(':last-child'); // Move pointer to wrap element
    }

    var bestfit = Infinity;
    var bestdom = null;

    /**
     * Construct the content of one page.
     */
    function makePage(basePage, dom, testdom, imageDom) {
        bestfit = Infinity;
        bestdom = null;
        forceImage = false; // Reset image adding
        elemsOnPage = 0; // Reset element counter
        allowSnapshot = true;
        imageDom.html('');

        var totalHeight = basePage.page.height;

        addQueueElem(dom, testdom, totalHeight, imageDom);
        imageDom.html('');
        var objDom = {elem: dom, pointer: dom};
        var objTestdom = {elem: testdom, pointer: testdom};
        var objImagedom = {elem: imageDom, pointer: imageDom};

        var objFinal = {content: '', remain: ''};
        // 0, 1, 2
        // for (var i = 0; i <= imageShiftCount; i++) {
        console.log('Before');
        console.log(objDom.elem.html().length);
            var obj = recCheckDom(objDom, objTestdom, totalHeight, objImagedom);
            objFinal.content = objTestdom.elem.html();
            objFinal.remain = objDom.elem.html();
            console.log('After');

            console.log(objDom.elem.html().length);


            if (spanCount < 2) {
                dom.html(titleSnapshot.dom);
                obj.content.html(titleSnapshot.testdom);
                objFinal.remain = titleSnapshot.dom;
                objFinal.content = (titleSnapshot.testdom);
            }

            // var remainHeight = totalHeight - testdom.height(),
            //     heightDemerit = remainHeight * 5,
            //     imageDemerit = i * 50;
            // var demerit = heightDemerit;
            // console.log('shift --> %s, remain --> %s', i, remainHeight);
            //
            // if (demerit < bestfit) {
            //     bestfit = demerit;
            //     bestdom = {testdom: testdom.html(), dom: dom.html(), shift: i};
            // }
            // objTestdom.elem.find('.tex-image-move > :last-child').remove();
        // }

        // dom.html(bestdom.dom);
        // obj.content.html(bestdom.testdom);

        if (obj.remain == null || objFinal.remain != obj.remain.html()) {
            console.log('Unmatch');
            console.log(objFinal.remain);
            console.log(objDom.pointer.html());
            if (obj.remain == null) {
                console.log('null');
            } else {
                console.log(obj.remain.html());

            }
        }

        // imgQueue = imgQueue.slice(bestdom.shift);
        imgQueue = imgQueue.slice(imageShiftCount);


        // basePage.content = obj.content.html();
        basePage.content = objFinal.content;
        console.log('Page --> %s', spanCount);
        spanCount = 100; // Set this high, so a page with a single line, but no title is allowed

        return {
            "page": basePage,
            "remain": obj.remain
            // "remain": objFinal.remain
        };
    }

    var elemsOnPage,
        curPage;

    /**
     * Convert a dom element to a series of printable pages.
     */
    obj.texify = function(settings, dom) {
        var options = settings.options;
        dom.find('.tex-testdom').remove(); // Remove testing element we used to force font load
        var basePage = new TypeOtter.Page();

        dom.wrapInner('<div>');

        // Add styling to get rendering dimensions
        TypeOtter.loadStyleSettings(options);

        var pages = [],
            fullHtml = '',
            clone = dom.find('> div').first().clone(),
            obj = null;
        curPage = 1;

        // Create empty tex-document for testing rendering dimensions.
        dom.append(
            '<div class="tex-document">' +
                '<div class="tex-page" style="height: auto">' +
                    '<div class="tex-content tex-testdom"></div>' +
                '</div>' +
            '</div>'
        );
        var testdom = dom.find('.tex-testdom');

        // Create empty tex-document for testing image contruction.
        dom.append(
            '<div class="tex-document">' +
                '<div class="tex-page" style="height: auto">' +
                    '<div class="tex-content tex-image-dom"></div>' +
                '</div>' +
            '</div>'
        );
        var imageDom = dom.find('.tex-image-dom');

        // Detect rendered size.
        basePage.page.height = testdom.height();

        testdom.css('height', 'auto'); // Set height auto, so content area adjust in size depending on content
        imageDom.css('height', 'auto');

        // Typeset text.
        testdom.html(clone.html());
        TypesetBot.run('.tex-testdom', { dynamicWidth: false }, function () {
            testdom.find('.typeset-hidden').remove();
            clone.html(testdom.html());

            // Check there is still remaining html in the body.
            while (clone.html().trim() !== '') {
                testdom.html(''); // Clear the testdom object
                imageDom.html(''); // Clear the imagedom object

                // Use extend to clone pageSetting obj and remove its reference.
                pages.push(makePage($.extend(true, [], basePage), clone, testdom, imageDom));

                obj = pages[pages.length - 1];

                basePage.number = ++curPage;

                if (obj.remain != null) {
                    clone.html(obj.remain.html());
                    // clone.html(obj.remain);
                } else {
                    clone.html('');
                }
            }

            // Assemble the pages
            pages.forEach(function (item, index) {
                item.page.total = pages.length;
                var header = TypeOtter.genHeader(options, item.page),
                    footer = TypeOtter.genFooter(options, item.page),
                    page   = TypeOtter.genPage(header, footer, item.page);

                fullHtml += page;
            });

            testdom.parent().remove(); // Remove the test element
            imageDom.parent().remove(); // Remove the image element

            // Wrap document in div, to apply relative styling.
            fullHtml = '<div class="tex-document" zoom="1">' + fullHtml + '</div>';

            // Overwite the body
            dom.html(fullHtml);
        });
    };

    return obj;
}(TypeOtter || {}, jQuery));
