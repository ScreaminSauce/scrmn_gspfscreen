'use strict';
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

class EventsLib {
    constructor(logger, dbConn){
        this.logger = logger;
        this._eventsCollection = dbConn.collection('events');
    }

    getAllEvents(){
        return this._eventsCollection.find({}).toArray()
            .then((results)=>{
                return results.sort(function(objA, objB){
                    return moment.utc(objA.startTime).diff(moment.utc(objB.startTime))
                })
            })
    }

    createEvent(event){
        return this._eventsCollection.insertOne(event)
            .then((result)=>{
                return result.ops[0];
            })
    }

    updateEvent(id, updateInfo){
        let ops = {
            "$set": updateInfo
        }
        return this._eventsCollection.findOneAndUpdate({"_id":ObjectId(id)}, ops, {returnOriginal: false})
        .then((result)=>{
            return result.value;
        })

    }

    deleteEvent(id){
        return this._eventsCollection.findOneAndDelete({"_id":ObjectId(id)});
    }
}

module.exports = EventsLib;