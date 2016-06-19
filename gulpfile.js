var jade = require('gulp-jade');
 
gulp.task('index_jade', function() {
  var YOUR_LOCALS = {};
 
  gulp.src('./study_html/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});