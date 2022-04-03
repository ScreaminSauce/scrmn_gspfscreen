'use strict';
const ObjectId = require('mongodb').ObjectID;

class AnnouncementsLib {
    constructor(logger, dbConns){
        this.logger = logger;
        this._dbClient = dbConns.getConnection('gspfscreen');
        this._annCollection = this._dbClient.collection('announcements');
    }

    getAllAnnouncements(){
        return this._annCollection.find({}).toArray();
    }

    getAnnouncement(id){
        return this._annCollection.find({_id: ObjectId(id)});
    }

    createAnnouncement(ann){
        return this._annCollection.insertOne(ann)
            .then((result)=>{
                return this.getAnnouncement(result.insertedId);
            })
    }

    updateAnnouncement(id, updateInfo){
        let ops = {
            "$set": updateInfo
        }
        return this._annCollection.findOneAndUpdate({"_id":ObjectId(id)}, ops, { returnDocument: 'after' })
        .then((result)=>{
            return result.value;
        })

    }

    deleteAnnouncement(id){
        return this._annCollection.findOneAndDelete({"_id":ObjectId(id)});
    }
}

module.exports = AnnouncementsLib;