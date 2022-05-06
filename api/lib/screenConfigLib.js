'use strict';
const ObjectId = require('mongodb').ObjectID;

class ScreenConfigLib {
    constructor(logger, dbConns){
        this.logger = logger;
        this._dbClient = dbConns.getConnection('gspfscreen');
        this._collection = this._dbClient.collection('config');
        this._defaultConfig = { 
            "displayOrder" : [ 
                {
                    "componentName" : "display-url", 
                    "config":{url:"https://www.neverdrains.com/gspf2022/standingsDisplay.php", count: 1},
                    "durationInSeconds" : 30
                },
                { 
                    "componentName" : "upcomingevents-main", 
                    "config":{test:true, count: 1},
                    "durationInSeconds" : 30
                }, 
                { 
                    "componentName" : "sponsors-main", 
                    "config":{displayurl:"https://blah", count: 2},
                    "durationInSeconds" : 10  
                },
                {
                    "componentName":"infoitems-main",
                    "config":{test:false, count: 3},
                    "durationInSeconds": 30 //20
                },
                // {
                //     "displayName": "Tomorrows Events",
                //     "componentName":"tomorrowevents-main",
                //     "durationInSeconds": "20" //20
                // }
            ] 
        }

    }

    getConfig(){
        return this._collection.findOne({}, {projection: {_id:0}})
            .then((result)=>{
                if (!result){
                    return this.createDefaultConfig();
                } else {
                    return result;
                }
            })
    }

    createDefaultConfig(){
        return this._collection.insertOne(this._defaultConfig)
            .then(()=>{
                return this.getConfig();
            })
    }

    updateConfig(updateConfig){
        return this._collection.findOne({})
            .then((result)=>{
                // return this._collection.findOneAndUpdate({"_id":ObjectId(result.insertedId)}, ops, { returnDocument: 'after' })
                return this._collection.replaceOne({"_id":ObjectId(result._id)}, updateConfig);
            })
            .then(()=>{
                return this.getConfig();
            })
    }
}

module.exports = ScreenConfigLib;