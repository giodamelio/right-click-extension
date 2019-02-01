const { series, src, dest } = require('gulp');
const log = require('fancy-log');
const del = require('del');
const Parcel = require('parcel-bundler');

function clean() {
  return del([
    'build/'
  ]);
}

function buildBackground() {
  const options = {
    outDir: './build',
    watch: false
  };
  const bundler = new Parcel('src/background.js', options);

  return bundler.bundle();
}

exports.default = series(clean, buildBackground);
