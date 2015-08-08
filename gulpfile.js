var gulp = require('gulp');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: './app',
  });

  gulp.watch('app/styles/*.scss', ['sass']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp.src('app/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('.tmp/css'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);

gulp.task('default', function() {
  return gulp.src('app/app.js')
    .pipe(babel())
    .pipe(gulp.dest('dest'));
});
