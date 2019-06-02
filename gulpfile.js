let isProd = false;
const gulp = require('gulp'),
  fs = require('fs'),
  del = require('del'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  gutil = require('gulp-util'),
  babelify = require('babelify'),
  uglify = require('gulp-uglify'),
  streamify = require('gulp-streamify'),
  runSequence = require('run-sequence'),
  license = require('gulp-license'),
  replace = require('gulp-replace'),
  bump = require('gulp-bump'),
  shell = require('gulp-shell');
let version = null;

function createBundle(url) {
  return browserify({
    entries: [url],
    debug: !isProd
  }).transform(babelify, { presets: ['es2015'] });
}

function watchBundles() {
  const bundleKeys = Object.keys(bundles);
  const watch = null;
  const key = null;
  for (let b = 0; b < bundleKeys.length; b++) {
    key = bundleKeys[b];
    watch = watchify(bundles[key].bundle);
    watch.on('update', buildBundle.bind(this, key));
  }
}

function buildBundle(bundleName) {

  const job = bundles[bundleName];
  const bundle = job.bundle;
  const name = job.name;

  let b = bundle.bundle()
      .on('log', gutil.log.bind(gutil, 'Browserify Log'))
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(name));

  if (isProd) {
    b = b.pipe(streamify(uglify()));
  }

  return b.pipe(license('Apache', {
      organization: 'Google Inc. All rights reserved.'
    }))
    .pipe(replace(/@VERSION@/g, version))
    .pipe(gulp.dest('./dist/'))
}

const bundles = {
  'flip': {
    url: './src/flip.js',
    name: 'flip.js'
  }
};

/** Clean */
gulp.task('clean', function() {
  return del(['dist']);
});

/** Scripts */
gulp.task('scripts', function() {
  const bundleKeys = Object.keys(bundles);
  for (let b = 0; b < bundleKeys.length; b++) {
    buildBundle(bundleKeys[b]);
  }
})

/** Watches */
gulp.task('watch', function() {
  watchBundles();
});

gulp.task('getversion', function() {
  version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
});

/** Main tasks */

(function createBundles() {
  const bundleKeys = Object.keys(bundles);
  let key = null;
  for (let b = 0; b < bundleKeys.length; b++) {
    key = bundleKeys[b];
    bundles[key].bundle = createBundle(bundles[key].url);
  }
})();

gulp.task('bump', function() {
  return gulp.src('./package.json')
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
  isProd = true;
  return runSequence('clean', 'bump', 'getversion', 'scripts', 'docs');
});

gulp.task('docs', shell.task(
    ['./node_modules/jsdoc/jsdoc.js ./src/flip.js -d ./docs']));

gulp.task('dev', function() {
  return runSequence('clean', 'getversion', 'scripts', 'watch');
});