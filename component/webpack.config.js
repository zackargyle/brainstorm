const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: "source-map",
    entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://0.0.0.0:3000',
        path.join(__dirname, 'src') + '/index.js'
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },{
                test: /\.scss?$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css')
    ],
};
