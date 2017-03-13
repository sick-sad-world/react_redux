// Import packages
// ===========================================================================
const packageJSON = require('./package.json');
const argv = require('yargs').argv;
const gulp = require('gulp');
const path = require('path');
const clean = require('gulp-clean');

// Define path variables
// ===========================================================================
const BASE = path.join(__dirname, 'assets');
const DEMO = path.join(__dirname, 'demo');
const BUILD = path.join(__dirname, 'build');
const SASS = path.join(BASE, 'scss/**/*.scss');
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
gulp.task('sass:prod', sass.production(BUILD));

// Define tasks for javascript processng
// ===========================================================================
gulp.task('bundle:dev', script.development(BASE));
gulp.task('bundle:demo', script.demo(BASE));
gulp.task('bundle:prod', script.production(BUILD, PREAMBLE));

// Define tasks for image processng
// ===========================================================================
gulp.task('image:prod', image.images(BUILD));
gulp.task('assets:prod', files.copyassets(BUILD, ['index.html', 'font/**/**.*']));

// Define default development task
// ===========================================================================
gulp.task('dev', ['sass:dev', 'bundle:dev'], () => {
  serve(packageJSON.name, BASE, ['index.html', 'app.css', 'img']);
  gulp.watch(SASS, ['sass:dev']);
});

// Clean production folder before creating new build
// ===========================================================================
gulp.task('clean', () => gulp.src([BUILD, DEMO], {read: false}).pipe(clean()));

// Task for building a demo version
// ===========================================================================
gulp.task('bundle', ['sass:dev', 'bundle:demo'], files.copyassets(DEMO, ['index.html', 'font/**/**.*', 'app.js', 'app.css', 'app.css.map', 'img/**/*.*']));

// Task for building a production version
// ===========================================================================
gulp.task('build', ['assets:prod', 'sass:prod', 'image:prod', 'bundle:prod'], () => console.log('Build complete'));