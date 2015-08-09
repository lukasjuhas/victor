var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var exorcist = require('exorcist');
var babelify = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');

var config = {
  app: 'app',
  appjs: 'app/app.js',
  syles: 'appstyles/**/*.scss',
  html: 'app/*.html',
  dist: 'dist',
  tmp: '.tmp',
  build: 'build',
};

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: './app',
  });

  gulp.watch(config.styles, ['sass']);
  gulp.watch(config.html).on('change', browserSync.reload);
});

gulp.task('scss', function() {
  return gulp.src(config.styles)
    .pipe(sass({errLogToConsole: true}))
    .pipe(sourcemaps.init())
    .pipe(sass(config.settings))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest(config.tmp))
    .pipe(browserSync.reload({stream:true}));
});

watchify.args.debug = true;
var bundler = watchify(browserify('./app/js/app.js', watchify.args));

// Babel transform
bundler.transform(babelify.configure({
  sourceMapRelative: 'app/js',
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {

  gutil.log('Compiling JS...');

  return bundler.bundle()
  .on('error', function(err) {
    gutil.log(err.message);
    browserSync.notify('Browserify Error!');
    this.emit('end');
  })
  .pipe(exorcist('app/js/dist/bundle.js.map'))
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./app/js/dist'))
  .pipe(browserSync.stream({once: true}));
}

gulp.task('bundle', function() {
  return bundle();
});

gulp.task('default', ['bundle'], function() {
  browserSync.init({
    server: './app',
  });
});
