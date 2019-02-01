const { series } = require('gulp');
const log = require('fancy-log');
const del = require('del');

function clean() {
  return del([
    'build/'
  ]);
}

function build(cb) {
  cb();
}

exports.default = series(clean, build);
