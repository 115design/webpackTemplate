var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
// var tinypng = require('gulp-tinypng-compress');
 
// 画像圧縮処理
gulp.task('imagemin', function() {
    gulp.src('./dist/img/**/*.+(jpg|jpeg|png|gif|svg)')
      .pipe(imagemin({
          progressive: true,
          use: [pngquant({quality: '65-80', speed: 1})]
      }))
      .pipe(gulp.dest('./img/'));
    // gulp.src('img/**/*.{png,jpg,jpeg}')
    //   .pipe(tinypng({
    //     key: '',
    //     log: true,
    //     sameDest: true
    //   }));
});
