'use strict';
const ObjectId = require('mongodb').ObjectID;

class InfoLib {
    constructor(logger, dbConn){
        this.logger = logger;
        this._infoCollection = dbConn.collection('info');
    }

    getAllInfoItems(){
        return this._infoCollection.find({}).toArray();
    }

    createInfoItem(item){
        return this._infoCollection.insertOne(item)
            .then((result)=>{
                return result.ops[0];
            })
    }

    updateInfoItem(id, updateInfo){
        let ops = {
            "$set": updateInfo
        }
        return this._infoCollection.findOneAndUpdate({"_id":ObjectId(id)}, ops, {returnOriginal: false})
        .then((result)=>{
            return result.value;
        })

    }

    deleteInfoItem(id){
        return this._infoCollection.findOneAndDelete({"_id":ObjectId(id)});
    }
}

module.exports = InfoLib;