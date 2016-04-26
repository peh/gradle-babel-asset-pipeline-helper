var path = require('path');
var webpack = require('webpack');

var requireErrorHandlerPlugin = require('require-error-handler-webpack-plugin');
var scriptArgs = require('minimist')(process.argv.slice(2));

var entry = scriptArgs.entry;
var listenPort = scriptArgs.port;
var outName = scriptArgs.outName;

var configLocation = scriptArgs.config;
var config

if(configLocation) {
    config = require(configLocation)
} else {
    config = buildConfig(entry, outName, listenPort);
}
var WebpackDevServer = require("webpack-dev-server");

config.devtool = 'eval-cheap-module-source-map';
config.debug = true;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: 'errors-only'
}).listen(listenPort, 'localhost', function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log('Listening at http://localhost:' + listenPort + '/');
});


function buildConfig(entry, outName, listenPort) {
    return {
        entry: [
            'webpack-dev-server/client?http://0.0.0.0:' + listenPort,
            'webpack/hot/only-dev-server',
            entry
        ],
        output: {
            filename: outName,
            path: path.join(__dirname),
            publicPath: 'http://localhost:' + listenPort + '/' // as we are serving the app over port 8080 we have to hardcode the complete url here
        },
        module: {
            loaders: [{
                test: /\.(js|jsx|es6)?$/,
                exclude: /(node_modules|vendor)/,
                loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react']
            }]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new requireErrorHandlerPlugin.RequireEnsureErrorHandlerPlugin(),
            new requireErrorHandlerPlugin.AMDRequireErrorHandlerPlugin(),
        ]
    };
};