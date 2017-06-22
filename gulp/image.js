const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

module.exports = BASE => ({
  images(TARGET) {
    return () => gulp.src(path.join(BASE, 'img/**/*.{ico,png,jpg,jpeg,gif,webp,svg}'))
        .pipe(imagemin())
        .pipe(gulp.dest(path.join(TARGET, 'img')));
  }
})
;
