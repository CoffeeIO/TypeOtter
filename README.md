# [mlTex](http://mgapcdev.github.io/mlTex/) [![Build Status](https://travis-ci.org/MGApcDev/mlTex.svg?branch=master)](https://travis-ci.org/MGApcDev/mlTex) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/c098136ef81345b78c480ee695314a21)](https://www.codacy.com/app/mgapcdev/mlTex?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=MGApcDev/mlTex&amp;utm_campaign=Badge_Grade) [![Stories in Ready](https://badge.waffle.io/MGApcDev/mlTex.png?label=ready&title=Ready)](http://waffle.io/MGApcDev/mlTex)

mlTex is a Javascript library to render high quality typesetting in html and pdf.

This library is intended as an improvement on LaTex, allowing users to write professional documents in markup.

## Setup and Syntax
--> [CodePen Showcase: Setup, syntax, math, typesetting, support](http://codepen.io/MGApcDev/full/RKbxom/)

Start a local server (to make sure all features work as intended)

- Mac and Linux users

    Open terminal and run ``$ python -m SimpleHTTPServer`` and go to localhost:8000 in your browser

- Windows users (2 options)

    Install the [Backets editor](http://brackets.io/) and user it's one click live preview to start a server

    <i>or</i>

    Install the [Bash on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide) and run the same command as linux users ``$ python -m SimpleHTTPServer`` and go to localhost:8000 in your browser

## Developers
Install node modules (make sure you have [nodejs](https://nodejs.org/en/) installed)

Install gulp (use `sudo` if it doesn't work)
```bash
$ npm install -g gulp
```

Install node modules (use `sudo` if it doesn't work)
```bash
$ npm install
```

Recompile js and scss files
```bash
$ gulp
```

## Contributions
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :smile:

## Features
- Table of contents
- Latex equivalent font
- Local and online images and captions w/ numbering
- Sub-/subsub-/sections w/ numbering
- Including local and online html files
- Tables, lists
- Page setup w/ size, header, footer, page numbering
- Links to websites and page locations
- References
- Equations with LaTeX syntax
- Rendering code with support for many languages (online only)
- Quotes
- Most symbols you can think of using html entities
- Various text manipulation, bold, italic, etc.
- Citations (needs testing)
- Form w/ various input types
- Local or online fonts

## Sources
- [Basic Rules of Good Typography](http://www.troytempleman.com/2010/02/08/basic-rules-of-good-typography/)

## Dependencies
- **jQuery** --> [jQuery write less, do more](https://jquery.com/)
- **Font** --> [Computer Modern on the web by CheckMyWorking.com](http://checkmyworking.com/cm-web-fonts/)
- **Math** --> [MathJax, Beautiful math in all browsers](https://www.mathjax.org/)
- **Icons** --> [Font Awesome, The iconic font and CSS toolkit](http://fontawesome.io/)
- **CSS modules** --> [Pure CSS, A set of small, responsive CSS modules that you can use in every web project](http://purecss.io/)
- **Spinner** --> [#Codevember - Day 6 - Bookshelf loader by Grélard Antoine](http://codepen.io/ikoshowa/pen/qOMvpy)
- **CSS Normalize** --> [Normalize.css, A modern, HTML5-ready alternative to CSS resets](https://necolas.github.io/normalize.css/)

## Special Thanks
- [Frederik Madsen](https://www.linkedin.com/in/frederikmadsen/da) for inspiration and help with some of the code

---

Copyright &copy; 2016 Mathias Grundtvig Andreasen (MGApcDev). Licensed under the terms of the [GPLv3 license](LICENSE.md).
