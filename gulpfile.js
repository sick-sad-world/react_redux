// Config stuff
// ==================================================================
const packageJSON = require('./package.json');

// Config for browserSync server
// ==================================================================
const SERVER = {
  online: true,
  open: false, // 'local', 'external', 'ui', 'ui-external', 'tunnel' or false
  level: 'info', // 'info', 'debug', 'warn', or 'silent'
  browser: 'google chrome',
  port: 3001
};

// * You should choose only one build system for JS: Browserify(CommonJS) or RequireJS(AMD) or none of them
const BASE = ''; // Root of your project. May be different due to environment such as Expressjs or Cordova
const BUILD = 'build';
const CONFIG = {
  gzip: {
    gzipOptions: { level: 9 }
  },
  js: 'js',
  jsRoot: 'app.js',
  es6: 'src', // set to false to turn it off
  sass: 'scss',
  css: 'css',
  img: 'img',
  filesToCopy: ['index.html', 'README.md', 'package.json', 'font/**/**.*'],
  fileName: `${packageJSON.name} ${packageJSON.version}.zip`,
  preamble: `
  /* ${packageJSON.name} app v${packageJSON.version}.
   * Compiled at $d.
   * Made by: ${packageJSON.author}.
   * ================================================================== */`
};

// Essential packages
// ==================================================================
const browserSync = require('browser-sync');
const gulp = require('gulp');

// Style plugins
// ==================================================================
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Js plugins
// ==================================================================
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

// Icons
// ==================================================================
const imagemin = require('gulp-imagemin');

// Utils
// ==================================================================
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const gzip = require('gulp-gzip');
const path = require('path');

const p = (...args) => path.join.apply(path, [BASE, ...args]);

// Build section
// ==================================================================

/**
 * Clean previous build in target location
 */
gulp.task('build:clean', () => gulp.src(BUILD, {read: false}).pipe(clean()));

/**
 * Copy all required files wich dosen't need any transformations for build in target location
 */
gulp.task('build:copy', ['build:clean'], () => gulp.src(CONFIG.filesToCopy.map(item => p(item)), {base: (BASE.length) ? BASE : __dirname}).pipe(gulp.dest(BUILD)));

/**
 * Generate CSS out of .scss files w/o sourcemaps in target location
 */
gulp.task('build:compass', () => gulp.src(p(CONFIG.sass, '**/*.scss'))
  .pipe(sass({
    precision: 3,
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(gzip(CONFIG.gzip))
  .pipe(gulp.dest(path.join(BUILD, CONFIG.css)))
);

/**
 * Optimize and minify all required images and place them in target location
 */
gulp.task('build:images', () => gulp.src(p(CONFIG.img, '**/*.{ico,png,jpg,jpeg,gif,webp,svg}')).pipe(imagemin()).pipe(gulp.dest(path.join(BUILD, CONFIG.img))));

/**
 * Compile ES6 script to ES5 for compability reasons, w/o sourcemap
 */
gulp.task('build:babel', () => browserify({
    entries: p(CONFIG.es6, CONFIG.jsRoot),
    debug: true,
    extensions: ['.js', '.jsx']
  })
  .transform('babelify', {
    presets: ['react', 'es2015', 'stage-0', 'stage-1'],
    plugins: ['babel-plugin-transform-es2015-modules-umd']
  })
  .bundle()
  .pipe(source(CONFIG.jsRoot))
  .pipe(buffer())
  .pipe(uglify({
    output: {
      preamble: CONFIG.preamble.replace('$d', (new Date().toUTCString()))
    }
  }))
  .pipe(gzip(CONFIG.gzip))
  .pipe(gulp.dest(path.join(BUILD, CONFIG.js)))
);

/**
 * Build your project
 */
gulp.task('build', ['build:copy', 'build:compass', 'build:images', 'build:babel'], () => {
  console.log(`Project: ${packageJSON.name} app ${packageJSON.version} build'up done....`);
});

/**
 * Build your project and put it into archive
 */
gulp.task('zipbuild', ['build'], () => {
  let dateString = new Date().toLocaleString().replace(/\//g, '.');
  return gulp.src(path.join(BUILD, '**/**.*'), {base: BUILD})
		.pipe(zip(CONFIG.fileName.replace('$d', dateString).replace(/[ ,]/g, '_')))
		.pipe(gulp.dest(__dirname));
});

// Development section
// ==================================================================
/**
 * Generate CSS out of .scss files /w sourcemaps in target location
 */
gulp.task('compass:dev', () => gulp.src(p(CONFIG.sass, '**/*.scss'))
  .pipe(sass({
    precision: 3,
    outputStyle: 'expaned'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(p(CONFIG.css)))
);

/**
 * Compile ES6 script to ES5 for compability reasons, sourcemap included
 */
gulp.task('babel:dev', () => browserify({
    entries: p(CONFIG.es6, CONFIG.jsRoot),
    debug: true,
    extensions: ['.js', '.jsx']
  })
  .transform('babelify', {
    presets: ['react', 'es2015', 'stage-0', 'stage-1'],
    plugins: ['babel-plugin-transform-es2015-modules-umd']
  })
  .bundle()
  .pipe(source(CONFIG.jsRoot))
  .pipe(buffer())
  .pipe(gulp.dest(p(CONFIG.js)))
);

/**
 * Default task for development - runs server with livereload also watches all required
 * files and folders for changes
 */
gulp.task('default', ['babel:dev', 'compass:dev'], () => {

  if (SERVER) {
    browserSync({
      port: SERVER.port,
      open: SERVER.open,
      browser: SERVER.browser,
      online: SERVER.online,
      server: {
        baseDir: BASE,
        routes: {
          '/css': p(CONFIG.css),
          '/img': p(CONFIG.img),
          '/js': p(CONFIG.js),
          '/src': p(CONFIG.es6)
        }
      },
      middleware: [(req, res, next) => {
        if (req.url.indexOf('.') < 0)  req.url = '/index.html';
        next();
      }],
      files: [
        p(CONFIG.img, '**/*.{ico,png,jpg,jpeg,gif,webp,svg}'),
        p(CONFIG.css, 'app.css'),
        p(CONFIG.js, 'app.js'),
        p('index.html'),
      ],
      watchOptions: {
        ignored: /node_modules/
      },
      notify: false,
      logLevel: SERVER.level,
      logPrefix: packageJSON.name,
      logConnections: true,
      logFileChanges: true
    });
  }

  gulp.watch([p(CONFIG.es6), p(CONFIG.es6, '**/*.{js,jsx}')], ['babel:dev']);
  gulp.watch([p(CONFIG.sass), p(CONFIG.sass, '**/*.scss')], ['compass:dev']);
});