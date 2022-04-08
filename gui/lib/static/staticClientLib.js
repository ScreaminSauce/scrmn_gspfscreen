const staticData = require('./staticData');

class ClientLib {
    static getScreenConfig(){
        return Promise.resolve(staticData.screenConfig);
    }

    static getEvents(){
        return Promise.resolve(staticData.events);
    }

    static getInfoItems(){
        return Promise.resolve(staticData.infoItems);
    }
}

module.exports = ClientLib;