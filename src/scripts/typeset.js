var splitPercent = 7;

function rec(remain, lineHeight, dom) {
    if (arrPos >= remain.length) {
        console.log('abort mission!')
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
        console.log('word  - %s, line - %s, span - ', remain[arrPos], line, span.html());
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
            console.log('break');
            span.html(temp + ' ');
            
            var minW = span.width(),
                whitespace = getMaxWidth(dom, span, lineHeight * line),
                maxW = minW + whitespace;
            
            console.log('comp mw: %s, dw: %s', minW, dom.width());
            
            console.log("min: %s, max: %s, split: %f", minW, maxW, (minW / maxW) * 100);
                        
            // Check if we should hyphenate.
            if ((minW / maxW) * 100 < (100 - splitPercent)) {
                hyphenPos = 0;
                var x = window['Hypher']['languages']['en-us'].hyphenate(remain[arrPos - 1]);
                console.log(x);
                while (dom.height() <= (lineHeight * line) && x[hyphenPos] != undefined) {
                  temp = span.html();
                  span.append(x[hyphenPos++]);
                }
                if (hyphenPos == 1) {
                  span.html(temp);
                } else {
                  span.html(temp + '&shy;');
                }
                carry = (x.slice(hyphenPos - 1)).join('');
            } else {
                arrPos--;
                carry = null;
            }
            
            // Clean up for next line
            span.before(span.html());
            span.html('');
            console.log('line %i --> %s', line, dom.html());
            console.log('cur pos --> ' + arrPos);
            line++;            
        }
    }
    console.log('pos %i -> value %s', arrPos, remain[arrPos]);

    console.log('dom --> ' + dom.html());

  
    var tempMax = dom.height();
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
  console.log('word count -->'+ domArr.length);
  console.log(domArr);
  
  dom.html('Foo bar');
  console.log('height --> ' + dom.height());
  
  res = rec(domArr, dom.height(), dom);
  console.log(res);
  
  
  return;
  /*
  while(looper) {
    console.log('called --> c:' + res.carry + ' w:' + dom.width() + ' ap:' + res.arrPos);
    res = rec(domArr, res.carry, dom.width(), check, res.arrPos);
    fullHtml += res.html;
    console.log(res);
    //looper++;
    if (res.arrPos == null) { 
      looper = false; 
    }
    
  }*/
  console.log('Done');
  //check.remove();
  dom.html(fullHtml);
}

function getMaxWidth(dom, span, height) {
    var count = 0,
        maxCount = 200;
    console.log('--> ' + dom.height() + ' - ' + height);
    while(dom.height() <= height) {
        count++;
        span.css('margin-left', count + 'px');
        if (count >= maxCount) return null;
    }
    span.css('margin-left', '0');
    return (count - 1);
}
// https://github.com/bramstein/hypher
// https://github.com/bramstein/hyphenation-patterns