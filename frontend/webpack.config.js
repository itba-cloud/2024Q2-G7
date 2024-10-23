const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ],
    module: {
        rules: [
            {
                "test": /\.(png|jpe?g|gif|svg)$/i,
                "type": "asset/resource",
            },
            {
                "test" : /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: [
            ".js",
            ".jsx",
            ".tsx",
            ".css",
            ".scss",
            ".gif",
            ".png",
            ".jpg",
            ".jpeg",
            ".svg",
        ],
    },
};