const {src, dest, watch, parallel, series} = require('gulp'),
    scss = require('gulp-sass'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    terser = require('gulp-terser'),
    autoprefixer = require('autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    postcss = require('gulp-postcss');

function browser() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    });
}

function scripts() {
    return src('src/js/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(terser({toplevel: true}))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

function assets() {
    src('src/assets/fonts/*.*')
        .pipe(dest('dist/assets/fonts'));
    src('src/assets/icons/*.*')
        .pipe(dest('dist/assets/icons'));
    src('src/assets/img/*.*')
        .pipe(dest('dist/assets/img'));
    return src('src/index.html')
        .pipe(dest('dist'));

}

function styles() {
    return src(['node_modules/normalize.css/normalize.css', 'src/assets/sass/**/*.scss'])
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(concat('style.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['src/js/**/*.js'], scripts);
    watch(['src/assets/sass/**/*.scss'], styles);
    watch(['src/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
    return del('dist');
}

function build() {
    src('src/js/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(terser({toplevel: true}))
        .pipe(dest('dist/js'));
    src(['node_modules/normalize.css/normalize.css', 'src/assets/sass/**/*.scss'])
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(concat('style.min.css'))
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('dist/css'));
    src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist/'));
    src('src/assets/fonts/*.*')
        .pipe(dest('dist/assets/fonts'));
    src('src/assets/icons/*.*')
        .pipe(dest('dist/assets/icons'));
    return src('src/assets/img/*.*')
        .pipe(dest('dist/assets/img'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.assets = assets;
exports.watching = watching;
exports.browser = browser;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build);
exports.default = series(cleanDist, parallel(assets, styles, scripts, browser, watching));