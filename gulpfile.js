var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var plumber = require('gulp-plumber')
var less = require('gulp-less')
var minifyCss = require('gulp-minify-css')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

var options = {
  DEST: './ui-build',
  APP_ENTRY: 'ui/assets/js/app.js',
  LESS: [
    'ui/assets/less/*.less'
  ],
  HTML: [
    'ui/**/*.html'
  ]
}

var bundle = function bundle() {
  var b = browserify(watchify.args)
  b.add(options.APP_ENTRY)
  b.transform(babelify)
  b.bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(options.DEST + '/assets/js'))

  return b
}

gulp.task('bundle', bundle)

gulp.task('watch-bundle', function() {
  var w = watchify(bundle())

  // Watch and rebundle
  w.on('update', function() {
    w.bundle()
      .pipe(source('app.min.js'))
      .pipe(buffer())
      .pipe(gulp.dest(options.DEST + '/assets/js'))
  })
  w.on('log', function(msg) {
    console.log(msg)
  })

  return w
})

gulp.task('less', function() {
  gulp.src(options.LESS)
    .pipe(plumber())
    .pipe(less())
    .pipe(minifyCss({
      compatibility: 'ie8'
    }))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest(options.DEST + '/assets/css'))
})

gulp.task('html', function() {
  gulp.src('ui/**/*.html')
    .pipe(gulp.dest(options.DEST))
})

gulp.task('watch-less', function() {
  gulp.watch(options.LESS, ['less'])
})

gulp.task('watch-html', function() {
  gulp.watch(options.HTML, ['html'])
})

gulp.task('build', ['html', 'less', 'bundle'])
gulp.task('watch', ['build', 'watch-bundle', 'watch-less', 'watch-html'])
gulp.task('default', ['build'])
