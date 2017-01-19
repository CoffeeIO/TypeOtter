var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');

gulp.task('default', ['sass', 'uglify', 'uglifyNoMath'], function () {

});

gulp.task('sass', function () {
    return gulp.src(
        './src/styles/main.scss'
    )
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('dist'));
});

var js = [
    'src/scripts/settings.js',
    'src/scripts/attr.js',
    'src/scripts/bib.js',
    'src/scripts/include.js',
    'src/scripts/math.js',
    'src/scripts/download.js',
    'src/scripts/code.js',
    'src/scripts/page.js',
    'src/scripts/ref.js',
    'src/scripts/spinner.js',
    'src/scripts/controls.js',
    'src/scripts/toc.js',
    'src/scripts/wrap.js',
    'src/scripts/main.js'
];

gulp.task('uglify', function() {
    return gulp.src([
        'dependencies/jquery/jquery.min.js' // jQuery
    ]
    .concat(js)
    .concat([
        'src/scripts/vendor/MathJax.js' // MathJax:668
    ]))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('uglifyNoMath', function() {
    return gulp.src([
        'dependencies/jquery/jquery.min.js' // jQuery
    ]
    .concat(js))
    .pipe(concat('mainNoMath.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
