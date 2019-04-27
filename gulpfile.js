const gulp = require('gulp');
const gutil = require('gulp-util');
//const electron = require('electron-connect').server.create();
const sass = require('gulp-sass');

gulp.task('sass', function() {
    //gulp.watch('src/scss/*.scss', gulp.series('sass'));
    return (
        gulp
            .src('src/scss/*.scss')

        // Use sass with the files found, and log any errors
            .pipe(sass.sync().on('error', sass.logError))

        // What is the destination for the compiled file?
            .pipe(gulp.dest('src/css'))
    );
});

gulp.task('serve', function() {
    // Start browser process
    //electron.start();

    // Restart browser process
    //gulp.watch('index.js', electron.restart);

    // Reload renderer process
    gulp.watch('src/scss/*.scss', gulp.series('sass'));

    //gulp.watch(['src/css/*.css'], electron.reload);
});
