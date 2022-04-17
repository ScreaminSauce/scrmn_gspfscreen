'use strict';
require('dotenv').config({path: "run-test/.env-test"});
const ScreaminServer = require('@screaminsauce/screaminserver');
const AuthModuleApi = require('@screaminsauce/scrmn_auth').api;
const AuthModuleGui = require('@screaminsauce/scrmn_auth').gui;
const GspfModuleApi = require("..").api;
const GspfModuleGui = require("..").gui;

const server = new ScreaminServer({
    name: 'gspfScreenTest',
    options: {
        port: 3000,
        host: 'localhost'
    },
    modules: [AuthModuleApi, AuthModuleGui, GspfModuleApi, GspfModuleGui],
    auth: {
        cookieDurationInMillis: 1000 * 60 * 60 * 24 * 30,
        secret: 'ThisIsATestSecretThisIsATestSecretThisIsATestSecret',
        cookieName: "screaminCookie",
        isSecure: false,
    },
    defaultGuiRoute: "/public/auth/login.html"
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

server.startup()
    .catch((err) => {
        console.log(err);
        console.log("Error starting system");
        process.exit(1);
    })