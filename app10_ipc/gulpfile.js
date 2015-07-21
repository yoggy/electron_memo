// see also... https://www.npmjs.com/package/electron-connect

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {
  electron.start();
  gulp.watch('app.js', electron.restart);
  gulp.watch(['index.js', 'index.html'], electron.reload);
});

gulp.task('default', ['serve']);
