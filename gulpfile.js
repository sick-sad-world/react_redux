// Config stuff
// ==================================================================
const packageJSON = require("./package.json");
const isRequireJs = packageJSON.devDependencies.hasOwnProperty("requirejs");

// Config for browserSync server
// ==================================================================
const SERVER = {
  online: false,
  open: false, // "local", "external", "ui", "ui-external", "tunnel" or false
  level: "info", // "info", "debug", "warn", or "silent"
  browser: "google chrome",
  port: 3001
};

// * You should choose only one build system for JS: Browserify(CommonJS) or RequireJS(AMD) or none of them
const BASE = ""; // Root of your project. May be different due to environment such as Expressjs or Cordova
const CONFIG = {
  build: "build", // BASE = "" -> build = "../outside" : BASE => "foo" -> build = "../../outside" : BASE => "foo/bar" -> build = "../../../outside"
  js: "js",
  jsRoot: "app.js",
  es6: "src", // set to false to turn it off
  requirejs: isRequireJs && false, // * set to false to turn it off
  minify: false, // * set it to array files manually in order to provide order for them
  sass: "scss",
  css: "css",
  fonts: "font",
  templates: "templates", // set to false to turn it off
  img: "img",
  icons: "img/icons",
  icons_sprite: "img",
  icons_name: "icons.svg",
  filesToCopy: ["index.html", "README.md", "LICENSE", "package.json", "fonts/**/*.{eot,svg,ttf,woff,woff2}"],
  fileName: `build[${packageJSON.version}][$d].zip`,
  preamble: `
  /* ${packageJSON.name} app v${packageJSON.version}.
   * Compiled at $d.
   * Made by: ${packageJSON.author}.
   * ================================================================== */`
};

// Essential packages
// ==================================================================
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const gulp = require("gulp");

// Style plugins
// ==================================================================
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");

// Js plugins
// ==================================================================
const requirejsOptimize = require("gulp-requirejs-optimize");
const browserify = require("browserify");
const babelify = require("babelify");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

// Icons
// ==================================================================
const imagemin = require("gulp-imagemin");
const cheerio = require("gulp-cheerio");
const svgSprite = require("gulp-svg-sprite");

// Utils
// ==================================================================
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const zip = require("gulp-zip");
const path = require("path");

const p = (...args) => {
  Array.prototype.unshift.call(args, BASE);
  return path.join.apply(path, args);
};

// Build section
// ==================================================================

/**
 * Clean previous build in target location
 */
gulp.task("build:clean", () => {
  return gulp.src(CONFIG.build, {read: false})
    .pipe(clean());
});

/**
 * Copy all required files wich dosen"t need any transformations for build in target location
 */
gulp.task("build:copy", ["build:clean"], function() {
  let filesToCopy = CONFIG.filesToCopy.map(item => p(item));
	if (CONFIG.requirejs) {
		filesToCopy.push(p("node_modules/requirejs/require.js"));
	}
  if (CONFIG.templates) {
    filesToCopy.push(p(CONFIG.templates, "**/*.html"));
  }
	return gulp.src(filesToCopy, {
			base: "."
		})
		.pipe(gulp.dest(p(CONFIG.build)));
});

/**
 * Generate CSS out of .scss files w/o sourcemaps in target location
 */
gulp.task("build:compass", ["build:copy"], () => {
  if (!CONFIG.sass) return console.log("To enable Compass/SASS compilation define source folder first in CONFIG line 21");
  // Fix sass function images directory misspath
  // For some reason ignoring config.rb file
  return gulp.src(p(CONFIG.sass, "**/*.scss"))
    .pipe(sass({
      precision: 3,
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.css)));
});

/**
 * Optimize and minify all required images and place them in target location
 */
gulp.task("build:images", ["build:compass"], function() {
	return gulp.src("img/**/*.{ico,png,jpg,jpeg,gif,webp}")
		.pipe(imagemin())
		.pipe(gulp.dest(p(CONFIG.build, CONFIG.img)));
});

/**
 * Generate Single sprite out of bunch SVG files in target location
 */
gulp.task("build:icons", ["build:images"], () => {
  if (!CONFIG.icons) return console.log("To run icons task - define their location first in CONFIG line 26");
  return gulp.src(p(CONFIG.icons, "**/*.svg"))
    .pipe(cheerio({
			run ($) {
				$("[fill]").removeAttr("fill");
				$("[style]").removeAttr("style");
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
 */
gulp.task("build:babel", [(CONFIG.icons) ? "build:icons" : "build:images"], () => {
  if (!CONFIG.es6) return console.log("To enable ES6 translation define source folder first in CONFIG line 18");
  return browserify({
      entries: p(CONFIG.es6, CONFIG.jsRoot),
      debug: true
    })
    .transform("babelify", {
        presets: ["react", "es2015", "stage-0", "stage-1"],
        plugins: ["babel-plugin-transform-es2015-modules-umd"]
    })
    .bundle()
    .pipe(source(p(CONFIG.jsRoot)))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.js)));
});

/**
 * Build all Javascript to a single js file
 */
gulp.task("build:minify", [(CONFIG.icons) ? "build:icons" : "build:images"], () => {
  return gulp.src(p(CONFIG.js))
    .pipe(uglify({
      output: {
        preamble: CONFIG.preamble.replace("$d", (new Date().toUTCString()))
      }
    }))
    .pipe(concat("app.js"))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.js)));
});

/**
 * Build all your AMD modules to a single js file
 */
gulp.task("build:requirejs", [(CONFIG.icons) ? "build:icons" : "build:images"], () => {
  let path = p(CONFIG.js, CONFIG.requirejs);
  return gulp.src(path)
    .pipe(requirejsOptimize({
      baseUrl: p(CONFIG.js),
      name: path.filename(CONFIG.jsRoot),
      mainConfigFile: path,
      optimize: "none",
    }))
    .pipe(uglify({
      output: {
        preamble: CONFIG.preamble.replace("$d", (new Date().toUTCString()))
      }
    }))
    .pipe(gulp.dest(p(CONFIG.build, CONFIG.js)));
});

/**
 * Build your project
 */
gulp.task("build", ((deps)=>{
  if (CONFIG.es6) return ["build:babel"];
  if (CONFIG.requirejs) return ["build:requirejs"];
  if (CONFIG.minify) return ["build:minify"];
  return [(CONFIG.icons) ? "build:icons" : "build:images"];
})(), () => {
  console.log(`Project: ${packageJSON.name} app v${packageJSON.version} build"up done....`);
});

/**
 * Build your project and put it into archive
 */
gulp.task("zipbuild", ["build"], function() {
	return gulp.src(p(CONFIG.build, "/**/*"))
		.pipe(zip(CONFIG.fileName.replace("$d", (new Date()).getTime())))
		.pipe(gulp.dest(BASE));
});

// Development section
// ==================================================================
/**
 * Generate CSS out of .scss files /w sourcemaps in target location
 */
gulp.task("compass:dev", () => {
  if (!CONFIG.sass) return console.log("To enable Compass/SASS compilation define source folder first in CONFIG line 21");
  // Fix sass function images directory misspath
  // For some reason ignoring config.rb file
  return gulp.src(p(CONFIG.sass, "**/*.scss"))
    .pipe(sass({
      precision: 3,
      outputStyle: "expaned"
    }).on("error", sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(p(CONFIG.css)));
});

/**
 * Generate Single sprite out of bunch SVG files in target location
 */
gulp.task("icons:dev", () => {
  if (!CONFIG.icons) return console.log("To run icons task - define their location first in CONFIG line 26");
  return gulp.src(p(CONFIG.icons, "**/*.svg"))
    .pipe(cheerio({
			run ($) {
				$("[fill]").removeAttr("fill");
				$("[style]").removeAttr("style");
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
 */
gulp.task("babel:dev", () => {
  if (!CONFIG.es6) return console.log("To enable ES6 translation define source folder first in CONFIG line 18");
  return browserify({
      entries: p(CONFIG.es6, CONFIG.jsRoot),
      debug: true
    })
    .transform("babelify", {
        presets: ["react", "es2015", "stage-0", "stage-1"],
        plugins: ["babel-plugin-transform-es2015-modules-umd"]
    })
    .bundle()
    .pipe(source(p(CONFIG.jsRoot)))
    .pipe(buffer())
    .pipe(gulp.dest(p(CONFIG.js)));
});

/**
 * Default task for development - runs server with livereload also watches all required
 * files and folders for changes
 */
gulp.task("default", ((deps)=>{
  if (CONFIG.es6) deps.push("babel:dev");
  if (CONFIG.icons) deps.push("icons:dev");
  return deps;
})(["compass:dev"]), () => {

  // Really want to replace this ugly array with one unique selector
  // "**/*.{js,html,css}" this dosen"t work but should
  // "*.{js,html,css}" this works but only on base folder, no affect on inner ones
  var watch = [
    p(CONFIG.img, "**/*.*"),
    p(CONFIG.fonts, "**/*.*"),
    p(CONFIG.css, "**/*.css"),
    p(CONFIG.js, "**/*.js"),
    p("*.html"),
    "!node_modules"
  ];
  var statics = {
    "/css": p(CONFIG.css),
    "/img": p(CONFIG.img),
    "/js": p(CONFIG.js)
  };

  // If templates enabled add them to static resources and to watch pool
  if (CONFIG.templates) {
    watch.push(p(CONFIG.templates, "**/*.html"));
    statics["/templates"] = p(CONFIG.templates);
  }
  if (CONFIG.es6) {
    statics["/src"] = p(CONFIG.es6);
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
   gulp.watch([p(CONFIG.es6), p(CONFIG.es6, "**/*.js")], ["babel:dev"]);
  }
  if (CONFIG.icons) {
    gulp.watch([p(CONFIG.icons), p(CONFIG.icons, "**/*.svg")], ["icons:dev"]);
  }
  gulp.watch([p(CONFIG.sass), p(CONFIG.sass, "**/*.scss")], ["compass:dev"]);
  gulp.watch(watch).on("change", reload);
});