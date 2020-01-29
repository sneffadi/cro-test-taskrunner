var gulp = require("gulp");
const sass = require('gulp-sass');
var babel = require("gulp-babel");
var watch = require('gulp-watch');

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

gulp.task('watch', function(){
  process.chdir(process.env.INIT_CWD);
  gulp.watch('*.scss', gulp.task('sass-single'));
});

gulp.task('default', gulp.series('sass-single', 'babels'));