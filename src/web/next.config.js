const pipe = require ('ramda/src/pipe')
const withCss = require ('@zeit/next-css')
const withOffline = require ('next-offline')
const withTranspileModules = require ('next-transpile-modules')

const config = {
  distDir: '../../dist/app',
  transpileModules: ['toolbelt'],
}

module.exports = pipe (
  withOffline,
  withCss,
  withTranspileModules,
) (config)
