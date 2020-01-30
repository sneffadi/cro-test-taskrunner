'use strict'

var gulp = require("gulp");
const sass = require('gulp-sass');
var babel = require("gulp-babel");
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

/** FTP Configuration **/
var user = process.env.FTP_USER
var password = process.env.FTP_PWD
var host = ''
var port = 21
var localFilesGlob = ['./**']
var remoteFolder = '' + process.env.TEST_PATH

// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
  return ftp.create({
    host: host,
    port: port,
    user: user,
    password: password,
    parallel: 5,
    log: gutil.log,
  })
}

gulp.task('styles', () => {
    return gulp.src('*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

gulp.task('clean', () => {
    return del([
        'css/main.css',
    ]);
});

/* compresses scss file in whatever folder you're in on the terminal */
gulp.task('sass-single', function () {
      process.chdir(process.env.INIT_CWD);

      // Where are the SCSS files?
      var input = '*.scss';

      // Where do you want to save the compiles CSS file?
      var output = './dist';

      return gulp
        .src(input)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(output));
    });

 gulp.series(['clean', 'styles']);

gulp.task("babels", function () {
  process.chdir(process.env.INIT_CWD);
  return gulp.src("app.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

/* watches for scss changes */
gulp.task('watch', function(){
  process.chdir(process.env.INIT_CWD);
  gulp.watch('*.scss', gulp.task('sass-single'));
});

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd TEST_PATH=filepath gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function() {
  process.chdir(process.env.INIT_CWD);
  var conn = getFtpConnection()

  return gulp
    .src(localFilesGlob, { base: '.', buffer: false })
    .pipe(conn.newer(remoteFolder)) // only upload newer files
    .pipe(conn.dest(remoteFolder))
});

/*  */
gulp.task('default', gulp.series('sass-single', 'babels'));

