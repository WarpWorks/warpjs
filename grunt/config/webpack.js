const path = require('path');
const webpack = require('webpack');

const rootDir = path.dirname(require.resolve('./../../package.json'));

module.exports = {
    build: {
        target: 'web',
        devtool: 'source-map',
        entry: {
            'admin-domain': './client/admin/domain/index.js',
            'content': './client/content/index.js',
            'domains': './client/content/domains/index.js',
            'domain-types': './client/content/domain-types/index.js',
            'entities': './client/content/entities/index.js',
            'entity': './client/content/entity/index.js',
            'portal': './client/portal/entity/lib/index.js'
        },
        node: {
            fs: 'empty'
        },
        output: {
            path: `${rootDir}/public/app`,
            filename: '[name].js'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: 'vendor',
                minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: false
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
                            `${rootDir}/client/helpers`
                        ]
                    }
                }
            ]
        }
    }
};
