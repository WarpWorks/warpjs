const path = require('path');
const warpjsUtils = require('@warp-works/warpjs-utils');
const webpack = require('webpack');
const WebpackVisualizer = require('webpack-visualizer-plugin');

const rootDir = path.dirname(require.resolve('./../../package.json'));

module.exports = {
    build: {
        target: 'web',
        devtool: 'source-map',
        entry: {
            'admin-domain': './client/admin/domain/index.js',
            'domains': './client/content/domains/index.js',
            'domain': './client/content/domain/index.js',
            'domain-types': './client/content/domain-types/index.js',
            'instances': './client/content/instances/index.js',
            'entity': './client/content/entity/index.js',
            'portal': './client/portal/entity/lib/index.js'
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
                            warpjsUtils.getHandlebarsPartialsDir()
                        ]
                    }
                }
            ]
        }
    }
};
