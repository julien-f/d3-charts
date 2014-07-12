'use strict';

//====================================================================

var gulp = require('gulp');

// All plugins are loaded (on demand) by gulp-load-plugins.
var $ = require('gulp-load-plugins')();

//====================================================================

var DIST_DIR = __dirname +'/dist';
var SRC_DIR = __dirname;

//--------------------------------------------------------------------

// Browserify plugin for gulp.js.
var browserify = function (path, opts) {
  opts || (opts = {});

  var bundler = require('browserify')({
    entries: [path],
    extensions: opts.extensions,
  });
  if (opts.transforms)
  {
    [].concat(opts.transforms).forEach(function (transform) {
      bundler.transform(transform);
    });
  }

  // Append the extension if necessary.
  if (!/\.js$/.test(path))
  {
    path += '.js';
  }
  var file = new (require('vinyl'))({
    base: opts.base,
    path: require('path').resolve(path),
  });

  var stream = new require('stream').Readable({
    objectMode: true,
  });

  var bundle = bundler.bundle.bind(bundler, {
    debug: opts.debug,
    standalone: opts.standalone,
  }, function (error, bundle) {
    if (error)
    {
      console.warn(error);
      return;
    }

    file.contents = new Buffer(bundle);
    stream.push(file);

    stream.push(null);
  });

  stream._read = function () {
    // Ignore subsequent reads.
    stream._read = function () {};

    // Register for updates (does nothing if we are not using
    // Browserify, in production).
    bundler.on('update', bundle);

    bundle();
  };
  return stream;
};

// Combine multiple streams together and can be handled as a single
// stream.
var combine = function () {
  // `event-stream` is required only when necessary to maximize
  // performance.
  combine = require('event-stream').pipe;
  return combine.apply(this, arguments);
};

// Merge multiple readble streams into a single one.
var merge = function () {
  // `event-stream` is required only when necessary to maximize
  // performance.
  merge = require('event-stream').merge;
  return merge.apply(this, arguments);
};

// Create a noop duplex stream.
var noop = function () {
  var PassThrough = require('stream').PassThrough;

  noop = function () {
    return new PassThrough({
      objectMode: true
    });
  };

  return noop.apply(this, arguments);
};

// Similar to `gulp.src()` but the pattern is relative to `SRC_DIR`
// and files are automatically watched when not in production mode.
var src = function (pattern) {
  return gulp.src(pattern, {
    base: SRC_DIR,
    cwd: SRC_DIR,
  });
};

// Similar to `gulp.dst()` but the output directory is always
// `DIST_DIR` and files are automatically live-reloaded when not in
// production mode.
var dest = function () {
  return gulp.dest(DIST_DIR);
};

//====================================================================

gulp.task('build', function () {
  return browserify(SRC_DIR +'/index.js', {
    base: SRC_DIR,
    debug: true,
    standalone: 'd3-charts',
  })
    // .pipe($.uglify())
    .pipe(dest())
  ;
});


//--------------------------------------------------------------------

gulp.task('check', function () {
  return src('*.js')
    .pipe($.jsvalidate())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
  ;
});

gulp.task('clean', function () {
  require('fs').unlinkSync(DIST_DIR +'/d3-charts.js');
});

gulp.task('test', function () {
  return src('*.spec.js')
    .pipe($.mocha({
      reporter: 'spec'
    }))
  ;
});

//------------------------------------------------------------------------------

gulp.task('default', ['build']);
