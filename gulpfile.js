var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');

gulp.task('default', ['sass', 'uglify'], function () {

});

gulp.task('sass', function () {
    return gulp.src(
        './src/styles/source/main.scss'
    )
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./src/styles/build'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/styles/source/*.scss', ['sass']);
});

gulp.task('uglify', function() {
    return gulp.src([
        'dependencies/jQuery/jquery-2.2.0.min.js',
        'src/scripts/source/settings.js',
        'src/scripts/source/attr.js',
        'src/scripts/source/bib.js',
        'src/scripts/source/include.js',
        'src/scripts/source/math.js',
        'src/scripts/source/code.js',
        'src/scripts/source/page.js',
        'src/scripts/source/ref.js',
        'src/scripts/source/spinner.js',
        'src/scripts/source/controls.js',
        'src/scripts/source/toc.js',
        'src/scripts/source/wrap.js',
        'src/scripts/source/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/scripts/build'));
});
