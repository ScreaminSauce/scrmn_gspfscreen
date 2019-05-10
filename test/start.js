const ScreaminServer = require('@screaminsauce/screaminserver');
const authModule = require('@screaminsauce/scrmn_auth');
const devModule = require("../")

let server = new ScreaminServer({
    name: 'gspfScreenTest',
    options: {
        port: 3000,
        host: 'localhost'
    },
    modules: [authModule, devModule],
    auth: {
        secret: 'ThisIsATestSecretThisIsATestSecretThisIsATestSecret',
        cookieName: "screaminCookie",
        redirectTo: false,
        isSecure: false
    }
});

process.on('unhandledRejection', (err)=>{
    console.log(err);
    process.exit(1);
})

server.startup();;