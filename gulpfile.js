const { src, dest, watch, series, parallel } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const connect = require('gulp-connect');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js',
};

function scssTask() {
  return src(files.scssPath, { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

function jsTask() {
  return src(
    [
      files.jsPath,
    ],
    { sourcemaps: true }
  )
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

function cacheBustTask() {
  let cbString = new Date().getTime();
  return src(['index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.'));
}
// Browser sync to spin up a local server
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
function browserSyncReload() {
  browserSync.reload();
}

function watchTask() {
  watch(
    [files.scssPath, files.jsPath],
    { interval: 1000, usePolling: true },
    series(parallel(scssTask, jsTask), cacheBustTask)
  );
}
function host() {
  connect.server({
    root: ['dist'],
    port: 8000,
    base: 'http://localhost',
    livereload: true
  });
}
function bsWatchTask() {
  watch('index.html', browserSyncReload);
  watch(
    [files.scssPath, files.jsPath],
    { interval: 1000, usePolling: true },
    series(parallel(scssTask, jsTask), cacheBustTask, browserSyncReload)
  );
}

exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask, host, );

exports.bs = series(
  parallel(scssTask, jsTask),
  cacheBustTask,
  browserSyncServe,
  bsWatchTask,
  host,
);

