const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const gzip = require('gulp-gzip');

module.exports = (SELECTOR) => {
  return {
    development (TARGET) {
      return () => gulp.src(SELECTOR)
        .pipe(sourcemaps.init())
        .pipe(sass({ precision: 3, outputStyle: 'expaned' }).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(TARGET))
    },
    production (TARGET) {
      return () => gulp.src(SELECTOR)
        .pipe(sass({ precision: 3, outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gzip({ gzipOptions: { level: 9 } }))
        .pipe(gulp.dest(TARGET))
    }
  }
}