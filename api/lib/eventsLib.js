'use strict';
const ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

class EventsLib {
    constructor(logger, dbConns){
        this.logger = logger;
        this._dbClient = dbConns.getConnection('gspfscreen');
        this._eventsCollection = this._dbClient.collection('events');
    }

    getAllEvents(){
        return this._eventsCollection.find({}).toArray()
            .then((results)=>{
                return results.sort(function(objA, objB){
                    return moment.utc(objA.startTime).diff(moment.utc(objB.startTime))
                })
            })
    }

    getEvent(id){
        return this._eventsCollection.find({_id: ObjectId(id)});
    }

    createEvent(event){
        return this._eventsCollection.insertOne(event)
            .then((result)=>{
                return this.getEvent(result.insertedId);
            })
    }

    updateEvent(id, updateInfo){
        let ops = {
            "$set": updateInfo
        }
        return this._eventsCollection.findOneAndUpdate({"_id":ObjectId(id)}, ops, { returnDocument: 'after' })
        .then((result)=>{
            return result.value;
        })

    }

    deleteEvent(id){
        return this._eventsCollection.findOneAndDelete({"_id":ObjectId(id)});
    }
}

module.exports = EventsLib;