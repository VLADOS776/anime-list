const gulp = require('gulp'),
    vueify = require('gulp-vueify');

gulp.task('vueify', function() {
    return gulp.src('./src/**/*.vue')
        .pipe(vueify().on('error', console.log))
        .pipe(gulp.dest('./public'))
})

gulp.task('watch', function() {
    return gulp.watch(['./src/**/*.vue'], ['vueify'])
})

gulp.task('default', ['vueify', 'watch']);