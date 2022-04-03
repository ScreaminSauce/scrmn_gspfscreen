'use strict';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

class GuiBuilder {
    constructor(outputFolder) {
        this._config = {
            mode: "production",
            entry: {
                'scrmn_gspfscreen_admin': path.resolve(__dirname, "src/admin.js"),
                'scrmn_gspfscreen_display': path.resolve(__dirname, "src/display.js")
            },
            output: {
                filename: '[name].js',
                path: path.resolve(outputFolder)
            },
            devtool: "source-map",
            module: {
                rules: [{
                    test: /\.s[c|a]ss$/,
                    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }]
            },
            plugins: [
                new CleanWebpackPlugin(),
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: path.resolve(__dirname + '/static' ) + '/**',
                            context: path.resolve(__dirname + '/static')
                        }
                    ]
                }),
                new MiniCssExtractPlugin()
            ]
        }
    }

    getAppInfo(){
        return [{
            urlPath: "/public/gspfscreen/admin.html",
            icon: '/public/gspfscreen/images/gspflogosm.jpg',
            regName: "gspfscreen-admin",
            displayName: "GSPF Screen Admin",
            description: "The admin application for the display screens at the GSPF"
        },{
            urlPath: "/public/gspfscreen/display.html",
            icon: '/public/gspfscreen/images/screenDisplay.png',
            regName: "gspfscreen-display",
            displayName: "GSPF Screen Display",
            description: "A quick way to preview the TV Screen content"
        }]
    }

    build(logger) {
        return new Promise((resolve, reject) => {
            webpack([this._config], (err, stats) => {
                if (stats && stats.hasErrors()){
                    let info = stats.toJson();
                    info.errors.forEach((sError) => {
                        logger.error(JSON.stringify(sError, null, 2));
                    })
                    logger.error(err);
                }
                if (err) {
                    logger.error(err);
                    reject(err);
                } else {
                    logger.info({module: "manualtest"}, "Webpack build complete for module.")
                    resolve();
                }
            });
        })
    }
}

module.exports = {
    name: "gspfscreen",
    type: "gui",
    gui: GuiBuilder
};