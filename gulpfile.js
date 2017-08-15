"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); // Concatenate files
var lint = require('gulp-eslint'); // Lint JS and JSX files

var config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/**/*.js',
    images: './src/images/*',
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
        'node_modules/toastr/toastr.css',
    ],
    dist: './dist',
    mainJs: './src/main.js',
  }
}

//Start a local development server
gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

// Connect to localhost and then launch browser to devBaseUrl
gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

// Get any HTML files, put them in destination path (in dist),
// and then reload using connect (dev server we downloaded from NPM).
gulp.task('html', function () {
  gulp.src(config.paths.html)
      .pipe(gulp.dest(config.paths.dist))
      .pipe(connect.reload());
});

gulp.task('js', function () {
  browserify(config.paths.mainJs)
      .transform(reactify)
      .bundle() // Put it all in one file
      .on('error', console.log.bind(console)) // Print errors to log
      .pipe(source('bundle.js')) // call it bundle.js
      .pipe(gulp.dest(config.paths.dist + '/scripts')) // File destination
      .pipe(connect.reload()); // Reload page
});

// Bundle CSS
// We don't use concat() is JE because JS uses reactify().bundle() for this
gulp.task('css', function () {
  gulp.src(config.paths.css)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('images', function () {
  gulp.src(config.paths.images)
      .pipe(gulp.dest(config.paths.dist + '/images'))
      .pipe(connect.reload());

  // Publish favicon
  gulp.src('./src/favicon.ico')
    .pipe(gulp.dest(config.paths.dist));
;});

gulp.task('lint', function () {
  return gulp.src(config.paths.js)
      .pipe(lint({ configFile: 'eslint.config.json' }))
      .pipe(lint.format());
});

// Watch for changes in files. When detected, run the file specific task
gulp.task('watch', function () {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js', 'lint']);
});

// When you type 'gulp', it will run the html task and then the open task.
// Also watch for changes in html nd reload
// Second parameter is an Array of task names
gulp.task('default', ['html', 'js', 'css', 'images', 'lint', 'open', 'watch']);