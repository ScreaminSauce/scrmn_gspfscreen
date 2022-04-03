'use strict';
const ObjectId = require('mongodb').ObjectID;

class InfoLib {
    constructor(logger, dbConns){
        this.logger = logger;
        this._dbClient = dbConns.getConnection('gspfscreen');
        this._infoCollection = this._dbClient.collection('info');
    }

    getAllInfoItems(){
        return this._infoCollection.find({}).toArray();
    }

    getInfoItem(id){
        return this._infoCollection.find({_id: ObjectId(id)});
    }

    createInfoItem(item){
        return this._infoCollection.insertOne(item)
            .then((result)=>{
                return this.getInfoItem(result.insertedId);
            })
    }

    updateInfoItem(id, updateInfo){
        let ops = {
            "$set": updateInfo
        }
        return this._infoCollection.findOneAndUpdate({"_id":ObjectId(id)}, ops, { returnDocument: 'after' })
        .then((result)=>{
            return result.value;
        })

    }

    deleteInfoItem(id){
        return this._infoCollection.findOneAndDelete({"_id":ObjectId(id)});
    }
}

module.exports = InfoLib;