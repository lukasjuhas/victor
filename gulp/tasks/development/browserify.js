var gulp = require('gulp');
var babel = require('gulp-babel');
var config = require('../../config').browserify;
var browserify = require('browserify');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {

  var b = browserify('./src/js/main.js', {
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
  });

  b = watchify(b);

  b.on('update', function() {
    bundleShare(b);
  });

  bundleShare(b);

});

function bundleShare(b) {
  b.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
}

gulp.task('browserifyForProduct', function() {
  return browserify('./src/js/main.js')
    .bundle()
    .pipe(babel())
    .pipe(source('main.js'))
    .pipe(gulp.dest(config.dest));
});
