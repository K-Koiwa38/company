'use strict';

 /*
src 参照元
dest 出力先
watch 監視
series 直列処理
parallel 並列処理
*/
const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const ssi = require('browsersync-ssi');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const imageminJpg = require('imagemin-mozjpeg');
const imageminPng = require('imagemin-pngquant');
const imageminGif = require('imagemin-gifsicle');
const svgmin = require('gulp-svgmin');
const webp = require('gulp-webp');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const paths = {
    srcDir: '_dev',
    dstDir: 'src'
};

// sass
const scssTask = (done) => {
    src('./_dev/scss/**/**.scss', { base: './_dev/scss', sourcemaps: true /* init */ })
    .pipe(plumber({
        errorHandler: notify.onError({
            title: "ERROR!!!!!!!",
            message: "<%= error.message %>"
        })
    }))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) //expanded
    .pipe(dest('./src/common/css', { sourcemaps: './map' /* write */ }));
    done();
}

// local server
const browserSyncTask = (done) => {
    browserSync.init({
        server: {
            baseDir: './src',
            middleware: ssi({
                baseDir: __dirname + '/src',
                ext: '.html',
                version: '1.4.0'
            })
        },
        https: true,
        port: 8000,
        ui: { port: 8001 } // 管理コンソールのポート番号
    });
    done();
}

// reload
const browsersyncReload = (done) => {
    browserSync.reload();
    done();
}

// imagemin
const imageMinTask = (done) => {
    const minSrcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
    let dstGlob = paths.dstDir;

    src(minSrcGlob, { base: '_dev/images/' })
    .pipe(changed(dstGlob))
    .pipe(imagemin([
        imageminPng({
            quality: [.8, .9]
        }),
        imageminJpg({
            quality: 85
            // progressive: true
        }),
        imageminGif({
            interlaced: false,
            optimizationLevel: 3, //1 to 3
            colors: 180
        })
    ]))
    .pipe(dest(dstGlob));
    done();
}

// svg min
const svgMinTask = (done) => {
    const svgSrcGlob = paths.srcDir + '/**/*.+(svg)';
    let dstGlob = paths.dstDir;

    src(svgSrcGlob, { base: '_dev/images/' })
    .pipe(changed(dstGlob))
    .pipe(svgmin())
    .pipe(dest(dstGlob));
    done();
}

// Webp生成
const webpTask = (done) => {
    const webpSrcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
    let dstGlob = paths.dstDir;

    src(webpSrcGlob, { base: '_dev/images/' })
    .pipe(changed(dstGlob))
    // 拡張子を残した状態でリネーム
    .pipe(rename(function(path) {
        path.basename += path.extname;
    }))
    .pipe(webp())
    .pipe(dest(dstGlob));
    done();
}

// watch file
const watchTask = () => {
    watch([
        './src/**/*.html',
        './src/**/*.css',
        './src/**/*.js'
    ], browsersyncReload);
    watch('./_dev/scss/**/*.scss', series(parallel(scssTask, browsersyncReload, imageMinTask, svgMinTask, webpTask)));
}

// 実行
exports.default = series(
    scssTask,
    browserSyncTask,
    imageMinTask,
    svgMinTask,
    webpTask,
    watchTask
);
