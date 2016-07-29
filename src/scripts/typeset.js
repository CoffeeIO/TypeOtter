var debug = false;
var splitPercent = 5;

function rec(remain, lineHeight, dom) {
    if (arrPos >= remain.length) {
        if (debug) console.log('abort mission!')
        return {
            html: carry,
            carry: null,
            arrPos: null
        };
    }
  
    dom.html('<span></span>');
    
  
    var temp = '', // temporary store for text pieces
        hyphenPos = 0,
        line = 1,
        arrPos = 0,
        span = dom.find('span'),
        carry = null;
    while(remain[arrPos] != undefined) {
        if (debug) console.log('word  - %s, line - %s, span - ', remain[arrPos], line, span.html());
        if (carry !== null) {
            span.html(carry + ' ');
            carry = null;
        }
        /*if (arrPos == 75) {
            return;
        }*/
        
        temp = span.html();
        if (span.html() == '') span.append(remain[arrPos++]);
        else span.append(" " + remain[arrPos++]);
        
        if (dom.height() > (lineHeight * line)) {
            if (debug) console.log('break');
            span.html(temp + ' ');
            
            var minW = span.width(),
                whitespace = getMaxWidth(dom, span, lineHeight * line),
                maxW = minW + whitespace;
            
            if (debug) console.log('comp mw: %s, dw: %s', minW, dom.width());
            
            if (debug) console.log("min: %s, max: %s, split: %f", minW, maxW, (minW / maxW) * 100);
                        
            // Check if we should hyphenate.
            if ((minW / maxW) * 100 < (100 - splitPercent)) {
                hyphenPos = 0;
                var x = window['Hypher']['languages']['en-us'].hyphenate(remain[arrPos - 1]);
                if (debug) console.log(x);
                while (dom.height() <= (lineHeight * line) && x[hyphenPos] != undefined) {
                    temp = span.html();
                    if (hyphenPos == 0) {
                        span.append(x[hyphenPos++] + '-');
                    } else {
                        span.html(span.html().slice(0, -1));
                        span.append(x[hyphenPos++] + '-');
                    }
                }
                if (hyphenPos == 1) {
                    span.html(temp);
                } else {
                    span.html(temp.slice(0, -1) + '&shy;');
                }
                carry = (x.slice(hyphenPos - 1)).join('');
            } else {
                arrPos--;
                carry = null;
            }
            
            // Clean up for next line
            span.before(span.html());
            span.html('');
            if (debug) console.log('line %i --> %s', line, dom.html());
            if (debug) console.log('cur pos --> ' + arrPos);
            line++;            
        }
    }
    if (debug) console.log('pos %i -> value %s', arrPos, remain[arrPos]);

    if (debug) console.log('dom --> ' + dom.html());

    span.remove();
    dom.html(dom.html());

    return;
}


function typeset(dom) {
  //dom.after('<p class="width" style="position: absolute;"><span></span></p>');
  //var check = $('.width > span');
  var clone = dom.clone();
  var looper = true,
      fullHtml = '',
      domArr = dom.html().replace( /\n/g, " " ).replace( /\s+/g, " " ).split(" "),
      res = {
        html: domArr,
        arrPos: 0,
        carry: null
      };
  if (debug) console.log('word count -->'+ domArr.length);
  if (debug) console.log(domArr);
  
  dom.html('Foo bar');
  if (debug) console.log('height --> ' + dom.height());
  
  res = rec(domArr, dom.height(), dom);
  if (debug) console.log(res);
  
  
  return;

  console.log('Done');
  //check.remove();
  dom.html(fullHtml);
}

function getMaxWidth(dom, span, height) {
    var count = 0;
    if (debug) console.log('--> ' + dom.height() + ' - ' + height);
    while(dom.height() <= height) {
        count++;
        span.css('margin-left', count + 'px');
    }
    span.css('margin-left', '0');
    return (count - 1);
}
// https://github.com/bramstein/hypher
// https://github.com/bramstein/hyphenation-patterns