import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const dotenvError = dotenv.config().error

if (dotenvError) {
    throw dotenvError
}

let config;

const PRD = 'production';
const DEV = 'development';

// determine build env
let TARGET_ENV;
switch (process.env.npm_lifecycle_event) {
    case 'build':
        TARGET_ENV = PRD;
        break;
    case 'start':
    case 'dev':
    default:
        TARGET_ENV = DEV;
}

const isDev = TARGET_ENV == DEV;
const isPrd = TARGET_ENV == PRD;

const entryPath = './js/main.js';
const outputPath = path.join(__dirname, 'dist');
const outputFilename = isPrd ? '[name]-[hash].js' : '[name].js';
const port = '8080';

console.log(`Building for '${TARGET_ENV}'`);

const commonConfig = {
    output: {
        path: outputPath,
        filename: outputFilename,
    },

    resolve: {
        extensions: ['.js', '.elm', '.json', '.css'],
    },

    module: {
        noParse: /\.elm$/,
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
            },
            {
                test: /\.elm$/,
                exclude: [/elm-stuf/, /node_modules/],
                use: [
                    {
                        loader: 'elm-webpack-loader',
                        options: {
                            // verbose: true,
                            warn: true,
                            debug: true,
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: require('html-webpack-template'),
            appMountId: 'main',
            title: 'Elm Webpack',
        }),
    ],

};

if (isDev) {
    config = merge.smartStrategy({ 'module.loaders.use': 'prepend' })(commonConfig, {
        entry: [
            `webpack-dev-server/client?http://localhost:${port}`,
            entryPath,
        ],
        devServer: {
            stats: 'errors-only',
            historyApiFallback: true,
            contentBase: './src',
            hot: true,
            port: port,
            overlay: {
                errors: true,
                warnings: true,
            }
        },
        module: {
            loaders: [
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuf/, /node_modules/],
                    use: ['elm-hot-loader'],
                }
            ]
        },
        plugins: [
            new CaseSensitivePathsPlugin(),
        ]
    });
}

if (isPrd) {
    config = merge(commonConfig, {
        entry: entryPath,
    });
}

export default config;
