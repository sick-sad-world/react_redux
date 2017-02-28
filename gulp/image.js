const path = require('path');
const imagemin = require('gulp-imagemin');
const cheerio = require('gulp-cheerio');
const svgSprite = require('gulp-svg-sprite');

module.exports = (gulp, BASE) => {
  return {
    images (TARGET) {
      return () => gulp.src(path.join(BASE, 'img/**/*.{ico,png,jpg,jpeg,gif,webp}'))
        .pipe(imagemin())
        .pipe(gulp.dest(path.join(TARGET, 'img')));
    },
    icons (TARGET) {
      return () => gulp.src(path.join(BASE, 'img/icons/**/*.svg'))
        .pipe(cheerio({
          run ($) {
            $('[fill]').removeAttr('fill');
            $('[style]').removeAttr('style');
          },
          parserOptions: { xmlMode: true }
        }))
        .pipe(svgSprite({
          transform: [],
          mode: {
            symbol: {
              render: { css: false, scss: false },
              dest: 'img',
              sprite: 'icons.svg',
              example: true
            }
          },
          svg: { xmlDeclaration: false, doctypeDeclaration: false }
        }))
        .pipe(gulp.dest(TARGET));
    }
  }
}