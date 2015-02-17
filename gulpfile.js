// for dev
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var src = './ripsaw-store.js'

gulp.task('lint', function() {
  return gulp.src(src)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(src, ['lint-']);
});

gulp.task('default', ['lint', 'watch']);
