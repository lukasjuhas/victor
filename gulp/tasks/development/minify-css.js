var gulp = require('gulp');
var config = require('../../config').production;
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-filesize');

gulp.task('minify-css', ['scss'], function() {
  return gulp.src(config.cssSrc)
    .pipe(minifyCSS({
      keepBreaks: true,
    }))
    .pipe(gulp.dest(config.cssDest))
    .pipe(size());
});
