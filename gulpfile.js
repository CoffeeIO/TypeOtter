var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', ['sass'], function () {

});

gulp.task('sass', function () {
    return gulp.src('./src/styles/source/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./src/styles/build'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/styles/source/*.scss', ['sass']);
});
