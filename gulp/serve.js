const browserSync = require('browser-sync').create();
const path = require('path');

module.exports = (name, BASE, watch) => browserSync.init({
  port: 3000,
  open: true,
  online: true,
  notify: false,
  logLevel: 'info',
  logPrefix: name,
  logConnections: true,
  logFileChanges: true,
  server: { baseDir: BASE },
  files: watch.map((p) => path.join(BASE, p)),
  middleware: [
    (req, res, next) => {
     if (req.url.indexOf('.') < 0) req.url = '/index.html';
     next();
   }
  ],
  watchOptions: {
    ignored: /node_modules/
  }
});