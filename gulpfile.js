const { series, src, dest, parallel } = require('gulp');
const log = require('fancy-log');
const del = require('del');
const Parcel = require('parcel-bundler');

function clean() {
  return del(['build/']);
}

function buildBackground() {
  const options = {
    outDir: './build',
    watch: false
  };
  const bundler = new Parcel('src/background.js', options);

  return bundler.bundle();
}

function buildManifest() {
  return src('src/manifest.json').pipe(dest('build/'));
}

exports.default = series(clean, parallel(buildBackground, buildManifest));
exports.build = parallel(buildBackground, buildManifest);
