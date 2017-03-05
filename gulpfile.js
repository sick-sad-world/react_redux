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
const BUILD = path.join(__dirname, 'build');
const SASS = path.join(BASE, 'scss/**/*.scss');
const SCRIPT = path.join(BASE, 'src/**/*.{js,jsx}');
const PREAMBLE = `
  /* ${packageJSON.name} app v${packageJSON.version}.
   * Compiled at $d.
   * Made by: ${packageJSON.author}.
   * ================================================================== */`;

// Import task creators
// ===========================================================================
const serve = require('./gulp/serve');
const sass = require('./gulp/sass')(SASS);
const script = require('./gulp/script')(BASE, 'app.js');
const image = require('./gulp/image')(BASE);

// Define tasks for style processng
// ===========================================================================
gulp.task('sass:dev', sass.development(BASE));
gulp.task('sass:prod', sass.production(BUILD));

// Define tasks for javascript processng
// ===========================================================================
gulp.task('bundle:dev', script.development(BASE));
gulp.task('bundle:prod', script.production(BUILD, PREAMBLE));

// Define tasks for image processng
// ===========================================================================
// gulp.task('icons:dev', image.icons(BASE));
gulp.task('image:prod', image.images(BUILD));
// gulp.task('icons:prod', image.icons(BUILD));

// Define default development task
// ===========================================================================
gulp.task('dev', ['sass:dev', 'bundle:dev'], () => {

  // Run dev server if --serve is set
  // ===========================================================================
  if (argv.serve) serve(packageJSON.name, BASE, ['index.html', 'app.css', 'img']);

  // Watch files if --watch is set
  // ===========================================================================
  if (argv.watch) {
    gulp.watch(SASS, ['sass:dev']);
    // gulp.watch(SCRIPT, ['bundle:dev']);
    // gulp.watch(path.join(BASE, 'img/icons/**/*.svg'), 'icons:dev');
  }
  
});

// Clean production folder before creating new build
// ===========================================================================
gulp.task('clean', () => gulp.src(BUILD, {read: false}).pipe(clean()));

// Copy project assets (fonts, html, e.t.c)
// ===========================================================================
gulp.task('copy:assets', () => {
  return gulp.src([
    path.join(BASE, 'index.html'),
    path.join(BASE, 'font/**/**.*')
    ], {base: BASE}).pipe(gulp.dest(BUILD))
});

// Copy project docs
// ===========================================================================
gulp.task('copy:docs', () => {
  return gulp.src([
    'README.md',
    'package.json'
    ]).pipe(gulp.dest(BUILD))
});

// Task for building a production version
// ===========================================================================
gulp.task('build', ['copy:assets', 'copy:docs', 'sass:prod', 'image:prod', 'bundle:prod'], () => console.log('Build complete'));