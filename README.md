# mlTex
[![Build Status](https://travis-ci.org/MGApcDev/mlTex.svg?branch=travis)](https://travis-ci.org/MGApcDev/mlTex)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c098136ef81345b78c480ee695314a21)](https://www.codacy.com/app/mgapcdev/mlTex?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=MGApcDev/mlTex&amp;utm_campaign=Badge_Grade)

mlTex is a Javascript library to render high quality typesetting in html and pdf.

This library is intended as an improvement on LaTex, allowing users to write professional documents in markup.

## Setup
#### Pre release:

Get the code

    ``git clone https://github.com/MGApcDev/mlTex.git your-project``

Go into the folder

    ``cd  your-project``

Make an index.html file using your favorite editor (<i>use this template for full documents</i>)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/src/styles/build/main.min.css">
    <script type="text/javascript" src="/src/scripts/build/main.min.js"></script>
    <script type="text/javascript" src="/dependencies/MathJax/MathJax.js"></script>
    <script>
        mlTex.run();
    </script>
    <!-- add scripts that should not be removed by mlTex here -->
</head>
<body>
    <!-- your document -->
</body>
</html>
```

Start a local server (to make sure all features work as intended)

- Mac and Linux users

    Run ``python -m SimpleHTTPServer`` and go to localhost:8000 in your browser 

- Windows users (2 options)
    
    Install the [Backets editor](http://brackets.io/) and user it's one click live preview to start a server

    <i>or</i>

    Install the [Bash on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide) and run the same command as linux users ``python -m SimpleHTTPServer`` and go to localhost:8000 in your browser

## Developers
Install node modules (make sure you have [nodejs](https://nodejs.org/en/) installed)

    ``npm install`` (use ``sudo npm install`` if it doesn't work)

Recompile js and scss files
    
    ``gulp``

## Contributions
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :smile:

## Typesetting
- Font Kerning

## Features
- Table of contents
- Latex equivalent font
- Images and captions, w/ auto-numbering
- Including html files into html files
- Tables
- Page setup w/ size, header, footer, page numbering
- Sections, w/ auto-numbering
- Links to websites and page locations

## Sources
- [Basic Rules of Good Typography](http://www.troytempleman.com/2010/02/08/basic-rules-of-good-typography/)

## Dependencies
- **jQuery** --> [jQuery write less, do more](https://jquery.com/)
- **Font** --> [Computer Modern on the web by CheckMyWorking.com](http://checkmyworking.com/cm-web-fonts/)
- **Math** --> [MathJax, Beautiful math in all browsers](https://www.mathjax.org/)
- **Spinner** --> [#Codevember - Day 6 - Bookshelf loader by Grélard Antoine](http://codepen.io/ikoshowa/pen/qOMvpy)

## Special Thanks
- [Frederik Madsen](https://www.linkedin.com/in/frederikmadsen/da) for inspiration and help with some of the code

---

Copyright &copy; 2016 Mathias Grundtvig Andreasen (MGApcDev). Licensed under the terms of the [GPLv3 license](LICENSE.md).
