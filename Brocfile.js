const funnel = require('broccoli-funnel');
const merge = require('broccoli-merge-trees');
const sass = require('broccoli-sass-source-maps');
const babel = require('broccoli-babel-transpiler');
const rollup = require('broccoli-rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const imagemin = require('broccoli-imagemin');
const resize = require('broccoli-image-resize');
const reload = require('broccoli-livereload');

const appRoot = 'sources';
const isSourceMapEnabled = false;
const imageQuality = 90;

let optimizeImages = (node) => {
  return new imagemin(node, {
    plugins: [
      require('imagemin-jpegoptim')({ max: imageQuality }),
      require('imagemin-svgo')({ plugins: [{ cleanupIDs: false }] }),
    ]
  });
};

const fonts = new funnel(`${appRoot}/fonts`, { destDir: 'assets/fonts' });
let images = new funnel(`${appRoot}/images`, { exclude: ['bgs', 'icons'], destDir: 'assets/images' });
images = optimizeImages(images);

let js = new rollup(`${appRoot}/js`, {
  inputFiles: ['**/*.js'],
  rollup: {
    input: 'app.js',
    output: {
      file: 'assets/js/app.js',
      format: 'es',
      sourcemap: isSourceMapEnabled,
    },
    plugins: [
      nodeResolve({
        jsnext: true,
        browser: true,
      }),
      commonjs({
        include: 'node_modules/**',
      }),
    ],
  }
});

js = new babel(js, {
  browserPolyfill: true,
  sourceMap: isSourceMapEnabled,
  presets: [
    ['env', {
      'targets': {
        'browsers': [
          'ie 11',
          'last 1 Chrome versions',
          'last 1 Firefox versions',
          'last 1 Safari versions'
        ]
      }
    }]
  ],
});

const css = new sass(
  [appRoot, 'node_modules/normalize-scss/sass'],
  'styles/app.scss',
  'assets/styles/app.css',
  {
    sourceMap: isSourceMapEnabled,
    sourceMapEmbed: false,
    sourceMapContents: false
  }
);

let app = new merge([
  js,
  css,
  fonts,
  images
]);

app = new reload(app, {
  target: /^\/.+$/
});

module.exports = app;
