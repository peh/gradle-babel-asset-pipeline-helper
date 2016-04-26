var webpack = require('webpack');
var requireErrorHandlerPlugin = require('require-error-handler-webpack-plugin');
var path = require('path');

var scriptArgs = require('minimist')(process.argv.slice(2));

var entry = scriptArgs.entry;
var output = scriptArgs.output;

var configLocation = scriptArgs.config;
var config;

if (configLocation) {
    config = require(configLocation)
} else {
    config = buildConfig(entry, output);
}

config.bail = true;
webpack(config, function (err, stats) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        process.exit(0);
    }
});

function buildConfig(entry, output) {
	var dirName = path.dirname(output)
	var fileName = path.basename(output)
    return {
        entry: entry,
        output: {
            filename: fileName,
            path: dirName,
        },
        module: {
            loaders: [{
                test: /\.(js|jsx|es6)?$/,
                exclude: /(node_modules|vendor)/,
                loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react']
            }]
        },
        plugins: [
            new requireErrorHandlerPlugin.RequireEnsureErrorHandlerPlugin(),
            new requireErrorHandlerPlugin.AMDRequireErrorHandlerPlugin()
        ]
    };
};