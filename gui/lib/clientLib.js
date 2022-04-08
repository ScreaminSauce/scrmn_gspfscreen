const dynamicClientLib = require('./dynamic/dynamicClientLib');
const staticClientLib = require('./static/staticClientLib');

function getClientLib(){
    // TODO: Hack, but needed for pi screens to not need internet.
    // webpack-dotenv replaces this with boolean.
    return process.env.STATIC_MODE ? staticClientLib : dynamicClientLib;
}

module.exports = getClientLib();
