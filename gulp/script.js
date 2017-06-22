const path = require('path');
const gulp = require('gulp');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');
const source = require('vinyl-source-stream2');
const watchify = require('watchify');
const livereactload = require('livereactload');
const gutil = require('gulp-util');

const onError = err => gutil.log(err);

module.exports = (BASE, JSROOT) => ({
  browserify(opts) {
    const o = Object.assign({ debug: false, livereload: false }, opts);
    return browserify({
      entries: path.join(BASE, JSROOT),
      cache: {},
      packageCache: {},
      debug: o.debug,
      sourceType: 'module',
      extensions: ['.js', '.jsx'],
      plugin: (o.livereload) ? [watchify, livereactload] : null
    });
  },
  development(TARGET) {
    return () => {
      const b = this.browserify({ debug: true, livereload: true });

      const build$ = () => b.bundle()
          .on('error', onError)
          .pipe(source(JSROOT))
          .pipe(buffer())
          .pipe(gulp.dest(TARGET));

      b.on('update', () => {
        gutil.log('Rerunning browserify...');
        const updateStart = Date.now();
        build$().on('end', () => gutil.log(`...Done ${Date.now() - updateStart} ms`));
      });

      return build$();
    };
  },
  bundle(TARGET) {
    return () => this.browserify({ debug: true }).bundle()
        .on('error', onError)
        .pipe(source(JSROOT))
        .pipe(buffer())
        .pipe(gulp.dest(TARGET));
  },
  production(TARGET, PREAMBLE = '') {
    return () => this.browserify().bundle()
        .on('error', onError)
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
});
