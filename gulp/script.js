const path = require('path');
const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');
const source = require('vinyl-source-stream2');
const watchify = require('watchify');
const livereactload = require('livereactload');
const gutil = require('gulp-util');

module.exports = (BASE, JSROOT) => {
  return {
    bundle (debug = false) {
      return browserify({
        entries: 'assets/src/app.js',
        cache: {},
        packageCache: {},
        debug: debug,
        extensions: ['.js', '.jsx'],
        plugin: (debug) ? [watchify, livereactload] : null,
      })
    },
    development (TARGET) {
      return () => {
        let b = this.bundle(true);

        let _build = () => b.bundle()
          .on('error', (err) => gutil.log(err.stack))
          .pipe(source(JSROOT))
          .pipe(gulp.dest(TARGET));
        
        b.on('update', () => {
          gutil.log('Rerunning browserify...');
          const updateStart = Date.now();
          _build().on('end', () => gutil.log(`...Done ${Date.now() - updateStart} ms`));
        });

        return _build();
      }
    },
    production (TARGET, PREAMBLE = '') {
      return () => this.bundle()
        .bundle()
        .pipe(source(JSROOT))
        .pipe(buffer())
        .pipe(uglify({
          output: {
            preamble: PREAMBLE
          }
        }))
        .pipe(gzip({ gzipOptions: { level: 9 } }))
        .pipe(gulp.dest(TARGET));
    }
  }
}