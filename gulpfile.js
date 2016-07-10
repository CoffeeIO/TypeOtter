var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./src/styles/source/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/styles/build'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./src/styles/source/main.scss', ['sass']);
});