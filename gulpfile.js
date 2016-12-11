// var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var revAll = require('gulp-rev-all');
var replaceAssets = require('gulp-replace-assets');
var fs = require('fs');

var rootBuild = './dist';

gulp.task('clean', function(cb) {
  return del([rootBuild], cb);
});

gulp.task('common-js', ['clean'], function() {
  return gulp.src(['node_modules/react/dist/react.min.js', 'node_modules/react/dist/react-with-addons.min.js', 'node_modules/react-dom/dist/react-dom.min.js'])
            .pipe(gulp.dest(rootBuild + '/client/common'));
});

gulp.task('common-img', ['clean'], function() {
  return gulp.src('src/client/app/imgs/**/*')
            .pipe(gulp.dest(rootBuild + '/client/imgs'));
});

gulp.task('common-lib', ['clean'], function() {
  return gulp.src(['libs/**/*.js'])
            .pipe(gulp.dest(rootBuild + '/client/libs'));
});
// json测试
gulp.task('common-json', ['clean'], function() {
  return gulp.src(['src/etc/index.json'])
            .pipe(gulp.dest(rootBuild + '/client'));
});

gulp.task('adjustCssPath', ['copyViews2Server'], function() {
  return gulp.src(['dist/server/static/**/*.css'])
        .pipe(replaceAssets({ '/static/imgs': 'static/imgs' }))
        .pipe(gulp.dest(rootBuild + '/server/static'))
});

gulp.task('copyViews2Server', ['browser', 'copyPublic2server'], function() {
  var manifest = fs.readFileSync(rootBuild + '/server/static/rev-manifest.json');
  return gulp.src(['src/server/views/**/*.pug'])
        .pipe(replaceAssets(JSON.parse(manifest)))
        .pipe(gulp.dest(rootBuild + '/server/views'))
});

gulp.task('copyPublic2server', ['browser'], function() {
  return gulp.src(['dist/client/**/*'])
            .pipe(revAll.revision({ dontGlobal: ['png', 'jpg', 'swf'] }))
            .pipe(gulp.dest(rootBuild + '/server/static'))
            .pipe(revAll.manifestFile())
            .pipe(gulp.dest(rootBuild + '/server/static'))
});

var webpack = require('gulp-webpack');
var webpackBrowserConfig = require('./webpack.production.browser.config.js');
gulp.task('browser', ['clean', 'common-js', 'common-img', 'common-lib'], function() {
  return gulp.src('./src/client/app/index')
        .pipe(webpack(webpackBrowserConfig))
        .pipe(gulp.dest('dist/client/'));
});

var webpackServerConfig = require('./webpack.production.server.config.js');
gulp.task('server', ['browser', 'copyPublic2server', 'copyViews2Server', 'adjustCssPath'], function() {
  return gulp.src('./src/server/index')
        .pipe(webpack(webpackServerConfig))
        .pipe(gulp.dest('dist/server/'));
});

gulp.task('production', ['browser', 'server']);
gulp.task('default', ['clean', 'common-js', 'common-img', 'common-lib','common-json']);