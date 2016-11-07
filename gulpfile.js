// Config stuff
// ==================================================================
const packageJSON = require('./package.json');
const isBrowserify = packageJSON.devDependencies.hasOwnProperty('browserify');
const isRequireJs = packageJSON.devDependencies.hasOwnProperty('requirejs');

// Config for browserSync server
// ==================================================================
const SERVER = {
  online: false,
  open: false, // 'local', 'external', 'ui', 'ui-external', 'tunnel' or false
  level: 'info', // 'info', 'debug', 'warn', or 'silent'
  browser: 'google chrome',
  port: 3001
};

// * You should choose only one build system for JS: Browserify(CommonJS) or RequireJS(AMD) or none of them
const BASE = ''; // Root of your project. May be different due to environment such as Expressjs or Cordova
const CONFIG = {
  jsRoot: 'app.js',
  build: 'build', // BASE = '' -> build = '../outside' : BASE => 'foo' -> build = '../../outside' : BASE => 'foo/bar' -> build = '../../../outside'
  js: 'js',
  es6: 'es6', // set to false to turn it off
  requirejs: isRequireJs && false, // * set to false to turn it off
  minify: false, // * set it to array files manually in order to provide order for them
  sass: 'scss',
  css: 'css',
  fonts: 'font',
  templates: 'templates', // set to false to turn it off
  img: 'img',
  icons: 'img/icons',
  icons_sprite: 'img',
  icons_name: 'icons.svg',
  filesToCopy: ['index.html', 'README.md', 'LICENSE', 'package.json', 'fonts/**/*.{eot,svg,ttf,woff,woff2}'],
  fileName: `build[${packageJSON.version}][$d].zip`,
  preamble: `
  /* ${packageJSON.name} app v${packageJSON.version}.
   * Compiled at $d.
   * Made by: ${packageJSON.author}.
   * ================================================================== */`
};

// Essential packages
// ==================================================================
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const gulp = require('gulp');

// Style plugins
// ==================================================================
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');

// Js plugins
// ==================================================================
const requirejsOptimize = require('gulp-requirejs-optimize');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

// Icons
// ==================================================================
const imagemin = require('gulp-imagemin');
const cheerio = require('gulp-cheerio');
const svgSprite = require('gulp-svg-sprite');

// Utils
// ==================================================================
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const path = require('path');

const p = (...args) => {
  Array.prototype.unshift.call(args, BASE);
  return path.join.apply(path, args);
};

// Build section
// ==================================================================
/**
 * Check conditions for JS building systems
 * @param  {[String]} 'build:check' [taskname]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:check', () => {
  if (CONFIG.requirejs && CONFIG.browserify) {
    throw new Error('Only one module system should be active - turn one off');
  }
  if (typeof CONFIG.minify === 'array') {
    CONFIG.browserify = false;
    CONFIG.requirejs = false;
  }
});

/**
 * Clean previous build in target location
 * @param  {[String]} 'build:clean' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:clean', ['build:check'], () => {
  return gulp.src(CONFIG.build, {read: false})
    .pipe(clean());
});

/**
 * Copy all required files wich dosen't need any transformations for build in target location
 * @param  {[String]} 'build:clean' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:copy', [(CONFIG.build.indexOf('..') === 0) ? 'build:check' : 'build:clean'], function() {
  let filesToCopy = CONFIG.filesToCopy.map(item => p(item));
	if (CONFIG.requirejs) {
		filesToCopy.push(p('node_modules/requirejs/require.js'));
	}
  if (CONFIG.templates) {
    filesToCopy.push(p(CONFIG.templates, '**/*.html'));
  }
	return gulp.src(filesToCopy, {
			base: '.'
		})
		.pipe(gulp.dest(p(CONFIG.build)));
});

/**
 * Generate CSS out of .scss files w/o sourcemaps in target location
 * @param  {[String]} 'build:compass' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:compass', ['build:copy'], () => {
  if (!CONFIG.sass) return console.log('To enable Compass/SASS compilation define source folder first in CONFIG line 21');
  // Fix sass function images directory misspath
  // For some reason ignoring config.rb file
  return sass(p(CONFIG.sass, '**/*.scss'), {
      tempDir: '.sass-cache',
      compass: true,
      precision: 3,
      style: 'compressed',
      trace: true,
      verbose: true
    })
    .on('error', sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.css)));
});

/**
 * Optimize and minify all required images and place them in target location
 * @param  {[String]} 'build:icons' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:images', ['build:compass'], function() {
	return gulp.src('img/**/*.{ico,png,jpg,jpeg,gif,webp}')
		.pipe(imagemin())
		.pipe(gulp.dest(p(CONFIG.build, CONFIG.img)));
});

/**
 * Generate Single sprite out of bunch SVG files in target location
 * @param  {[String]} 'build:icons' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:icons', ['build:images'], () => {
  if (!CONFIG.icons) return console.log('To run icons task - define their location first in CONFIG line 26');
  return gulp.src(p(CONFIG.icons, '**/*.svg'))
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
          dest: p(CONFIG.icons_sprite),
          sprite: p(CONFIG.icons_name),
          example: false
        }
      },
      svg: { xmlDeclaration: false, doctypeDeclaration: false }
    })).pipe(gulp.dest(p(CONFIG.build)));
});

/**
 * Compile ES6 script to ES5 for compability reasons, w/o sourcemap
 * @param  {[String]} 'build:babel' [taskname]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:babel', [(CONFIG.icons) ? 'build:icons' : 'build:images'], () => {
  if (!CONFIG.es6) return console.log('To enable ES6 translation define source folder first in CONFIG line 18');
  return gulp.src(p(CONFIG.es6, '**/*.js'))
    .pipe(babel({
        presets: ["react", "es2015", "stage-0", "stage-1"],
        plugins: ["babel-plugin-transform-es2015-modules-umd"]
    }))
    .pipe(gulp.dest(p(CONFIG.js)));
});

/**
 * Build all Javascript to a single js file
 * @param  {[String]} 'build:minify' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:minify', [(CONFIG.es6) ? 'build:babel' : (CONFIG.icons) ? 'build:icons' : 'build:images'], () => {
  return gulp.src(p(CONFIG.js))
    .pipe(uglify({
      output: {
        preamble: CONFIG.preamble.replace('$d', (new Date().toUTCString()))
      }
    }))
    .pipe(concat(CONFIG.jsRoot))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.js)));
});

/**
 * Build all your AMD modules to a single js file
 * @param  {[String]} 'build:requirejs' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:requirejs', [(CONFIG.es6) ? 'build:babel' : (CONFIG.icons) ? 'build:icons' : 'build:images'], () => {
  let path = p(CONFIG.js, CONFIG.requirejs);
  return gulp.src(path)
    .pipe(requirejsOptimize({
      baseUrl: p(CONFIG.js),
      name: path.filename(CONFIG.requirejs),
      mainConfigFile: path,
      optimize: 'none',
    }))
    .pipe(uglify({
      output: {
        preamble: CONFIG.preamble.replace('$d', (new Date().toUTCString()))
      }
    }))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.js)));
});

/**
 * Build all your CommonJS modules to a single js file
 * @param  {[String]} 'build:browserify' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build:browserify', [(CONFIG.es6) ? 'build:babel' : (CONFIG.icons) ? 'build:icons' : 'build:images'], () => {
  return browserify(p(CONFIG.js, CONFIG.browserify))
    .bundle(CONFIG.browserify)
    .pipe(uglify({
      output: {
        preamble: CONFIG.preamble.replace('$d', (new Date().toUTCString()))
      }
    }))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.js)));
});

/**
 * Build your project
 * @param  {[String]} 'build' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('build', ((deps)=>{
  if (CONFIG.requirejs) return ['build:requirejs'];
  if (CONFIG.minify) ['build:minify'];
  return [(CONFIG.icons) ? 'build:icons' : 'build:images'];
})(), () => {
  console.log(`Project: ${packageJSON.name} app v${packageJSON.version} build'up done....`);
});

/**
 * Build your project and put it into archive
 * @param  {[String]} 'build' [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('zipbuild', ['build'], function() {
	return gulp.src(p(CONFIG.build, '/**/*'))
		.pipe(zip(CONFIG.fileName.replace('$d', (new Date()).getTime())))
		.pipe(gulp.dest(BASE));
});

// Development section
// ==================================================================
/**
 * Generate CSS out of .scss files /w sourcemaps in target location
 * @param  {[String]} 'compass:dev' [taskname]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('compass:dev', () => {
  if (!CONFIG.sass) return console.log('To enable Compass/SASS compilation define source folder first in CONFIG line 21');
  // Fix sass function images directory misspath
  // For some reason ignoring config.rb file
  return sass(p(CONFIG.sass, '**/*.scss'), {
      tempDir: '.sass-cache',
      sourcemap: true,
      compass: true,
      precision: 3,
      style: 'expaned',
      trace: true,
      verbose: true
    })
    .on('error', sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(p(CONFIG.css)));
});

/**
 * Generate Single sprite out of bunch SVG files in target location
 * @param  {[String]} 'icons:dev' [taskname]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('icons:dev', () => {
  if (!CONFIG.icons) return console.log('To run icons task - define their location first in CONFIG line 26');
  return gulp.src(p(CONFIG.icons, '**/*.svg'))
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
          dest: p(CONFIG.icons_sprite),
          sprite: p(CONFIG.icons_name),
          example: true
        }
      },
      svg: { xmlDeclaration: false, doctypeDeclaration: false }
    })).pipe(gulp.dest(BASE));
});

/**
 * Compile ES6 script to ES5 for compability reasons, sourcemap included
 * @param  {[String]} 'es6bundle:dev' [taskname]
 * @return {[Stream]} [stream representing binary file data]
 */
gulp.task('es6bundle:dev', () => {
  if (!CONFIG.es6) return console.log('To enable ES6 translation define source folder first in CONFIG line 18');
  return browserify({
      entries: p(CONFIG.es6, CONFIG.jsRoot),
      debug: true
    })
    .transform('babelify', {
        presets: ['react', 'es2015', 'stage-0', 'stage-1'],
        plugins: ['babel-plugin-transform-es2015-modules-umd']
    })
    .bundle()
    .pipe(source(p(CONFIG.jsRoot)))
    .pipe(buffer())
    .pipe(gulp.dest(p(CONFIG.js)));
});

/**
 * Default task for development - runs server with livereload also watches all required
 * files and folders for changes
 * @param  {[String]} 'default'      [taskname]
 * @param  {[Array]} [Deps,...] [An array of tasks to be executed and completed before your task will run.]
 */
gulp.task('default', ((deps)=>{
  if (CONFIG.es6) deps.push('es6bundle:dev');
  if (CONFIG.icons) deps.push('icons:dev');
  return deps;
})(['compass:dev']), () => {

  // Really want to replace this ugly array with one unique selector
  // '**/*.{js,html,css}' this dosen't work but should
  // '*.{js,html,css}' this works but only on base folder, no affect on inner ones
  var watch = [
    p(CONFIG.img, '**/*.*'),
    p(CONFIG.fonts, '**/*.*'),
    p(CONFIG.css, '**/*.css'),
    p(CONFIG.js, '**/*.js'),
    p('*.html'),
    '!node_modules'
  ];
  var statics = {
    '/css': p(CONFIG.css),
    '/img': p(CONFIG.img),
    '/js': p(CONFIG.js)
  };

  // If templates enabled add them to static resources and to watch pool
  if (CONFIG.templates) {
    watch.push(p(CONFIG.templates, '**/*.html'));
    statics['/templates'] = p(CONFIG.templates);
  }

  if (SERVER) {
    browserSync({
      port: SERVER.port,
      open: SERVER.open,
      browser: SERVER.browser,
      online: SERVER.online,
      server: {
        baseDir: BASE,
        routes: statics
      },
      notify: false,
      logLevel: SERVER.level,
      logPrefix: packageJSON.name,
      logConnections: true,
      logFileChanges: true
    });
  }

  if (CONFIG.es6) {
   gulp.watch([p(CONFIG.es6), p(CONFIG.es6, '**/*.js')], ['es6bundle:dev']);
  }
  if (CONFIG.icons) {
    gulp.watch([p(CONFIG.icons), p(CONFIG.icons, '**/*.svg')], ['icons:dev']);
  }
  gulp.watch([p(CONFIG.sass), p(CONFIG.sass, '**/*.scss')], ['compass:dev']);
  gulp.watch(watch).on('change', reload);
});