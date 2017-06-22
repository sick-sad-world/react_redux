// Import packages
// ===========================================================================
const packageJSON = require('./package.json');
const argv = require('yargs').argv;
const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');

// Define path variables
// ===========================================================================
let TIMER = 0;
const BASE = path.join(__dirname, 'assets');
const DIR = path.join(__dirname, argv.dir || '');
const SASS = path.join(BASE, 'scss/**/*.scss');
const ASSETS_TO_COPY = ['index.html', 'favicon.ico', 'font/**/**.*'];
const PREAMBLE = `
  /* ${packageJSON.name} app v${packageJSON.version}.
   * Compiled at $d.
   * Made by: ${packageJSON.author}.
   * ================================================================== */`;

// Import task creators
// ===========================================================================
const serve = require('./gulp/serve');
const files = require('./gulp/files')(BASE);
const sass = require('./gulp/sass')(SASS);
const script = require('./gulp/script')(path.join(BASE, 'src'), 'app.js');
const image = require('./gulp/image')(BASE);

// Define tasks for style processng
// ===========================================================================
gulp.task('sass:dev', sass.development(BASE));
gulp.task('sass:bundle', sass.development(DIR));
gulp.task('sass:prod', sass.production(DIR));

// Define tasks for javascript processng
// ===========================================================================
gulp.task('script:dev', script.development(BASE));
gulp.task('script:bundle', script.bundle(DIR));
gulp.task('script:prod', script.production(DIR, PREAMBLE));

// Define tasks for image processng
// ===========================================================================
gulp.task('image:opt', image.images(DIR));

gulp.task('assets:bundle', files.copyassets(DIR, ASSETS_TO_COPY));
gulp.task('assets:prod', files.copyassets(DIR, ASSETS_TO_COPY));

// Define default development task
// ===========================================================================
gulp.task('serve', ['sass:dev', 'script:dev'], () => {
  serve(packageJSON.name, BASE, ['index.html', 'app.css', 'img']);
  gulp.watch(SASS, ['sass:dev']);
});

// Timer tasks
// ===========================================================================
gulp.task('timer', () => {
  TIMER = Date.now();
  gutil.log('Building start...');
});

function logResults() {
  gutil.log(`...Build complete in ${(Date.now() - TIMER) / 1000} s`);
  TIMER = 0;
}

// Task for building a demo version
// ===========================================================================
gulp.task('bundle', ['timer', 'assets:bundle', 'sass:bundle', 'image:opt', 'script:bundle'], logResults);

// Task for building a production version
// ===========================================================================
gulp.task('build', ['timer', 'assets:prod', 'sass:prod', 'image:opt', 'script:prod'], logResults);
