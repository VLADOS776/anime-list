const gulp = require('gulp'),
    sass = require('gulp-sass'),
    vueify = require('gulp-vueify');

gulp.task('vueify', function() {
    return gulp.src('./src/**/*.vue')
        .pipe(vueify().on('error', console.error))
        .pipe(gulp.dest('./public'))
})

gulp.task('sass', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.vue'], ['vueify'])
    gulp.watch('./src/scss/*.scss', ['sass'])
})

gulp.task('default', ['vueify', 'sass', 'watch']);