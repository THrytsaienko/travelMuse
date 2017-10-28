const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const del = require('del');
const usemin = require('gulp-usemin');
const rev = require('gulp-rev');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');

// Compile Sass & Inject Into Browser
gulp.task('sass', function () {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', './app/src/scss/*.scss'])
        .pipe(sass())
        .on('error', function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end');
        })
        .pipe(autoprefixer({
            browsers: 'last 4 versions',
            cascade: false
        }))
        .pipe(gulp.dest('./app/src/css'))
        .pipe(browserSync.stream());
});

// Move JS Files to src/js  
gulp.task('js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest('./app/src/js'))
        .pipe(browserSync.stream());
});

// Watch Sass & Server
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: "./app"
    });
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("./app/*.html").on('change', browserSync.reload);
});

// Move Fonts Folder to src
gulp.task('fonts', function () {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest("./app/src/fonts"));
});

// Move Font Awesome CSS to src/css
gulp.task('fa', function () {
    return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest("./app/src/css"));
});

gulp.task('default', ['js', 'serve', 'fa', 'fonts']);




gulp.task('previewDocs', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "docs"
        }
    });
});

gulp.task('deleteDocsFolder', function () {
    return del("./docs");
});

gulp.task('copyGeneralFiles', ['deleteDocsFolder'], function () {
    var pathsToCopy = [
        './app/src/**/*',
        '!./app/src/img',
        '!./app/src/img/**',
        '!./app/src/css',
        '!./app/src/css/**',
        '!./app/src/scss',
        '!./app/src/scss/**'
    ]
    return gulp.src(pathsToCopy)
        .pipe(gulp.dest("./docs/src"));
});

gulp.task('optimizeImages', ['deleteDocsFolder'], function () {
    return gulp.src('./app/src/img/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest("./docs/src/img"));
});

gulp.task('useminTrigger', ['deleteDocsFolder'], function () {
    gulp.start("usemin");
});

gulp.task('usemin', ['sass'], function () {
    return gulp.src("./app/*.html")
        .pipe(usemin({
            css: [function () {
                return rev()
            }, function () {
                return cssnano()
            }]
        }))
        .pipe(gulp.dest("./docs"));
});

gulp.task('build', ['deleteDocsFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);