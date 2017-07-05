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
