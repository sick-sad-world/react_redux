const path = require('path');
const gulp = require('gulp');

module.exports = BASE => ({
  copyassets: (TARGET, assets) => () => gulp.src(assets.map(p => path.join(BASE, p)), { base: BASE }).pipe(gulp.dest(TARGET))
});
