const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.ts',
    output: {
        filename: '[name].[hash:20].js',
        path: buildPath
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.(scss|css|sass)$/,
                // use: .extract({
                use: [
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpg|gif|obj|fbx|mtl|ttf|otf|eot|woff|woff2|svg|mp3|mp4|bmp|srt|exr|hdr)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[ext]',
                            limit: 2,
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            // Inject the ts bundle at the end of the body of the given template
            inject: 'body',
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: buildPath
        }),
     
    ]
};
