const path = require('path');
const FilterBox = require('@warp-works/warpjs-filter-box');
const warpjsUtils = require('@warp-works/warpjs-utils');
const webpack = require('webpack');
const WebpackVisualizer = require('webpack-visualizer-plugin');

const constants = require('./../../server/edition/constants');
const rootDir = path.dirname(require.resolve('./../../package.json'));

module.exports = {
    build: {
        target: 'web',
        devtool: 'source-map',
        entry: {
            [constants.entryPoints.domains]: './client/edition/domains/index.js',
            [constants.entryPoints.domain]: './client/edition/domain/index.js',
            [constants.entryPoints.domainTypes]: './client/edition/domain-types/index.js',
            [constants.entryPoints.instances]: './client/edition/instances/index.js',
            [constants.entryPoints.instance]: './client/edition/instance/index.js',
            [constants.entryPoints.orphans]: './client/edition/orphans/index.js',
            [constants.entryPoints.portal]: './client/portal/instance/index.js'
        },
        externals: {
            jquery: true,
            tinymce: true
        },
        node: {
            fs: 'empty',
            tinymce: 'empty'
        },
        output: {
            path: `${rootDir}/public/app`,
            filename: '[name].min.js'
        },
        plugins: [
            new WebpackVisualizer(),
            new webpack.optimize.CommonsChunkPlugin({
                names: 'vendor',
                minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: false,
                output: {
                    ascii_only: true
                }
            })
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    query: {
                        helperDirs: [
                            warpjsUtils.getHandlebarsHelpersDir()
                        ],
                        partialDirs: [
                            path.join(rootDir, 'client', 'partials'),
                            warpjsUtils.getHandlebarsPartialsDir(),
                            FilterBox.templatesDir
                        ]
                    }
                }
            ]
        }
    }
};
