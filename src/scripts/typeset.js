var splitPercent = 95;

function rec(remain, carry, maxWidth, check, arrPos) {
  if (arrPos >= remain.length) {
    console.log('abort mission!')
    return {
      html: carry,
      carry: null,
      arrPos: null
    }
  }
  
  check.html('');
  if (carry !== null) {
    check.html(carry);
  }
  
  var temp = '', // temporary store for text pieces
      minWidth = 0,
      hyphenPos = 0;
  while(check.width() <= maxWidth && remain[arrPos] != undefined) {
      minWidth = check.width();
      temp = check.html();
      check.append(" " + remain[arrPos++]);
  }

  
  var tempMax = check.width();
  check.html(temp + ' ');
  
  console.log('min --> ' + minWidth);
  console.log('max --> ' + tempMax);
  


  // Check if we should hyphenate.
  if ((minWidth / maxWidth * 100) < splitPercent) {
    console.log('begin hyphen');
    console.log(minWidth + '-->' + tempMax);
    var x = window['Hypher']['languages']['en-us'].hyphenate(remain[arrPos - 1]);
    console.log(x);
    
    
    while(check.width() <= maxWidth && x[hyphenPos] != undefined) {
      temp = check.html();
      check.append(x[hyphenPos++]);
    }

    if (hyphenPos == 1) {
      check.html(temp);
    } else {
      check.html(temp + '&shy;');
    }
    var rem = (x.slice(hyphenPos - 1)).join('');
    //var arr2 = arr;
    return {
      html: check.html(),
      arrPos: arrPos,
      carry: rem
    };
  }
  return {
      html: check.html(),
      arrPos: arrPos,
      carry: remain[arrPos - 1]
  };
}

function typeset(dom) {
  dom.after('<p class="width" style="position: absolute;"><span></span></p>');
  var check = $('.width > span');
  var looper = true,
      fullHtml = '',
      domArr = dom.html().split(" "),
      res = {
        html: domArr,
        arrPos: 0,
        carry: null
      };
  console.log('word count -->'+ domArr.length);
  while(looper) {
    console.log('called --> c:' + res.carry + ' w:' + dom.width() + ' ap:' + res.arrPos);
    res = rec(domArr, res.carry, dom.width(), check, res.arrPos);
    fullHtml += res.html;
    console.log(res);
    //looper++;
    if (res.arrPos == null) { 
      looper = false; 
    }
    
  }
  console.log('Done');
  check.remove();
  dom.html(fullHtml);
}
// https://github.com/bramstein/hypher
// https://github.com/bramstein/hyphenation-patterns