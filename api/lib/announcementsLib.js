'use strict';
const ObjectId = require('mongodb').ObjectID;

class AnnouncementsLib {
    constructor(logger, dbConn){
        this.logger = logger;
        this._annCollection = dbConn.collection('announcements');
    }

    getAllAnnouncements(){
        return this._annCollection.find({}).toArray();
    }

    createAnnouncement(ann){
        return this._annCollection.insertOne(ann)
            .then((result)=>{
                return result.ops[0];
            })
    }

    updateAnnouncement(id, updateInfo){
        let ops = {
            "$set": updateInfo
        }
        return this._annCollection.findOneAndUpdate({"_id":ObjectId(id)}, ops, {returnOriginal: false})
        .then((result)=>{
            return result.value;
        })

    }

    deleteAnnouncement(id){
        return this._annCollection.findOneAndDelete({"_id":ObjectId(id)});
    }
}

module.exports = AnnouncementsLib;