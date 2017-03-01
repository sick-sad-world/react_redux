const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');

module.exports = (gulp, BASE, JSROOT) => {
  return {
    bundle (debug = false) {
      return browserify({
          entries: path.join(BASE, 'src', JSROOT),
          debug: debug,
          extensions: ['.js', '.jsx']
        })
        .transform('babelify', {
          presets: ['react', 'es2015', 'stage-0']
        })
        .bundle()
        .pipe(source(JSROOT))
        .pipe(buffer());
    },
    development (TARGET) {
      return () => this.bundle(true).pipe(gulp.dest(TARGET));
    },
    production (TARGET, PREAMBLE = '') {
      return () => this.bundle()
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