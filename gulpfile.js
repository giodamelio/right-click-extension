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
    watch: false,
    logLevel: 1
  };
  const bundler = new Parcel('src/background.js', options);

  return bundler.bundle();
}

function buildContentScript() {
  const options = {
    outDir: './build',
    watch: false,
    logLevel: 1
  };
  const bundler = new Parcel('src/content_script.js', options);

  return bundler.bundle();
}

function buildOptions() {
  const options = {
    outDir: './build/options',
    publicUrl: './',
    watch: false,
    logLevel: 1
  };
  const bundler = new Parcel('src/options/options.html', options);

  return bundler.bundle();
}

function buildManifest() {
  return src('src/manifest.json').pipe(dest('build/'));
}

exports.default = series(
  clean,
  series(buildBackground, buildContentScript, buildManifest, buildOptions)
);
exports.build = series(
  buildBackground,
  buildContentScript,
  buildManifest,
  buildOptions
);
