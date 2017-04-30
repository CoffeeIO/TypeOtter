var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('default', ['sass', 'uglify', 'uglifyNoMath'], function () {

});

gulp.task('sass', function () {
    return gulp.src(
        './src/styles/main.scss'
        // './node_modules/typesetbot/src/styles/main.scss'
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
    'src/scripts/typeset.js',
    'src/scripts/pagination.js',
    'src/scripts/paginationUtils.js',
    'src/scripts/ref.js',
    'src/scripts/spinner.js',
    'src/scripts/controls.js',
    'src/scripts/toc.js',
    'src/scripts/wrap.js',
    'src/scripts/main.js'
];

gulp.task('watch', function() {
    return watch('src/**/*', function () {
        gulp.run('sass');
        gulp.run('uglify');
        gulp.run('uglifyNoMath');
    });
});

gulp.task('uglify', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js', // jQuery
        'node_modules/typesetbot/dist/mainWithPatterns.min.js'
    ]
    .concat(js)
    .concat([
        'src/scripts/vendor/MathJax.js' // MathJax:668
    ]))
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('uglifyNoMath', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js', // jQuery
        'node_modules/typesetbot/dist/mainWithPatterns.min.js'
    ]
    .concat(js))
    .pipe(concat('mainNoMath.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
