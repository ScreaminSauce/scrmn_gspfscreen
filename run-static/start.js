'use strict';
const ScreaminServer = require('@screaminsauce/screaminserver');
const GspfModuleStaticGui = require('..').staticGui;

const server = new ScreaminServer({
    name: 'gspfScreenTest',
    options: {
        port: 3000,
        host: 'localhost'
    },
    modules: [GspfModuleStaticGui]
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