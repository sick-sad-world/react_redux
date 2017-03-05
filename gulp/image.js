const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports = (BASE) => {
  return {
    images (TARGET) {
      return () => gulp.src(path.join(BASE, 'img/**/*.{ico,png,jpg,jpeg,gif,webp}'))
        .pipe(imagemin())
        .pipe(gulp.dest(path.join(TARGET, 'img')));
    }
  }
}