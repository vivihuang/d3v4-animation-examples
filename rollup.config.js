import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const pkg = require('./package.json')
const external = Object.keys(pkg.devDependencies)

export default {
  entry: 'index.js',
  // sourceMap: true,
  format: 'iife',
  plugins: [
    babel(babelrc()),
    globals(),
    builtins(),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js']
    }),
    commonjs(),
    json()
  ],
  external,
  dest: pkg.main,
  acorn: {
    allowReserved: true
  }
};
