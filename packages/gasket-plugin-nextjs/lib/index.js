const { name } = require('../package.json');
const apmTransaction = require('./apm-transaction');
const configure = require('./configure');
const metadata = require('./metadata');
const configure = require('./configure');
const prompt = require('./prompt');
const create = require('./create');
const { webpackConfig } = require('./webpack-config');
const middleware = require('./middleware');
const express = require('./express');
const fastify = require('./fastify');
const build = require('./build');
const workbox = require('./workbox');

/** @type {import('@gasket/engine').Plugin} */
const plugin = {
  dependencies: ['@gasket/plugin-webpack'],
  name,
  hooks: {
    configure,
    webpackConfig,
    actions(gasket) {
      return {
        getNextConfig(nextConfig) {
          return async function setupNextConfig(phase, { defaultConfig }) {
            let baseConfig;
            if (nextConfig instanceof Function) {
              baseConfig = await nextConfig(phase, { defaultConfig });
            } else {
              baseConfig = nextConfig ?? {};
            }
            return createConfig(gasket, phase === 'phase-production-build', baseConfig);
          };
        }
      };
    },
    prompt,
    create,
    middleware,
    express,
    fastify,
    apmTransaction,
    build,
    workbox,
    metadata
  }
};

module.exports = plugin;
